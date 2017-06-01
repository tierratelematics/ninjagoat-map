import { Layer } from "leaflet";
import { Dictionary } from "ninjagoat";
import { GeoJSONFeature } from "./GeoJSONProps";

export interface IGeoJSONLayerCache {
    layers: Dictionary<Layer>;
    features: Dictionary<GeoJSONFeature>;

    init(): void;
    clear(): void;
    add(id: string, feature: GeoJSONFeature, layer: Layer): void;
    remove(id: string): void;
    has(id: string): boolean;
}
