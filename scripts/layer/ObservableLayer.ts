import ILayerBinder from "./ILayerBinder";
import {lazyInject} from "ninjagoat";
import {MapObservableFactory} from "./MapContext";
import {Layer, LayerGroup} from "leaflet";
import MapLayer from "./MapLayer";
import {IDisposable} from "rx";

export type ObservableLayerProps<T> = {
    observable: MapObservableFactory<T>,
    freezeBounds?: boolean;
};

export abstract class ObservableLayer<P extends ObservableLayerProps<any>> extends MapLayer<P> {

    protected layer: Layer | LayerGroup;
    @lazyInject("ILayerBinder")
    private layerBinder: ILayerBinder;
    private subscription: IDisposable;

    createLeafletElement(props: P): Layer | LayerGroup {
        let observable: MapObservableFactory<any> = props.observable;
        let layerType = this.getLayerType(props);
        let [layer, notifications] = this.layerBinder.bind(observable, layerType, this.getOptions(props));
        this.subscription = notifications.subscribe();
        this.layer = layer;
        return layer;
    }

    componentWillUnmount() {
        if (this.subscription) this.subscription.dispose();
    }

    abstract getLayerType(props: P): string;
}
