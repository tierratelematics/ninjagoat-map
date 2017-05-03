import ILayerBinder from "./ILayerBinder";
import {lazyInject} from "ninjagoat";
import {MapObservableFactory} from "./MapContext";
import {Layer} from "leaflet";
import MapLayer from "./MapLayer";
import {IDisposable} from "rx";

export type ObservableLayerProps<T> = {observable: MapObservableFactory<T>};

export abstract class ObservableLayer<P extends ObservableLayerProps<any>> extends MapLayer<P> {

    @lazyInject("ILayerBinder")
    private layerBinder: ILayerBinder;
    private subscription: IDisposable;

    createLeafletElement(props: P): Layer {
        let observable: MapObservableFactory<any> = props.observable;
        let layerData = this.layerBinder.bind(observable, this.getLayerType(props), this.getOptions(props));
        this.subscription = layerData[1].subscribe();
        return layerData[0];
    }

    componentWillUnmount() {
        if (this.subscription) this.subscription.dispose();
    }

    abstract getLayerType(props: P): string;
}