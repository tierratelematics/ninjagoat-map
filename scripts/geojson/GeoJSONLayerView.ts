import * as _ from "lodash";
import ILayerView from "../layer/ILayerView";
import { Layer, geoJSON as geoJSONLayer, GeoJSON as GeoJSONLeaflet, LayerGroup, marker } from "leaflet";
import { inject, injectable } from "inversify";
import { GeoJSONCollection, GeoJSONFeature, ClusterProps, TooltipDetail } from "./GeoJSONProps";
import IMapHolder from "../leaflet/IMapHolder";
import { GeoJSONLayerCache } from "./GeoJSONLayerCache";
import { IFeatureRendeder } from "./IFeatureRenderer";
import { assign } from "lodash";

@injectable()
class GeoJSONLayerView implements ILayerView<GeoJSONCollection, ClusterProps> {
    type = "GeoJSON";

    constructor(@inject("IMapHolder") private mapHolder: IMapHolder,
        @inject("GeoJSONLayerCache") private cache: GeoJSONLayerCache,
        @inject("ShapeRenderer") private shapeRenderer: IFeatureRendeder,
        @inject("MarkerRenderer") private markerRenderer: IFeatureRendeder) { }

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

        return assign({}, options, {
            observable: null,
            featureId: featureId,
            pointToLayer: pointToLayer,
            onEachFeature: onEachFeature,
        });
    }

    private drawFeature(feature: GeoJSONFeature, options: ClusterProps): void {
        let featureId = options.featureId(feature);
        let layer = (this.cache.has(featureId)) ? this.updateFeature(this.cache.layers[featureId], feature, options) : this.addFeature(feature, options);
        this.cache.add(featureId, feature, layer);
    }

    private updateFeature(previousLayer: Layer, feature: GeoJSONFeature, options: ClusterProps): Layer {
        let previousFeature: GeoJSONFeature = this.cache.features[options.featureId(feature)];
        let layer: Layer = (feature.geometry.type !== "Point") ?
            this.shapeRenderer.updateFeature(previousLayer, previousFeature, feature, options) :
            this.markerRenderer.updateFeature(previousLayer, previousFeature, feature, options);

        if(layer.getTooltip()) {
            layer.unbindTooltip();
        }
        this.bindTooltip(feature, layer, options);

        if (options.onFeatureUpdated) {
            options.onFeatureUpdated(feature, layer);
        }
        return layer;
    }

    private addFeature(feature: GeoJSONFeature, options: ClusterProps): Layer {
        let layer = new GeoJSONLeaflet(feature, options).getLayers()[0];
        layer = (feature.geometry.type !== "Point") ?
            this.shapeRenderer.addFeature(layer, feature, options) :
            this.markerRenderer.addFeature(layer, feature, options);

        this.bindTooltip(feature, layer, options);
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
