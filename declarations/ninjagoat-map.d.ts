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

type MapObservableFactory<T> = (context: MapContext) => Observable<T>;

export type MapContext = {
    bounds: LatLngBounds,
    zoom: number
}

type GeoJSONProps = GeoJSON.FeatureCollection<GeoJSON.GeometryObject>;
