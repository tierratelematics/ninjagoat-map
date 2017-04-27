import {MapObservableFactory} from "./MapContext";

interface LayerProps<TData, TOptions> {
    observable: MapObservableFactory<TData>,
    options?: TOptions
}

export default LayerProps