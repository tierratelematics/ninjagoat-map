import * as React from "react";
import {forEach} from "lodash";
import {lazyInject} from "ninjagoat";
import {Map} from "react-leaflet";
import ILayerBinder from "./interfaces/ILayerBinder";
import {LayerEntry, LayerType} from "./LayerRegistration";
import IMapHolder from "./interfaces/IMapHolder";
import Tile from "./tile/Tile";
import GeoJSON from "./geojson/GeoJSON";

class NinjagoatMap extends React.Component<void, void> {

    @lazyInject("ILayerBinder")
    private layerBinder: ILayerBinder;
    @lazyInject("IMapHolder")
    private mapHolder: IMapHolder;

    render() {
        return <Map center={[45, 45]} zoom={16} ref={component => this.mapHolder.setMap(component.leafletElement)}/>;
    }

    componentDidMount() {
        forEach(React.Children.toArray(this.props.children), (children: React.ReactElement<any>) => {
            let layer: LayerEntry<any, any> = {
                type: this.getLayerType(children.type),
                observable: children.props.observable,
                options: children.props.options
            };
            this.layerBinder.bind(layer.observable, layer.type, layer.options);
        });
    }

    private getLayerType(constructor: any): LayerType {
        let type: LayerType;
        if (constructor === Tile)
            type = "Tile";
        if (constructor === GeoJSON)
            type = "GeoJSON";
        return type;
    }
}

export default NinjagoatMap