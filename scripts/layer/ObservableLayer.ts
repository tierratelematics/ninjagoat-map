import "../../declarations/react-leaflet";
import ILayerBinder from "./ILayerBinder";
import {isFunction} from "lodash";
import {Path} from "react-leaflet";
import {lazyInject} from "ninjagoat";
import {LayerType, MapObservableFactory} from "./LayerRegistration";

class ObservableLayer extends Path {

    @lazyInject("ILayerBinder")
    private layerBinder: ILayerBinder;

    createLeafletElement(props: any): Object {
        let observable: MapObservableFactory<any> = props.observable;
        const {...options} = props;
        return this.layerBinder.bind(observable, this.getLayerType(props), options);
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