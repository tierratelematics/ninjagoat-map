import ILayerView from "../interfaces/ILayerView";
import {Layer, geoJSON as geoJSONLayer} from "leaflet";
import GeoJSONProps from "./GeoJSONProps";

class GeoJSONLayerView implements ILayerView<GeoJSONProps, void> {

    create(props: GeoJSONProps, options: void): Layer {
        return geoJSONLayer(props);
    }

    update(fromProps: GeoJSONProps, toProps: GeoJSONProps, layer: Layer, options: void) {

    }

}

export default GeoJSONLayerView