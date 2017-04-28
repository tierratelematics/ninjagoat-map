import {isFunction} from "lodash";
import {Path} from "react-leaflet";
const PropTypes = require("prop-types");
import {Layer} from "leaflet";

abstract class MapLayer<P> extends Path {

    //Patch to link context correctly in React (probably due since static fields are not inherited from javascript classes)
    static contextTypes = {
        layerContainer: PropTypes.any.isRequired,
        map: PropTypes.any.isRequired,
        pane: PropTypes.string,
    };

    abstract createLeafletElement(props: P): Layer;

    updateLeafletElement(fromProps: P, toProps: P) {
        let props = <any>toProps;
        if (isFunction(props.style)) {
            this.setStyle(props.style);
        } else {
            this.setStyleIfChanged(fromProps, toProps);
        }
    }
}

export default MapLayer