import { GeoJSONFeature, ClusterProps } from "./GeoJSONProps";
import { Layer, LayerGroup } from "leaflet";

export interface IFeatureRendeder {
    addFeature(layer: Layer, feature: GeoJSONFeature, options: ClusterProps, layerGroup: LayerGroup): Layer;
    updateFeature(previousLayer: Layer, previousFeature: GeoJSONFeature, feature: GeoJSONFeature, options: ClusterProps, layerGroup: LayerGroup): Layer;
}