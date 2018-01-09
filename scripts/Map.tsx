import * as React from "react";
import {Map as LeafletMap} from "react-leaflet";
import {lazyInject} from "ninjagoat";
import IMapHolder from "./leaflet/IMapHolder";
import {MapOptions, LeafletEvent} from "leaflet";

export type MapProps = MapOptions & {
    onMapReady?: () => void,
    onMapClick?(event: Event): void; 
}

export class Map extends React.Component<MapProps, any> {

    @lazyInject("IMapHolder")
    private mapHolder: IMapHolder;

    render() {
        return <LeafletMap {...this.props as MapOptions} ref={component => {
            let map = this.mapHolder.obtainMap();
            if (component && !map) {
                map = component.leafletElement;
                this.mapHolder.setMap(map);
                if (this.props.onMapReady) this.props.onMapReady();
                if (this.props.onMapClick) map.on("click", this.props.onMapClick);
            }
        }}>
            {this.props.children}
        </LeafletMap>;
    }

    componentWillUnmount() {
        let map = this.mapHolder.obtainMap();
        if (!map) {
            map.on("click", this.props.onMapClick);
            if (this.props.onMapClick) this.mapHolder.setMap(null);
        }
    }
}
