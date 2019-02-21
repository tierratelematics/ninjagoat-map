import { injectable } from "inversify";
import { featureGroup, GeoJSON as geoJSONUtil, LayerGroup } from "leaflet";
import { forEach } from "lodash";
import { GeoJSONCollection, GeoJSONProps } from "../geojson/GeoJSONProps";
import ILayerView from "../layer/ILayerView";

@injectable()
class DrawingLayerView implements ILayerView<GeoJSONCollection, GeoJSONProps> {
    private layerGroup: LayerGroup;
    private options: GeoJSONProps;

    create(options: GeoJSONProps): LayerGroup {
        this.options = options;
        this.layerGroup = featureGroup([]);
        return this.layerGroup;
    }

    update(fromProps: GeoJSONCollection, toProps: GeoJSONCollection) {
        this.layerGroup.clearLayers();
        if (!toProps) return;
        forEach(toProps.features, feature => {
            this.layerGroup.addLayer(geoJSONUtil.geometryToLayer(feature, this.options));
        });
    }

    dispose(): void {
    }
}

export default DrawingLayerView