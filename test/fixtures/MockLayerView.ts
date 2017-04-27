import ILayerView from "../../scripts/layer/ILayerView";

export default class MockLayerView implements ILayerView<any, any> {
    type = "GeoJSON";

    create(options: any): L.Layer {
        return undefined;
    }

    update(fromProps: any, toProps: any, layer: L.Layer, options: any) {
    }

}