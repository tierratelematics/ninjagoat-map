import { map } from "lodash";
import ILayerView from "../layer/ILayerView";
import { Layer, geoJSON as geoJSONLayer, GeoJSON as GeoJSONLeaflet, LayerGroup, marker } from "leaflet";
import { inject, injectable } from "inversify";
import { GeoJSONCollection, GeoJSONFeature, ClusterProps, TooltipDetail } from "./GeoJSONProps";
import { IFeatureRendeder } from "./IFeatureRenderer";
import { assign } from "lodash";
import { GeoJSONLayerCacheFactory } from "./GeoJSONLayerCacheFactory";
import { GeoJSONLayerCache } from "./GeoJSONLayerCache";

@injectable()
class GeoJSONLayerView implements ILayerView<GeoJSONCollection, ClusterProps> {
    private cache: GeoJSONLayerCache;
    private options: ClusterProps;
    private layerGroup: LayerGroup;

    constructor(@inject("GeoJSONLayerCacheFactory") private cacheFactory: GeoJSONLayerCacheFactory,
        @inject("ShapeRenderer") private shapeRenderer: IFeatureRendeder,
        @inject("MarkerRenderer") private markerRenderer: IFeatureRendeder) {
    }

    create(options: ClusterProps): Layer | LayerGroup {
        this.cache = this.cacheFactory.create();
        this.layerGroup = geoJSONLayer(null, options);
        this.options = this.enrichOptions(options);
        return this.layerGroup;
    }

    update(fromProps: GeoJSONCollection, toProps: GeoJSONCollection) {
        if (!toProps || !toProps.features) return;
        this.cache.clear();
        toProps.features.map(feature => this.drawFeature(feature));
        this.removeZombieLayers();
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

    private drawFeature(feature: GeoJSONFeature): void {
        let featureId = this.options.featureId(feature);
        let layer = (this.cache.has(featureId)) ?
            this.updateFeature(this.cache.layers[featureId], feature) :
            this.addFeature(feature);

        this.cache.add(featureId, feature, layer);
    }

    private updateFeature(previousLayer: Layer, feature: GeoJSONFeature): Layer {
        const previousFeature: GeoJSONFeature = this.cache.features[this.options.featureId(feature)];
        const layer: Layer = (feature.geometry.type !== "Point") ?
            this.shapeRenderer.updateFeature(previousLayer, previousFeature, feature, this.options, this.layerGroup) :
            this.markerRenderer.updateFeature(previousLayer, previousFeature, feature, this.options, this.layerGroup);

        if (this.options.bindTooltip) {
            const tooltipDetail: TooltipDetail = this.options.bindTooltip(feature);
            const hasTooltip: boolean = !!layer.getTooltip();

            if (hasTooltip && !tooltipDetail) {
                layer.unbindTooltip();
            } else if (!hasTooltip && tooltipDetail) {
                this.bindTooltip(feature, layer);
            }
        }

        if (this.options.onFeatureUpdated) {
            this.options.onFeatureUpdated(feature, layer);
        }
        return layer;
    }

    private addFeature(feature: GeoJSONFeature): Layer {
        let layer = new GeoJSONLeaflet(feature, this.options).getLayers()[0];
        layer = (feature.geometry.type !== "Point") ?
            this.shapeRenderer.addFeature(layer, feature, this.options, this.layerGroup) :
            this.markerRenderer.addFeature(layer, feature, this.options, this.layerGroup);

        this.bindTooltip(feature, layer);
        this.layerGroup.addLayer(layer);
        return layer;
    }

    private removeZombieLayers() {
        map(this.cache.layers, (l: Layer, featureId: string) => {
            if (!this.cache.isUpdated(featureId)) {
                this.layerGroup.removeLayer(this.cache.layers[featureId]);
                this.cache.remove(featureId);
            }
        });
    }

    private bindTooltip(feature: GeoJSONFeature, layer: Layer): void {
        if (this.options.bindTooltip) {
            let tooltip: TooltipDetail = this.options.bindTooltip(feature);
            if (tooltip) {
                layer.bindTooltip(tooltip.content, tooltip.options);
            }
        }
    }
}

export default GeoJSONLayerView;
