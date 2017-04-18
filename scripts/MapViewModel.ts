import {ObservableViewModel, Dictionary} from "ninjagoat";
import {MapObservableFactory, LayerEntry} from "./LayerRegistration";
import {inject} from "inversify";
import ILayerPresenter from "./interfaces/ILayerPresenter";

abstract class MapViewModel<T> extends ObservableViewModel<T> {

    protected layers: LayerEntry[];

    constructor(@inject("ILayerPresenter") protected layerPresenter: ILayerPresenter) {
        super();
    }

    abstract defineSources(): Dictionary<MapObservableFactory<any>>;

    setLayers(layers: LayerEntry[]) {
        this.layers = layers;
    }

    present() {

    }
}

export default MapViewModel
