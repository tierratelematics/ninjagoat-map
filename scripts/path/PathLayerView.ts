import { inject, injectable } from "inversify";
import { latLng, polyline, Polyline, Layer } from "leaflet";
import { map } from "lodash";
import { GeoJSONCollection } from "../geojson/GeoJSONProps";
import ILayerView from "../layer/ILayerView";
import IMapHolder from "../leaflet/IMapHolder";
import { PathProps } from "./PathProps";

@injectable()
export class PathLayerView implements ILayerView<GeoJSONCollection, PathProps> {
    private options: PathProps;
    private layer: Polyline;
    
    constructor(@inject("IMapHolder") private mapHolder: IMapHolder) { }

    create(options: PathProps): Layer {
        this.options = options;
        this.layer = polyline([], options);
        return this.layer;
    }

    update(fromProps: GeoJSONCollection, toProps: GeoJSONCollection) {
        if (!toProps || !toProps.features) return;

        let points = map(toProps.features, feature => {
            let coordinates = feature.geometry.coordinates as number[];
            return latLng(coordinates[1], coordinates[0]);
        });
        
        this.layer.setLatLngs(points);
    }

    dispose(): void {
    }
}
