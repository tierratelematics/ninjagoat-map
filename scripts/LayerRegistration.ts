import {LatLngBounds} from "leaflet";
import {Observable} from "rx";

export type MapObservableFactory<T> = (context: MapContext) => Observable<T>;

export type LayerEntry<TData, TOptions> = {
    type: LayerType;
    observable: MapObservableFactory<TData>;
    options: TOptions
};

export type LayerType = "GeoJSON" | "Tile";

export type MapContext = {
    bounds: LatLngBounds,
    zoom: number
};
