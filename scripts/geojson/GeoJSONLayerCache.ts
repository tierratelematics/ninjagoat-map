import { Layer } from "leaflet";
import { Dictionary } from "ninjagoat";
import { GeoJSONFeature } from "./GeoJSONProps";

export class GeoJSONLayerCache {
    public layers: Dictionary<Layer>;
    public features: Dictionary<GeoJSONFeature>;

    private updated: Dictionary<GeoJSONFeature>;

    constructor() {
        this.layers = {};
        this.features = {};
    }

    public clear() {
        this.updated = {};
    }

    public add(id: string, feature: GeoJSONFeature, layer: Layer): void {
        this.features[id] = this.updated[id] = feature;
        this.layers[id] = layer;
    }

    public remove(id: string): void {
        delete this.features[id];
        delete this.layers[id];
    }

    public has(id: string): boolean {
        return !!this.features[id];
    }

    public isUpdated(id: string): boolean {
        return !!this.updated[id];
    }
}
