import {isFunction} from "lodash";
const { FeatureGroup } = require("react-leaflet");
const PropTypes = require("prop-types");
import {Layer, LayerGroup} from "leaflet";
import * as React from "react";

export interface IFeatureGroup extends React.Component {
    new(...args: any[]): IFeatureGroup;
}
abstract class MapLayer<P> extends (FeatureGroup as IFeatureGroup) {

    // Patch to link context correctly in React (probably due since static fields are not inherited from javascript classes)
    static contextTypes = {
        layerContainer: PropTypes.any.isRequired,
        map: PropTypes.any.isRequired,
        pane: PropTypes.string,
    };

    abstract createLeafletElement(props: P): Layer | LayerGroup;

    updateLeafletElement(fromProps: P, toProps: P) {
        let props = <any>toProps;
        if (isFunction(props.style)) {
            (<any>this).setStyle(props.style);
        } else {
            (<any>this).setStyleIfChanged(fromProps, toProps);
        }
    }
}

export default MapLayer
