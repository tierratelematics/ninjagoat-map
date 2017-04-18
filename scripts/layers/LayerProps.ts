import {MapObservableFactory} from "../LayerRegistration";

interface LayerProps<TData, TOptions> {
    observable: MapObservableFactory<TData>,
    options: TOptions
}

export default LayerProps