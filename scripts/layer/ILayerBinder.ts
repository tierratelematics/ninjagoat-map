import {Layer} from "leaflet";
import {MapObservableFactory, LayerType} from "./LayerRegistration";

interface ILayerBinder {
    bind<T>(source: MapObservableFactory<T>, type: LayerType, options: any): Layer
}

export default ILayerBinder