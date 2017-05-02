/// <reference path="../declarations/react-leaflet.d.ts" />
/// <reference types="leaflet" />
/// <reference types="react-leaflet" />
import * as React from "react";
import {interfaces} from "inversify";
import {IModule, IViewModelRegistry, IServiceLocator} from "ninjagoat";
import {Observable} from "rx";
import {LatLngBounds, GeoJSONOptions, LatLng, LatLngExpression} from "leaflet";
import {Path, TileLayerProps, WMSTileLayerProps, FeatureGroupProps} from "react-leaflet";

export class MapModule implements IModule {

    modules: (container: interfaces.Container) => void;

    register(registry: IViewModelRegistry, serviceLocator?: IServiceLocator, overrides?: any): void;

}

export type MapProps = {
    center?: LatLngExpression,
    zoom?: number
}

export class NinjagoatMap extends React.Component<MapProps, void> {
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
    getLayerType(props: GeoJSONProps): string;
}

export type GeoJSONCollection = GeoJSON.FeatureCollection<GeoJSON.GeometryObject>;

export type GeoJSONProps = GeoJSONOptions & {observable: MapObservableFactory<GeoJSONCollection>};

export const TileLayer: React.ComponentClass<TileLayerProps>;

export const WMSTileLayer: React.ComponentClass<WMSTileLayerProps>;

export interface IMapBoundaries {
    getCenter(): LatLng;
    getBounds(): LatLngBounds;
    getZoom(): number;
    setCenter(center: LatLng, zoom?: number);
    boundsChanges(): Observable<void>;
}

export class CoordinatesUtil {
    static latLng(latitude: number, longitude: number): LatLng;
}

export class FeatureLayer extends ObservableLayer<GeoJSONProps> {
    getLayerType(props: GeoJSONProps): string;
}

export const EditControl: React.ComponentClass<any>;

