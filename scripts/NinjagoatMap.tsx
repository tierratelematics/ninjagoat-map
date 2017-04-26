import * as React from "react";
import {lazyInject} from "ninjagoat";
import {Map} from "react-leaflet";
import IMapHolder from "./interfaces/IMapHolder";

class NinjagoatMap extends React.Component<void, void> {

    @lazyInject("IMapHolder")
    private mapHolder: IMapHolder;

    render() {
        return <Map center={[45, 45]} zoom={16} ref={component => this.mapHolder.setMap(component.leafletElement)}>
            {this.props.children}
        </Map>;
    }
}

export default NinjagoatMap