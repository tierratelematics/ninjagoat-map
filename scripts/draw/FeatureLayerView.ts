import ILayerView from "../layer/ILayerView";
import {Layer, featureGroup as featureGroupLayer, FeatureGroup} from "leaflet";
import {injectable} from "inversify";
import {GeoJSON} from "../geojson/GeoJSONProps";

@injectable()
class FeatureLayerView implements ILayerView<GeoJSON, void> {
    type = "Feature";

    create(options: void): Layer {
        return featureGroupLayer([]);
    }

    update(fromProps: GeoJSON, toProps: GeoJSON, layer: Layer, options: any) {
        let featureGroup = <FeatureGroup>layer;
        featureGroup.clearLayers();
    }

}

export default FeatureLayerView