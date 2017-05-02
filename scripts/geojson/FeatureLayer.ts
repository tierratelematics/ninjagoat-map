import {ObservableLayer} from "../layer/ObservableLayer";
import {GeoJSONProps} from "./GeoJSONProps";

class FeatureLayer extends ObservableLayer<GeoJSONProps> {

    getLayerType(props: GeoJSONProps): string {
        return "Feature";
    }
}

export default FeatureLayer