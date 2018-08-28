import { IFeatureUpdateStrategy } from "./IFeatureUpdateStrategy";
import { injectable, inject } from "inversify";
import IMapHolder from "../leaflet/IMapHolder";
import { Layer, GeoJSON as GeoJSONLeaflet } from "leaflet";
import { GeoJSONFeature, ClusterProps } from "./GeoJSONProps";
import { isEqual } from "lodash";
import { GeoJSONLayerCache } from "./GeoJSONLayerCache";

@injectable()
export class ShapeUpdateStrategy implements IFeatureUpdateStrategy {
    constructor(@inject("IMapHolder") private mapHolder: IMapHolder, 
        @inject("GeoJSONLayerCache") private cache: GeoJSONLayerCache) { }

    addFeature(layer: Layer, feature: GeoJSONFeature, options: ClusterProps): Layer {
        return layer;
    }

    updateFeature(previousLayer: Layer, previousFeature: GeoJSONFeature, feature: GeoJSONFeature, options: ClusterProps): Layer {
        let layer: Layer = previousLayer;
        if(!isEqual(previousFeature, feature)){
            layer = GeoJSONLeaflet.geometryToLayer(feature, options);
            this.mapHolder.obtainMap().removeLayer(previousLayer);
            this.mapHolder.obtainMap().addLayer(layer);    
        }

        return layer;
    }
}