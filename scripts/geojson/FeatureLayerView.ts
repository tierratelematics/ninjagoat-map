import ILayerView from "../layer/ILayerView";
import {Layer, featureGroup as featureGroupLayer, GeoJSON as geoJSONUtil, LayerGroup} from "leaflet";
import {injectable} from "inversify";
import {GeoJSONCollection, GeoJSONProps} from "./GeoJSONProps";
import {forEach} from "lodash";

@injectable()
class FeatureLayerView implements ILayerView<GeoJSONCollection, GeoJSONProps> {
    type = "Feature";

    create(options: GeoJSONProps): Layer | LayerGroup {
        return featureGroupLayer([]);
    }

    update(fromProps: GeoJSONCollection, toProps: GeoJSONCollection, layer: Layer | LayerGroup, options: GeoJSONProps) {
        let layerGroup = <LayerGroup>layer;
        layerGroup.clearLayers();
        if (!toProps) return;
        forEach(toProps.features, feature => {
            layerGroup.addLayer(geoJSONUtil.geometryToLayer(feature, options));
        });
    }

}

export default FeatureLayerView