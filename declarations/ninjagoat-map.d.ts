import * as React from "react";
import {interfaces} from "inversify";
import {IModule, IViewModelRegistry, IServiceLocator} from "ninjagoat";
import {Observable} from "rx";
import {LatLngBounds} from "leaflet";

export class MapModule implements IModule {

    modules: (container: interfaces.Container) => void;

    register(registry: IViewModelRegistry, serviceLocator?: IServiceLocator, overrides?: any): void;

}

export class NinjagoatMap extends React.Component<void, void> {
    render();
}

declare class LayerView<TProps, TOptions> extends React.Component<LayerProps<TProps, TOptions>, void> {
    render();
}

interface LayerProps<TData, TOptions> {
    observable: MapObservableFactory<TData>,
    options: TOptions
}

type MapObservableFactory<T> = (context: MapContext) => Observable<T>;

export type MapContext = {
    bounds: LatLngBounds,
    zoom: number
}

export class GeoJSON extends LayerView<GeoJSONProps, void> {

}

type GeoJSONProps = GeoJSON.FeatureCollection<GeoJSON.GeometryObject>;

export class Tile extends LayerView<TileProps, void> {

}

type TileProps = {
    url: string;
}