import {LayerType, MapObservableFactory} from "../LayerRegistration";

interface ILayerBinder {
    bind<T>(source: MapObservableFactory<T>, type: LayerType, options: any);
}

export default ILayerBinder