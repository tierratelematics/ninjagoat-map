import ILayerView from "./ILayerView";
import { LayerGroup, Layer } from "leaflet";

export interface ILayerFactory {
    create<TProps = any, TOptions = any>(type: string, options: TOptions): [Layer | LayerGroup, ILayerView<TProps, TOptions>];
}

export type Factory<T> = (...args: any[]) => T;