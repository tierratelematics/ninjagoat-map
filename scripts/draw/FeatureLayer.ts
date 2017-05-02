import {ObservableLayer} from "../layer/ObservableLayer";

class FeatureLayer extends ObservableLayer<void> {

    getLayerType(props: void): string {
        return "Feature";
    }
}

export default FeatureLayer