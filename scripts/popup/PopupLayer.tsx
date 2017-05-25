import * as React from "react";
import {Popup} from "react-leaflet";
import PopupProps from "./PopupProps";
import {LatLngExpression} from "leaflet";
import {GeoJSONFeature} from "../geojson/GeoJSONProps";
import {lazyInject, IGUIDGenerator} from "ninjagoat";

class PopupLayer extends React.Component<PopupProps, void> {

    @lazyInject("IGUIDGenerator")
    private guidGenerator: IGUIDGenerator; //Used to recreate the popup every time the feature is updated

    render() {
        return !this.props.feature ? null :
            <Popup position={this.props.feature.geometry.coordinates as LatLngExpression}
                   offset={{x: 0, y: -28} as any}
                   key={this.guidGenerator.generate()}
                   onpopupclose={this.props.onPopupClose}>{this.props.children}</Popup>;
    }
}

export default PopupLayer