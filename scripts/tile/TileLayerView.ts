import ILayerView from "../interfaces/ILayerView";
import {Layer, tileLayer} from "leaflet";
import TileProps from "./TileProps";
import {LayerType} from "../LayerRegistration";

class TileLayerView implements ILayerView<TileProps, void> {
    type:LayerType = "Tile";

    create(props: TileProps, options: void): Layer {
        return tileLayer(props.url);
    }

    update(fromProps: TileProps, toProps: TileProps, layer: Layer, options: void) {

    }

}

export default TileLayerView