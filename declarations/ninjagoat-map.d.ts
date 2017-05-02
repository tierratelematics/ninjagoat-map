/// <reference path="../declarations/react-leaflet.d.ts" />
/// <reference types="leaflet" />
/// <reference types="react-leaflet" />
import * as React from "react";
import {interfaces} from "inversify";
import {IModule, IViewModelRegistry, IServiceLocator} from "ninjagoat";
import {Observable} from "rx";
import {LatLngBounds, GeoJSONOptions, LatLng, LatLngExpression, Layer} from "leaflet";
import {TileLayerProps, WMSTileLayerProps, FeatureGroup} from "react-leaflet";

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

declare abstract class MapLayer<P> extends FeatureGroup<P> {

    abstract createLeafletElement(props: P): Layer;

    updateLeafletElement(fromProps: P, toProps: P);
}

declare abstract class ObservableLayer<P extends ObservableLayerProps<any>> extends MapLayer<P> {

    createLeafletElement(props: P): Layer;

    abstract getLayerType(props: P): string;
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

