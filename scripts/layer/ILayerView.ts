import { LayerGroup, Layer } from "leaflet";
interface ILayerView<TProps, TOptions> {
    create(options: TOptions): Layer | LayerGroup;
    update(fromProps: TProps, toProps: TProps);
}

export default ILayerView