import * as React from "react";
import {Popup} from "react-leaflet";
import PopupProps from "./PopupProps";
import {LatLngExpression} from "leaflet";

class PopupLayer extends React.Component<PopupProps, void> {

    render() {
        return !this.props.feature ? null :
            <Popup position={this.props.feature.geometry.coordinates as LatLngExpression}
                   offset={{x: 0, y: -28} as any}
                   onpopupclose={this.props.onPopupClose}>{this.props.children}</Popup>;
    }
}

export default PopupLayer