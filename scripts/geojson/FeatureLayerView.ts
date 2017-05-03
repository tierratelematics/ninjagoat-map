import ILayerView from "../layer/ILayerView";
import {Layer, featureGroup as featureGroupLayer, FeatureGroup, GeoJSON as geoJSONUtil} from "leaflet";
import {injectable} from "inversify";
import {GeoJSONCollection, GeoJSONProps} from "./GeoJSONProps";
import {forEach} from "lodash";

@injectable()
class FeatureLayerView implements ILayerView<GeoJSONCollection, GeoJSONProps> {
    type = "Feature";

    create(options: GeoJSONProps): Layer {
        return featureGroupLayer([]);
    }

    update(fromProps: GeoJSONCollection, toProps: GeoJSONCollection, layer: Layer, options: GeoJSONProps) {
        let featureGroup = <FeatureGroup>layer;
        featureGroup.clearLayers();
        forEach(toProps.features, feature => {
            featureGroup.addLayer(geoJSONUtil.geometryToLayer(feature, options));
        });
    }

}

export default FeatureLayerView