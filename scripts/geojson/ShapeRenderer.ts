import { IFeatureRendeder } from "./IFeatureRenderer";
import { injectable, inject } from "inversify";
import { Layer, GeoJSON as GeoJSONLeaflet, LayerGroup } from "leaflet";
import { GeoJSONFeature, ClusterProps } from "./GeoJSONProps";
import { isEqual } from "lodash";

@injectable()
export class ShapeRenderer implements IFeatureRendeder {
    constructor() { }

    addFeature(layer: Layer, feature: GeoJSONFeature, options: ClusterProps): Layer {
        return layer;
    }

    updateFeature(previousLayer: Layer, previousFeature: GeoJSONFeature, feature: GeoJSONFeature, options: ClusterProps, layerGroup: LayerGroup): Layer {
        let layer: Layer = previousLayer;
        if(!isEqual(previousFeature, feature)){
            layer = new GeoJSONLeaflet(feature, options).getLayers()[0];
            layerGroup.removeLayer(previousLayer);
            layerGroup.addLayer(layer);    
        }

        return layer;
    }
}