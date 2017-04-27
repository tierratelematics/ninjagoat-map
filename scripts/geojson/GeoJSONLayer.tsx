import {ObservableLayer} from "../layer/ObservableLayer";
import {LayerType} from "../layer/LayerRegistration";
import {GeoJSONProps} from "./GeoJSONProps";

class GeoJSONLayer extends ObservableLayer<GeoJSONProps> {

    getLayerType(props: Object): LayerType {
        return "GeoJSON";
    }
}

export default GeoJSONLayer