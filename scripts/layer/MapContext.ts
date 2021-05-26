import {LatLngBounds} from "leaflet";
import {Observable} from "rxjs";

export type MapObservableFactory<T> = (context: MapContext) => Observable<T>;

export type MapContext = {
    bounds: LatLngBounds,
    zoom: number
}
