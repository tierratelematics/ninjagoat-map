import ILayerBinder from "./ILayerBinder";
import {lazyInject} from "ninjagoat";
import {MapObservableFactory} from "./MapContext";
import {Layer} from "leaflet";
import MapLayer from "./MapLayer";

export type ObservableLayerProps<T> = {observable: MapObservableFactory<T>};

export abstract class ObservableLayer<P extends ObservableLayerProps<any>> extends MapLayer<P> {

    @lazyInject("ILayerBinder")
    private layerBinder: ILayerBinder;

    createLeafletElement(props: P): Layer {
        let observable: MapObservableFactory<any> = props.observable;
        return this.layerBinder.bind(observable, this.getLayerType(props), this.getOptions(props));
    }

    abstract getLayerType(props: P): string;
}