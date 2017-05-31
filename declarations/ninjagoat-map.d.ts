/// <reference types="leaflet" />
/// <reference types="react-leaflet" />
import * as React from "react";
import { interfaces } from "inversify";
import { IModule, IViewModelRegistry, IServiceLocator } from "ninjagoat";
import { Observable } from "rx";
import {
    GeoJSONOptions,
    LatLng,
    LatLngBounds,
    LatLngExpression,
    Layer,
    Icon
} from "leaflet";
import { TileLayerProps, WMSTileLayerProps } from "react-leaflet";

export class MapModule implements IModule {

    modules: (container: interfaces.Container) => void;

    register(registry: IViewModelRegistry, serviceLocator?: IServiceLocator, overrides?: any): void;

}

export type MapProps = {
    center?: LatLngExpression,
    zoom?: number,
    onMapReady?: () => void
}

export const Map: React.ComponentClass<MapProps>;

export type MapObservableFactory<T> = (context: MapContext) => Observable<T>;

export type MapContext = {
    bounds: LatLngBounds,
    zoom: number
}

export type ObservableLayerProps<T> = { observable: MapObservableFactory<T> };

declare abstract class MapLayer<P> extends React.Component<P, any> {

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

type SupportedGeometries = GeoJSON.Point | GeoJSON.Polygon | GeoJSON.MultiPolygon;

export type GeoJSONCollection = GeoJSON.FeatureCollection<SupportedGeometries>;

export type GeoJSONFeature = GeoJSON.Feature<SupportedGeometries>;

export type GeoJSONProps = GeoJSONOptions & {
    observable: MapObservableFactory<GeoJSONCollection>,
    icon?: (feature: GeoJSONFeature) => Icon,
    onMarkerClick?: (feature: GeoJSONFeature) => void,
    getPopupContent?: (feature: GeoJSONFeature) => JSX.Element,
    isPopupOpen?: (feature: GeoJSONFeature) => boolean,
    getFeatureId?: (feature: GeoJSONFeature) => string
};

export const TileLayer: React.ComponentClass<TileLayerProps>;

export const WMSTileLayer: React.ComponentClass<WMSTileLayerProps>;

export interface IMapBoundaries {
    getCenter(): LatLng;
    getBounds(): LatLngBounds;
    getZoom(): number;
    setCenter(center: LatLng, zoom?: number);
    boundsChanges(): Observable<void>;
}

type DrawingLayerProps = GeoJSONProps & { onChange: (shapes: GeoJSONCollection) => void };

export const DrawingLayer: React.ComponentClass<DrawingLayerProps>;

export const DrawControl: React.ComponentClass<any>;

export type GeocodingControlProps = {
    position: string;
    style?: "bar" | "button",
    showMarker?: boolean,
    marker?: {
        icon: Icon,
        draggable?: boolean,
    },
    searchLabel?: string
};

export const GeocodingControl: React.ComponentClass<GeocodingControlProps>;

export interface IGeocodingProvider {
    search(query: { query: string }): Promise<any[]>;
}

export interface IApiKeyConfig {
    key: string;
}

export { latLng, latLngBounds, LatLng, LatLngBounds, Marker, marker, Icon, icon } from "leaflet";