import ILayerBinder from "./ILayerBinder";
import {isFunction} from "lodash";
import {Path} from "react-leaflet";
import {lazyInject} from "ninjagoat";
import {MapObservableFactory} from "./MapContext";
const PropTypes = require("prop-types");
import {Layer} from "leaflet";

export type ObservableLayerProps<T> = {observable: MapObservableFactory<T>};

export abstract class ObservableLayer<P extends ObservableLayerProps<any>> extends Path {

    @lazyInject("ILayerBinder")
    private layerBinder: ILayerBinder;

    //Patch to link context correctly in React (probably due since static fields are not inherited from javascript classes)
    static contextTypes = {
        layerContainer: PropTypes.any.isRequired,
        map: PropTypes.any.isRequired,
        pane: PropTypes.string,
    };

    createLeafletElement(props: P): Layer {
        let observable: MapObservableFactory<any> = props.observable;
        return this.layerBinder.bind(observable, this.getLayerType(props), this.getOptions(props));
    }

    abstract getLayerType(props: P): string;

    updateLeafletElement(fromProps: P, toProps: P) {
        let props = <any>toProps;
        if (isFunction(props.style)) {
            this.setStyle(props.style);
        } else {
            this.setStyleIfChanged(fromProps, toProps);
        }
    }
}