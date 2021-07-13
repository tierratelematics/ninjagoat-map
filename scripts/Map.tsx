import * as React from "react";
import {Map as LeafletMap, MapEvents} from "react-leaflet";
import {lazyInject} from "ninjagoat";
import IMapHolder from "./leaflet/IMapHolder";
import {MapOptions, LeafletEvent} from "leaflet";
import { Observable } from "rxjs";

export type MapProps = MapOptions & MapEvents & {
    invalidateSize?: Observable<void>,
    onMapReady?: () => void,
    onMapClick?(event: Event): void; 
}

export class Map extends React.Component<MapProps, any> {

    @lazyInject("IMapHolder")
    private mapHolder: IMapHolder;

    componentWillMount() {
        if(this.props.invalidateSize) {
            this.props.invalidateSize.subscribe(() => {
                let map = this.mapHolder.obtainMap();
                if (map) {
                    map.invalidateSize(false);
                }
            })
        }
    }

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
        if (map) {
            if (this.props.onMapClick) map.off("click", this.props.onMapClick);
            this.mapHolder.setMap(null);
        }
    }
}
