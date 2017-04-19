import ILayerView from "../../scripts/interfaces/ILayerView";
import {LayerType} from "../../scripts/LayerRegistration";

export default class MockLayerView implements ILayerView<any, any> {
    type:LayerType = "GeoJSON";

    create(props: any, options: any): L.Layer {
        return undefined;
    }

    update(fromProps: any, toProps: any, layer: L.Layer, options: any) {
    }

}