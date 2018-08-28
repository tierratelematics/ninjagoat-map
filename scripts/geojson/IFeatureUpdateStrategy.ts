import { GeoJSONFeature, ClusterProps } from "./GeoJSONProps";
import { Layer } from "leaflet";

export interface IFeatureUpdateStrategy {
    addFeature(layer: Layer, feature: GeoJSONFeature, options: ClusterProps): Layer;
    updateFeature(previousLayer: Layer, previousFeature: GeoJSONFeature, feature: GeoJSONFeature, options: ClusterProps): Layer;
}