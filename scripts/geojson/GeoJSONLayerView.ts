import * as _ from "lodash";
import ILayerView from "../layer/ILayerView";
import { Layer, geoJSON as geoJSONLayer, GeoJSON as GeoJSONLeaflet, LayerGroup, marker } from "leaflet";
import { inject, injectable } from "inversify";
import { GeoJSONCollection, GeoJSONFeature, ClusterProps, TooltipDetail } from "./GeoJSONProps";
import { IFeatureRendeder } from "./IFeatureRenderer";
import { assign } from "lodash";
import { GeoJSONLayerCacheFactory } from "./GeoJSONLayerCacheFactory";
import { memoize } from "lodash";
import { GeoJSONLayerCache } from "./GeoJSONLayerCache";

@injectable()
class GeoJSONLayerView implements ILayerView<GeoJSONCollection, ClusterProps> {
    type = "GeoJSON";
    private memoizedCacheFactory;

    constructor(@inject("GeoJSONLayerCacheFactory") private cacheFactory: GeoJSONLayerCacheFactory,
        @inject("ShapeRenderer") private shapeRenderer: IFeatureRendeder,
        @inject("MarkerRenderer") private markerRenderer: IFeatureRendeder) {
        this.memoizedCacheFactory = memoize(this.cacheFactory.for);
    }

    create(options: ClusterProps): Layer | LayerGroup {
        return geoJSONLayer(null, options);
    }

    update(fromProps: GeoJSONCollection, toProps: GeoJSONCollection, layer: Layer | LayerGroup, options: ClusterProps) {
        if (!toProps || !toProps.features) return;
        const layerGroup: LayerGroup = <LayerGroup>layer;
        const cache: GeoJSONLayerCache = this.memoizedCacheFactory(layerGroup);

        cache.clear();
        toProps.features.map(feature => this.drawFeature(feature, this.enrichOptions(options), layerGroup, cache));
        this.removeLayers(layerGroup, cache);
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

        return assign({}, options, {
            observable: null,
            featureId: featureId,
            pointToLayer: pointToLayer,
            onEachFeature: onEachFeature,
        });
    }

    private drawFeature(feature: GeoJSONFeature, options: ClusterProps, layerGroup: LayerGroup, cache: GeoJSONLayerCache): void {
        let featureId = options.featureId(feature);
        let layer = (cache.has(featureId)) ?
            this.updateFeature(cache.layers[featureId], feature, options, layerGroup, cache) :
            this.addFeature(feature, options, layerGroup, cache);

        cache.add(featureId, feature, layer);
    }

    private updateFeature(previousLayer: Layer, feature: GeoJSONFeature, options: ClusterProps, layerGroup: LayerGroup, cache: GeoJSONLayerCache): Layer {
        const previousFeature: GeoJSONFeature = cache.features[options.featureId(feature)];
        const layer: Layer = (feature.geometry.type !== "Point") ?
            this.shapeRenderer.updateFeature(previousLayer, previousFeature, feature, options, layerGroup) :
            this.markerRenderer.updateFeature(previousLayer, previousFeature, feature, options, layerGroup);

        if (options.bindTooltip) {
            const tooltipDetail: TooltipDetail = options.bindTooltip(feature);
            const hasTooltip: boolean = !!layer.getTooltip();

            if (hasTooltip && !tooltipDetail) {
                layer.unbindTooltip();
            } else if (!hasTooltip && tooltipDetail) {
                this.bindTooltip(feature, layer, options);
            }
        }

        if (options.onFeatureUpdated) {
            options.onFeatureUpdated(feature, layer);
        }
        return layer;
    }

    private addFeature(feature: GeoJSONFeature, options: ClusterProps, layerGroup: LayerGroup, cache: GeoJSONLayerCache): Layer {
        let layer = new GeoJSONLeaflet(feature, options).getLayers()[0];
        layer = (feature.geometry.type !== "Point") ?
            this.shapeRenderer.addFeature(layer, feature, options, layerGroup) :
            this.markerRenderer.addFeature(layer, feature, options, layerGroup);

        this.bindTooltip(feature, layer, options);
        layerGroup.addLayer(layer);
        return layer;
    }

    private removeLayers(layerGroup: LayerGroup, cache: GeoJSONLayerCache) {
        _.map(cache.layers, (l: Layer, featureId: string) => {
            if (!cache.isUpdated(featureId)) {
                layerGroup.removeLayer(cache.layers[featureId]);
                cache.remove(featureId);
            }
        });
    }

    private bindTooltip(feature: GeoJSONFeature, layer: Layer, options: ClusterProps): void {
        if (options.bindTooltip) {
            let tooltip: TooltipDetail = options.bindTooltip(feature);
            if (tooltip) {
                layer.bindTooltip(tooltip.content, tooltip.options);
            }
        }
    }
}

export default GeoJSONLayerView;
