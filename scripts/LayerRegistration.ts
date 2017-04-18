import {LatLngBounds} from "leaflet";
import {Observable} from "rx";

export type MapObservableFactory<T> = (context: MapContext) => Observable<T>;

export type LayerType = "GeoJSON";

export type MapContext = {
    bounds: LatLngBounds,
    zoom: number
};
