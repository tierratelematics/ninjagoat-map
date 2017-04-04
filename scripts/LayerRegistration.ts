import {LatLngBounds} from "leaflet";
import {Observable} from "rx";

export type LayerEntry<T> = {
    type: LayerType,
    observable: (context: MapContext) => Observable<T>
};

export type LayerType = "GeoJSON";

export type MapContext = {
    bounds: LatLngBounds,
    zoom: number
};
