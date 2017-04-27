import {Layer} from "leaflet";
import {MapObservableFactory} from "./MapContext";

interface ILayerBinder {
    bind<T>(source: MapObservableFactory<T>, type: string, options: any): Layer
}

export default ILayerBinder