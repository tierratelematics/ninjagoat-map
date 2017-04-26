import {Layer} from "leaflet";
import {LayerType} from "../LayerRegistration";

interface ILayerView<TProps, TOptions> {
    type: LayerType;
    create(options: TOptions): Layer;
    update(fromProps: TProps, toProps: TProps, layer: Layer, options: TOptions);
}

export default ILayerView