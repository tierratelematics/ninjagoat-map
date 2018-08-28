import * as _ from "lodash";
import ILayerView from "../layer/ILayerView";
import { Layer, geoJSON as geoJSONLayer, GeoJSON as GeoJSONLeaflet, LayerGroup, marker } from "leaflet";
import { inject, injectable } from "inversify";
import { GeoJSONCollection, GeoJSONFeature, ClusterProps } from "./GeoJSONProps";
import IMapHolder from "../leaflet/IMapHolder";
import { GeoJSONLayerCache } from "./GeoJSONLayerCache";
import { IFeatureUpdateStrategy } from "./IFeatureUpdateStrategy";

@injectable()
class GeoJSONLayerView implements ILayerView<GeoJSONCollection, ClusterProps> {
    type = "GeoJSON";

    constructor(@inject("IMapHolder") private mapHolder: IMapHolder,
        @inject("GeoJSONLayerCache") private cache: GeoJSONLayerCache,
        @inject("ShapeUpdateStrategy") private shapeUpdateStrategy: IFeatureUpdateStrategy,
        @inject("MarkerUpdateStrategy") private markerUpdateStrategy: IFeatureUpdateStrategy) { }

    create(options: ClusterProps): Layer | LayerGroup {
        this.cache.init();
        return geoJSONLayer(null, options);
    }

    update(fromProps: GeoJSONCollection, toProps: GeoJSONCollection, layer: Layer | LayerGroup, options: ClusterProps) {
        if (!toProps || !toProps.features) return;

        this.cache.clear();
        toProps.features.map(feature => this.drawFeature(feature, this.enrichOptions(options)));
        this.removeLayers();
    }

    private enrichOptions(options: ClusterProps): ClusterProps {
        let featureId = !options.featureId ? (feature: any) => "featureId_" + Math.random().toString() : options.featureId;
        let pointToLayer = options.pointToLayer ? options.pointToLayer : (feature, latlng) => {
            return marker(latlng, options.icon ? {
                icon: options.icon(feature)
            } : undefined);
        };
        let onEachFeature = (feature: GeoJSON.Feature<GeoJSON.GeometryObject>, layer: Layer) => {
            if (options.onMarkerClick) {
                layer.on("click", () => options.onMarkerClick(<GeoJSONFeature>feature));
            }
            options.onEachFeature && options.onEachFeature(feature, layer);
        };

        return {
            observable: null,
            featureId: featureId,
            pointToLayer: pointToLayer,
            popup: options.popup,
            icon: options.icon,
            style: options.style,
            onEachFeature: onEachFeature,
            filter: options.filter,
            coordsToLatLng: options.coordsToLatLng,
            clusterIcon: options.clusterIcon,
            isCluster: options.isCluster
        };
    }

    private drawFeature(feature: GeoJSONFeature, options: ClusterProps): void {
        let featureId = options.featureId(feature);
        let layer = (this.cache.has(featureId)) ? this.updateFeature(this.cache.layers[featureId], feature, options) : this.addFeature(feature, options);
        this.cache.add(featureId, feature, layer);
    }

    private updateFeature(previousLayer: Layer, feature: GeoJSONFeature, options: ClusterProps): Layer {
        let previousFeature: GeoJSONFeature = this.cache.features[options.featureId(feature)];
        return (feature.geometry.type !== "Point") ?
            this.shapeUpdateStrategy.updateFeature(previousLayer, previousFeature, feature, options) :
            this.markerUpdateStrategy.updateFeature(previousLayer, previousFeature, feature, options);
    }

    private addFeature(feature: GeoJSONFeature, options: ClusterProps): Layer {
        let layer = GeoJSONLeaflet.geometryToLayer(feature, options);
        if (!layer) return; //FIXME: is necessary??

        layer = (feature.geometry.type !== "Point") ?
            this.shapeUpdateStrategy.addFeature(layer, feature, options) :
            this.markerUpdateStrategy.addFeature(layer, feature, options);

        options.onEachFeature(feature, layer);
        this.mapHolder.obtainMap().addLayer(layer);
        return layer;
    }

    private removeLayers() {
        let map = this.mapHolder.obtainMap();
        _.map(this.cache.layers, (l: Layer, featureId: string) => {
            if (!this.cache.isUpdated(featureId)) {
                map.removeLayer(this.cache.layers[featureId]);
                this.cache.remove(featureId);
            }
        });
    }
}

export default GeoJSONLayerView;
