import * as _ from "lodash";
import ILayerView from "../layer/ILayerView";
import { Layer, polyline, LayerGroup, latLng, Polyline } from "leaflet";
import { inject, injectable } from "inversify";
import { GeoJSONCollection, GeoJSONFeature } from "../geojson/GeoJSONProps";
import IMapHolder from "../leaflet/IMapHolder";
import { render } from "react-dom";
import { PathProps } from "./PathProps";
import { map } from "lodash";

@injectable()
export class PathLayerView implements ILayerView<GeoJSONCollection, PathProps> {
    type = "Path";

    constructor(@inject("IMapHolder") private mapHolder: IMapHolder) { }

    create(options: PathProps): Layer | LayerGroup {
        return polyline([], options);
    }

    update(fromProps: GeoJSONCollection, toProps: GeoJSONCollection, layer: Polyline, options: PathProps) {
        if (!toProps || !toProps.features) return;

        let points = map(toProps.features, feature => {
            let coordinates = feature.geometry.coordinates[0];
            return latLng(coordinates[1], coordinates[0]);
        });
        
        layer.setLatLngs(points);
    }
}
