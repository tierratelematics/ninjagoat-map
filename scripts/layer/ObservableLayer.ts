import ILayerBinder from "./ILayerBinder";
import {lazyInject} from "ninjagoat";
import {MapObservableFactory} from "./MapContext";
import {Layer, LayerGroup} from "leaflet";
import {Unsubscribable} from "rxjs";
import { FeatureGroup, FeatureGroupProps } from "react-leaflet";

export type ObservableLayerProps<T> = FeatureGroupProps & {
    observable: MapObservableFactory<T>,
    freezeBounds?: boolean;
    id?: string;
};

export abstract class ObservableLayer<P extends ObservableLayerProps<any>> extends FeatureGroup<P, any> {

    protected layer: Layer | LayerGroup;
    @lazyInject("ILayerBinder")
    private layerBinder: ILayerBinder;
    private subscription: Unsubscribable;

    createLeafletElement(props: P): Layer | LayerGroup {
        let observable: MapObservableFactory<any> = props.observable;
        let layerType = this.getLayerType(props);
        let [layer, notifications] = this.layerBinder.bind(observable, layerType, (<any>this).getOptions(props));
        this.subscription = notifications.subscribe();
        this.layer = layer;
        return layer;
    }

    componentWillUnmount() {
        if (this.subscription) this.subscription.unsubscribe();
        this.layerBinder.dispose();
    }

    abstract getLayerType(props: P): string;
}
