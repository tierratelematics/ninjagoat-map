import ILayerBinder from "./ILayerBinder";
import * as Leaflet from "react-leaflet";
import {isFunction} from "lodash";
import {lazyInject} from "ninjagoat";
import {LayerType} from "./LayerRegistration";

class ObservableLayer extends Leaflet.Path {

    @lazyInject("ILayerBinder")
    private layerBinder: ILayerBinder;

    createLeafletElement(props: any): Object {
        const {observable, type, ...options} = props;
        return this.layerBinder.bind(observable, this.getLayerType(), options);
    }

    getLayerType(props: any): LayerType {
        return props.type;
    }

    updateLeafletElement(fromProps: any, toProps: any) {
        if (isFunction(toProps.style)) {
            this.setStyle(toProps.style);
        } else {
            this.setStyleIfChanged(fromProps, toProps);
        }
    }
}

export default ObservableLayer