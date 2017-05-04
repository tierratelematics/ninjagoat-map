import {Layer, LayerGroup} from "leaflet";
import {MapObservableFactory} from "./MapContext";
import {Observable} from "rx";

interface ILayerBinder {
    bind<T>(source: MapObservableFactory<T>, type: string, options: any): [Layer | LayerGroup, Observable<void>]
}

export default ILayerBinder