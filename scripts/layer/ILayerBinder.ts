import {Layer, LayerGroup} from "leaflet";
import {MapObservableFactory} from "./MapContext";
import {Observable} from "rx";
import ILayerView from "./ILayerView";
import { IDisposable } from "../IDisposable";

interface ILayerBinder extends IDisposable {
    bind<T>(source: MapObservableFactory<T>, type: string, options: any): [Layer | LayerGroup, Observable<void>]
}

export default ILayerBinder