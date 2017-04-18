import {LayerType, MapObservableFactory} from "../LayerRegistration";

interface ILayerPresenter {
    present<T>(source: MapObservableFactory<T>, type: LayerType, options: any);
}

export default ILayerPresenter