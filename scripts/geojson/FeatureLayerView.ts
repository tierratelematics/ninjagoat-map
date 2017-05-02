import ILayerView from "../layer/ILayerView";
import {Layer, featureGroup as featureGroupLayer, FeatureGroup, GeoJSON as geoJSONUtil} from "leaflet";
import {injectable} from "inversify";
import {GeoJSONCollection} from "./GeoJSONProps";
import {forEach} from "lodash";

@injectable()
class FeatureLayerView implements ILayerView<GeoJSONCollection, void> {
    type = "Feature";

    create(options: void): Layer {
        return featureGroupLayer([]);
    }

    update(fromProps: GeoJSONCollection, toProps: GeoJSONCollection, layer: Layer, options: any) {
        let featureGroup = <FeatureGroup>layer;
        featureGroup.clearLayers();
        forEach(toProps.features, feature => {
            featureGroup.addLayer(geoJSONUtil.geometryToLayer(feature, options));
        });
    }

}

export default FeatureLayerView