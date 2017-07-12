import * as React from "react";
import {Map as LeafletMap} from "react-leaflet";
import {lazyInject} from "ninjagoat";
import IMapHolder from "./leaflet/IMapHolder";
import {LatLngExpression, LatLngBoundsExpression} from "leaflet";

export type MapProps = {
    center?: LatLngExpression,
    zoom?: number,
    onMapReady?: () => void,
    maxBounds?: LatLngBoundsExpression,
    maxBoundsViscosity?: number
}

export class Map extends React.Component<MapProps, void> {

    @lazyInject("IMapHolder")
    private mapHolder: IMapHolder;

    render() {
        return <LeafletMap center={this.props.center} zoom={this.props.zoom}
                           maxBounds={this.props.maxBounds} maxBoundsViscosity={this.props.maxBoundsViscosity}
                           ref={component => {
                               let map = this.mapHolder.obtainMap();
                               if (component && !map) {
                                   this.mapHolder.setMap(component.leafletElement);
                                   this.props.onMapReady && this.props.onMapReady();
                               }
                           }}>
            {this.props.children}
        </LeafletMap>;
    }

    componentWillUnmount() {
        this.mapHolder.setMap(null);
    }
}