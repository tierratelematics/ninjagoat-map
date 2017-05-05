import * as React from "react";
import {Map as LeafletMap} from "react-leaflet";
import {lazyInject} from "ninjagoat";
import IMapHolder from "./leaflet/IMapHolder";
import {LatLngExpression} from "leaflet";

export type MapProps = {
    center?: LatLngExpression,
    zoom?: number
}

export class Map extends React.Component<MapProps, void> {

    @lazyInject("IMapHolder")
    private mapHolder: IMapHolder;

    render() {
        return <LeafletMap center={this.props.center} zoom={this.props.zoom}
                    ref={component => { if (component) this.mapHolder.setMap(component.leafletElement) }}>
            {this.props.children}
        </LeafletMap>;
    }
}