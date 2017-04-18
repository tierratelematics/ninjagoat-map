import ILayerView from "../interfaces/ILayerView";
import {Layer, geoJSON as geoJSONLayer} from "leaflet";

class GeoJSONLayerView implements ILayerView<GeoJSON, void> {

    create(props: GeoJSON, options: void): Layer {
        return geoJSONLayer(props);
    }

    update(fromProps: GeoJSON, toProps: GeoJSON, layer: L.Layer, options: void) {

    }

}

export default