import { injectable } from "inversify";
import { GeoJSONLayerCache } from "./GeoJSONLayerCache";
import { LayerGroup } from "leaflet";

@injectable()
export class GeoJSONLayerCacheFactory {
    create(): GeoJSONLayerCache {
        return new GeoJSONLayerCache();
    }
} 