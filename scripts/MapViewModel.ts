import {ObservableViewModel, Dictionary} from "ninjagoat";
import {MapObservableFactory, LayerEntry} from "./LayerRegistration";
import {inject} from "inversify";
import ILayerPresenter from "./interfaces/ILayerPresenter";
import {forEach} from "lodash";

abstract class MapViewModel<T> extends ObservableViewModel<T> {

    protected layers: LayerEntry<any>[];

    constructor(@inject("ILayerPresenter") protected layerPresenter: ILayerPresenter) {
        super();
    }

    abstract defineSources(): Dictionary<MapObservableFactory<any>>;

    setLayers(layers: LayerEntry<any>[]) {
        this.layers = layers;
    }

    present() {
        let sources = this.defineSources();
        forEach(this.layers, layer => {
            let source = sources[layer.name];
            if (!source)
                throw new Error("A layer source must be specified");
            this.layerPresenter.present(source, layer.type, layer.options);
        });
    }
}

export default MapViewModel
