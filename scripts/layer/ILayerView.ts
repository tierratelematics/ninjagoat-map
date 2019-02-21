import { LayerGroup, Layer } from "leaflet";
import { IDisposable } from "../IDisposable";
interface ILayerView<TProps, TOptions> extends IDisposable {
    create(options: TOptions): Layer | LayerGroup;
    update(fromProps: TProps, toProps: TProps);
}

export default ILayerView