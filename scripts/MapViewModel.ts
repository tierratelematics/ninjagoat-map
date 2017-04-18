import {ObservableViewModel, Dictionary} from "ninjagoat";
import {MapObservableFactory} from "./LayerRegistration";

abstract class MapViewModel<T> extends ObservableViewModel<T> {
    abstract defineSources(): Dictionary<MapObservableFactory<any>>;
}

export default MapViewModel
