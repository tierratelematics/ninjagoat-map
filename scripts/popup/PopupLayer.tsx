import * as React from "react";
import {Popup} from "react-leaflet";
import PopupProps from "./PopupProps";
import {LatLngExpression, latLng} from "leaflet";
import {lazyInject, IGUIDGenerator} from "ninjagoat";

class PopupLayer extends React.Component<PopupProps, void> {

    @lazyInject("IGUIDGenerator")
    private guidGenerator: IGUIDGenerator; //Used to recreate the popup every time the feature is updated

    render() {
        if (!this.props.feature)
            return null;
        let coordinates = this.props.feature.geometry.coordinates as number[];
        return <Popup
            position={latLng(coordinates[1], coordinates[0])}
            offset={{x: 0, y: -28} as any}
            key={this.guidGenerator.generate()}
            onpopupclose={this.props.onPopupClose}>{this.props.children}</Popup>;
    }
}

export default PopupLayer