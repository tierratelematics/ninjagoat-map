import {ObservableLayer} from "../layer/ObservableLayer";
import {GeoJSONProps} from "./GeoJSONProps";

class GeoJSONLayer extends ObservableLayer<GeoJSONProps> {

    getLayerType(props: GeoJSONProps): string {
        return "GeoJSON";
    }
}

export default GeoJSONLayer
