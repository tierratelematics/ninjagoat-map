import * as React from "react";
import {EditControl as DrawEditControl} from "react-leaflet-draw";
import {lazyInject, Dictionary} from "ninjagoat";
import {map} from "lodash";
import {GeoJSONCollection, GeoJSONFeature} from "../geojson/GeoJSONProps";
import {Circle, LayerGroup, Layer} from "leaflet";
import IShapeTransformer from "./IShapeTransformer";

class EditControl extends React.Component<{onChange: (shapes: GeoJSONCollection) => void} & any, any> {

    @lazyInject("LayersCache")
    private layersCache: Dictionary<Layer|LayerGroup>;
    @lazyInject("IShapeTransformer")
    private shapeTransformer: IShapeTransformer;

    render() {
        return <DrawEditControl {...this.props} onCreated={this.notifyShapes.bind(this)}
                                                onEdited={this.notifyShapes.bind(this)}
                                                onDeleted={this.notifyShapes.bind(this)}/>;
    }

    notifyShapes() {
        this.props.onChange && this.props.onChange({
            "type": "FeatureCollection",
            "features": this.combineShapes()
        });
    }

    combineShapes(): GeoJSONFeature[] {
        let layers = (this.layersCache["Feature"] as LayerGroup).getLayers();
        return map(layers, (shape: any) => {
            let geojson = shape.toGeoJSON();
            if (shape instanceof Circle)
                geojson.properties.radius = shape.getRadius();
            return this.shapeTransformer.transform(geojson);
        });
    }

}

export default EditControl