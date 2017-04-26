import {LayerType, MapObservableFactory} from "../LayerRegistration";
import {Layer} from "leaflet";

interface ILayerBinder {
    bind<T>(source: MapObservableFactory<T>, type: LayerType, options: any): Layer
}

export default ILayerBinder