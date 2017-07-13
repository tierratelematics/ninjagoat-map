import * as React from "react";
import {Map as LeafletMap} from "react-leaflet";
import {lazyInject} from "ninjagoat";
import IMapHolder from "./leaflet/IMapHolder";
import {MapOptions} from "leaflet";

export type MapProps = MapOptions & {
    onMapReady?: () => void
}

export class Map extends React.Component<MapProps, void> {

    @lazyInject("IMapHolder")
    private mapHolder: IMapHolder;

    render() {
        return <LeafletMap {...this.props as MapOptions} ref={component => {
            let map = this.mapHolder.obtainMap();
            if (component && !map) {
                this.mapHolder.setMap(component.leafletElement);
                if (this.props.onMapReady) this.props.onMapReady();
            }
        }}>
            {this.props.children}
        </LeafletMap>;
    }

    componentWillUnmount() {
        this.mapHolder.setMap(null);
    }
}
