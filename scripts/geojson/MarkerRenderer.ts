import { injectable } from "inversify";
import { Layer, LayerGroup } from "leaflet";
import { ClusterProps, GeoJSONFeature } from "./GeoJSONProps";
import { defaultClusterIcon } from "./Icons";
import { IFeatureRendeder } from "./IFeatureRenderer";

@injectable()
export class MarkerRenderer implements IFeatureRendeder {
    addFeature(layer: Layer, feature: GeoJSONFeature, options: ClusterProps, layerGroup: LayerGroup): Layer {
        return layer;
    }

    updateFeature(previousLayer, previousFeature: GeoJSONFeature, feature: GeoJSONFeature, options: ClusterProps, layerGroup: LayerGroup): Layer {
        let [lng, lat] = feature.geometry.coordinates;
        previousLayer.setLatLng([lat, lng]);
        if (options.isCluster && options.isCluster(feature)) {
            let iconGenerator = options.clusterIcon || defaultClusterIcon;
            previousLayer.setIcon(iconGenerator(feature));
        } else {
            if (options.icon) previousLayer.setIcon(options.icon(feature));
            if (options.markerOptions) {
                const markerOptions = options.markerOptions(feature);
                previousLayer.setZIndexOffset(markerOptions?.zIndexOffset ?? 0);
            }
        }

        return previousLayer;
    }
}