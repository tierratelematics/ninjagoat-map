import {Layer} from "leaflet";
import {MapObservableFactory} from "./MapContext";
import {Observable} from "rx";

interface ILayerBinder {
    bind<T>(source: MapObservableFactory<T>, type: string, options: any): [Layer, Observable<void>]
}

export default ILayerBinder