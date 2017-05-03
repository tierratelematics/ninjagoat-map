import ILayerBinder from "./ILayerBinder";
import {lazyInject, Dictionary} from "ninjagoat";
import {MapObservableFactory} from "./MapContext";
import {Layer, LayerGroup} from "leaflet";
import MapLayer from "./MapLayer";
import {IDisposable} from "rx";

export type ObservableLayerProps<T> = {observable: MapObservableFactory<T>};

export abstract class ObservableLayer<P extends ObservableLayerProps<any>> extends MapLayer<P> {

    @lazyInject("ILayerBinder")
    private layerBinder: ILayerBinder;
    @lazyInject("LayersCache")
    private layersCache: Dictionary<Layer | LayerGroup>;
    private subscription: IDisposable;

    createLeafletElement(props: P): Layer | LayerGroup {
        let observable: MapObservableFactory<any> = props.observable;
        let layerType = this.getLayerType(props);
        let [layer, notifications] = this.layerBinder.bind(observable, layerType, this.getOptions(props));
        this.subscription = notifications.subscribe();
        this.layersCache[layerType] = layer;
        return layer;
    }

    componentWillUnmount() {
        if (this.subscription) this.subscription.dispose();
    }

    abstract getLayerType(props: P): string;
}