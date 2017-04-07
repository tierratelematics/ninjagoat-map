import {Layer} from "leaflet";

interface ILayerView<TProps, TOptions> {
    create(props: TProps, options: TOptions): Layer;
    update(fromProps: TProps, toProps: TProps, options: TOptions);
}

export default ILayerView