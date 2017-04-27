/// <reference path="../declarations/react-leaflet.d.ts" />
/// <reference types="leaflet" />
/// <reference types="react-leaflet" />
import * as React from "react";
import {interfaces} from "inversify";
import {IModule, IViewModelRegistry, IServiceLocator} from "ninjagoat";
import {Observable} from "rx";
import {LatLngBounds, GeoJSONOptions} from "leaflet";
import {Path, TileLayerProps, WMSTileLayerProps} from "react-leaflet";

export class MapModule implements IModule {

    modules: (container: interfaces.Container) => void;

    register(registry: IViewModelRegistry, serviceLocator?: IServiceLocator, overrides?: any): void;

}

export class NinjagoatMap extends React.Component<void, void> {
    render();
}

export type MapObservableFactory<T> = (context: MapContext) => Observable<T>;

export type MapContext = {
    bounds: LatLngBounds,
    zoom: number
}

export type ObservableLayerProps<T> = {observable: MapObservableFactory<T>};

declare abstract class ObservableLayer<P extends ObservableLayerProps<any>> extends Path {

    static contextTypes;

    createLeafletElement(props: P): Object;

    abstract getLayerType(props: P): string;

    updateLeafletElement(fromProps: P, toProps: P);
}

export class GeoJSONLayer extends ObservableLayer<GeoJSONProps> {
    getLayerType(props: Object): string;
}

export type GeoJSON = GeoJSON.FeatureCollection<GeoJSON.GeometryObject>;

export type GeoJSONProps = GeoJSONOptions & {observable: MapObservableFactory<GeoJSON>};

export const TileLayer: React.ComponentClass<TileLayerProps>;

export const WMSTileLayer: React.ComponentClass<WMSTileLayerProps>;