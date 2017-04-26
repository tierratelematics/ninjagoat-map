import ObservableLayer from "../layer/ObservableLayer";
import {LayerType} from "../layer/LayerRegistration";

class GeoJSONLayer extends ObservableLayer {

    getLayerType(props: Object): LayerType {
        return "GeoJSON";
    }
}