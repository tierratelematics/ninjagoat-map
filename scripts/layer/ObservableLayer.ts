import ILayerBinder from "./ILayerBinder";
import {isFunction} from "lodash";
import {Path} from "react-leaflet";
import {lazyInject} from "ninjagoat";
import {LayerType, MapObservableFactory} from "./LayerRegistration";
import {PropTypes} from "react";

class ObservableLayer extends Path {

    @lazyInject("ILayerBinder")
    private layerBinder: ILayerBinder;

    //Patch to link context correctly in React (probably due since static fields are not inherited from javascript classes)
    static contextTypes = {
        layerContainer: PropTypes.any.isRequired,
        map: PropTypes.any.isRequired,
        pane: PropTypes.string,
    };

    createLeafletElement(props: any): Object {
        let observable: MapObservableFactory<any> = props.observable;
        const {...options} = props;
        let self = <any>this;
        return this.layerBinder.bind(observable, this.getLayerType(props), self.getOptions(options));
    }

    getLayerType(props: any): LayerType {
        return props.type;
    }

    updateLeafletElement(fromProps: any, toProps: any) {
        let self = <any>this;
        if (isFunction(toProps.style)) {
            self.setStyle(toProps.style);
        } else {
            self.setStyleIfChanged(fromProps, toProps);
        }
    }
}

export default ObservableLayer