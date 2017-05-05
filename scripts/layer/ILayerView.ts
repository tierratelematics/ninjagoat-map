import {Layer, LayerGroup} from "leaflet";

interface ILayerView<TProps, TOptions> {
    type: string;
    create(options: TOptions): Layer | LayerGroup;
    update(fromProps: TProps, toProps: TProps, layer: Layer | LayerGroup, options: TOptions);
}

export default ILayerView