import ILayerView from "../layer/ILayerView";
import {Layer, featureGroup, GeoJSON as geoJSONUtil, LayerGroup} from "leaflet";
import {injectable} from "inversify";
import {GeoJSONCollection, GeoJSONProps} from "../geojson/GeoJSONProps";
import {forEach} from "lodash";

@injectable()
class DrawingLayerView implements ILayerView<GeoJSONCollection, GeoJSONProps> {
    type = "Drawing";

    create(options: GeoJSONProps): Layer | LayerGroup {
        return featureGroup([]);
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

export default DrawingLayerView