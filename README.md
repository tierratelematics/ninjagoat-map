# Ninjagoat-map

Ninjagoat bindings for a leaflet map.

## Installation

`
$ npm install ninjagoat-map
`

Register the module with ninjagoat

```typescript
//bootstrapper.ts
import {MapModule} from "ninjagoat-map";

application.register(new MapModule())
```

Add leaflet css and images

```scss
/*boostrapper.scss*/

@import "../../node_modules/ninjagoat-map/node_modules/leaflet/dist/leaflet.css";
@import "../../node_modules/ninjagoat-map/node_modules/leaflet-draw/dist/leaflet.draw.css";
```

```javascript
//smildfile.js

const {CopyDirectory} = require("smild-extra");

module.exports = {
    "projectType": "frontend",
    "postBuild": (buildHelper) => Promise.all([
        CopyDirectory("node_modules/ninjagoat-map/node_modules/leaflet/dist/images/**/*", `dist/${buildHelper.getCurrentTarget()}/css/images`),
        CopyDirectory("node_modules/ninjagoat-map/node_modules/leaflet-draw/dist/images/**/*", `dist/${buildHelper.getCurrentTarget()}/css/images`)
    ])
};
```

Set the dimensions of your map

```scss
.leaflet-container {
	height: 400px;
	width: 80%;
	margin: 0 auto;
}
```

And it's configured!

## Usage

### Initialize a tiled map

Ninjagoat map doesn't need a specific viewmodel to work with, so you can just register a simple ObservableViewModel bound with a map view.
The map can be initialized with a custom center and zoom level and accepts layers (and controls) as children.

```typescript
import {View} from "ninjagoat";
import * as React from "react";
import {Map, TileLayer} from "ninjagoat-map";

export default class MapView extends View<any> {

    render() {
        return <Map center={[30, 30]} zoom={10}>
                    <TileLayer url={"http://{s}.tile.osm.org/{z}/{x}/{y}.png"}/>
                </Map>
    }
}
```

In this example the tiles are rendered by OpenStreetMap but can configured to work with every map provider (e.g. Mapbox).
 
### Display data 

Data is displayed using a GeoJSON layer attached to an observable of type FeatureCollection.
Register an observable factory in your viewmodel and pass it to the geojson layer.
Every time the map is moved the observable will be recreated with the current bounds (in this case a marker is pinned in the center of the bounds).

```typescript
//MapViewModel.ts

import {ObservableViewModel, ViewModel} from "ninjagoat";
import {MapContext} from "ninjagoat-map";
import {Observable} from "rx";

@ViewModel("MapIndex")
class MapViewModel extends ObservableViewModel<void> {

    sources = {
        marker: (context: MapContext) => Observable.just(<any>{
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [context.bounds.getCenter().lng, context.bounds.getCenter().lat]
                    },
                    "properties": {}
                }
            ]
        })
    };

    protected onData(data: any) {

    }
}

export default MapViewModel

//MapView.ts
import {GeoJSONLayer} from "ninjagoat-map";

<Map center={[30, 30]} zoom={10}>
    <TileLayer url={"http://{s}.tile.osm.org/{z}/{x}/{y}.png"}/>
    <GeoJSONLayer observable={this.vieModel.sources.marker}/>
</Map>
```

### Draw and edit shapes

Drawing shapes on the map follows the same principles of using the GeoJSONLayer.
To restore some previously drawn shapes on map just use a drawing layer. 
After you have defined a observable factory of shapes in your viewmodel you can add them to the view.

```typescript
//MapView.ts
import {DrawingLayer} from "ninjagoat-map";

<Map center={[30, 30]} zoom={10}>
    <TileLayer url={"http://{s}.tile.osm.org/{z}/{x}/{y}.png"}/>
    <DrawingLayer observable={this.vieModel.sources.shapes} />
</Map>
```

To add drawing and editing capabilities some default draw controls are provided (but you can pass your own).

```typescript
//MapView.ts
import {DrawingLayer, DrawControl} from "ninjagoat-map";

<Map center={[30, 30]} zoom={10}>
    <TileLayer url={"http://{s}.tile.osm.org/{z}/{x}/{y}.png"}/>
    <DrawingLayer observable={this.vieModel.sources.shapes}>
        <DrawControl position="topright" />
    </DrawingLayer>
</Map>
```

To get notified of the shapes changes when drawing or editing you can add an onChange event handler on the DrawingLayer.
The callback will be filled with a FeatureCollection of all the shapes on the drawing layer.
Here's an example of a simple drawing and editing layer.

```typescript
import {GeoJSONCollection} from "ninjagoat-map";

class MapViewModel extends ObservableViewModel<void> {

    savedShapes: GeoJSONCollection;

    sources = {
        draw: context => Observable.just(this.savedShapes)
    };

    protected onData(data: any) {

    }
    
    saveShapes(shapes: GeoJSONCollection) {
        this.savedShapes = shapes;
    }
}

//MapView.ts
import {DrawingLayer, DrawControl} from "ninjagoat-map";

<Map center={[30, 30]} zoom={10}>
    <TileLayer url={"http://{s}.tile.osm.org/{z}/{x}/{y}.png"}/>
    <DrawingLayer observable={this.vieModel.sources.draw} onChange={this.viewModel.saveShapes.bind(this.viewModel)}>
        <DrawControl position="topright" />
    </DrawingLayer>
</Map>
```

The DrawControl can be customized using the options provided by [leaflet-draw](https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html).

### Map services

Some map services are defined to work with the map: the most important is the MapBoundaries.
You can inject it in your viewmodels to manipulate the map view. Here is how it's defined.

```typescript
interface IMapBoundaries {
    getCenter(): LatLng;
    getBounds(): LatLngBounds;
    getZoom(): number;
    setCenter(center: LatLng, zoom?: number);
    boundsChanges(): Observable<void>;
}
```

## License

Copyright 2016 Tierra SpA

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
