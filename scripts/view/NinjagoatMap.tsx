import * as React from "react";
import {Map} from "react-leaflet";
import {lazyInject} from "ninjagoat";
import IMapHolder from "../leaflet/IMapHolder";
import MapProps from "./MapProps";

class NinjagoatMap extends React.Component<MapProps, void> {

    @lazyInject("IMapHolder")
    private mapHolder: IMapHolder;

    render() {
        return <Map center={this.props.center} zoom={this.props.zoom} useFlyTo={true}
                    ref={component => { if (component) this.mapHolder.setMap(component.leafletElement) }}>
            {this.props.children}
        </Map>;
    }
}

export default NinjagoatMap