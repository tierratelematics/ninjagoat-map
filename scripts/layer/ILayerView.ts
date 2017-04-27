import {Layer} from "leaflet";

interface ILayerView<TProps, TOptions> {
    type: string;
    create(options: TOptions): Layer;
    update(fromProps: TProps, toProps: TProps, layer: Layer, options: TOptions);
}

export default ILayerView