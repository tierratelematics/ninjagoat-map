import ILayerBinder from "../interfaces/ILayerBinder";
const {Path} = require("react-leaflet");
import {isFunction} from "lodash";
import {lazyInject} from "ninjagoat";
import {LayerType} from "./LayerRegistration";

class ObservableLayer extends Path {

    @lazyInject("ILayerBinder")
    private layerBinder: ILayerBinder;

    createLeafletElement(props: Object): Object {
        const {observable, type, ...options} = props;
        return this.layerBinder.bind(observable, this.getLayerType(), options);
    }

    getLayerType(props: Object): LayerType {
        return props.type;
    }

    updateLeafletElement(fromProps: Object, toProps: Object) {
        if (isFunction(toProps.style)) {
            this.setStyle(toProps.style);
        } else {
            this.setStyleIfChanged(fromProps, toProps);
        }
    }
}

export default ObservableLayer