import { injectable } from "inversify";
import { GeoJSONLayerCache } from "./GeoJSONLayerCache";
import { LayerGroup } from "leaflet";

@injectable()
export class GeoJSONLayerCacheFactory {
    for(layer: LayerGroup): GeoJSONLayerCache {
        return new GeoJSONLayerCache();
    }
} 