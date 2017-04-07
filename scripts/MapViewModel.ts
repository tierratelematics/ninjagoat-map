import {ObservableViewModel} from "ninjagoat";
import {LayerEntry} from "./LayerRegistration";

abstract class MapViewModel<T> extends ObservableViewModel<T> {

    layers: LayerEntry<any>[] = [];

    constructor() {
        super();
        this.layers = this.defineLayers();
    }

    abstract defineLayers(): LayerEntry<any> [];
}

export default MapViewModel
