import {ObservableViewModel} from "ninjagoat";
import {LayerEntry} from "./LayerRegistration";
import {multiInject} from "inversify";

class MapViewModel extends ObservableViewModel<void> {

    layers: LayerEntry<any>[] = [];

    constructor(@multiInject("LayerEntry") layers: LayerEntry<any>[]) {
        super();
        this.layers = layers;
    }

    protected onData(data: void): void {
    }
}

export default MapViewModel
