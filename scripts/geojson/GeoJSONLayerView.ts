import { map, get } from "lodash";
import ILayerView from "../layer/ILayerView";
import { Layer, geoJSON as geoJSONLayer, GeoJSON as GeoJSONLeaflet, LayerGroup, marker } from "leaflet";
import { inject, injectable } from "inversify";
import { GeoJSONCollection, GeoJSONFeature, ClusterProps, TooltipDetail, PopupContext } from "./GeoJSONProps";
import { IFeatureRendeder } from "./IFeatureRenderer";
import { assign } from "lodash";
import { GeoJSONLayerCacheFactory } from "./GeoJSONLayerCacheFactory";
import { GeoJSONLayerCache } from "./GeoJSONLayerCache";
import { IPopupRenderer } from "../layer/IPopupRenderer";
import IMapBoundaries from "../leaflet/IMapBoundaries";
import { IDisposable, Subject } from "rx";
import { Feature } from "geojson";

@injectable()
class GeoJSONLayerView implements ILayerView<GeoJSONCollection, ClusterProps> {
    private cache: GeoJSONLayerCache;
    private options: ClusterProps;
    private layerGroup: LayerGroup;
    private onFeatureClick: Subject<Feature>;
    private featureSubscription: IDisposable;

    constructor(@inject("GeoJSONLayerCacheFactory") private cacheFactory: GeoJSONLayerCacheFactory,
        @inject("ShapeRenderer") private shapeRenderer: IFeatureRendeder,
        @inject("MarkerRenderer") private markerRenderer: IFeatureRendeder,
        @inject("IPopupRenderer") private popupRenderer: IPopupRenderer,
        @inject("IMapBoundaries") private mapBoundaries: IMapBoundaries) {
    }

    create(options: ClusterProps): Layer | LayerGroup {
        if (options.popup) {
            this.onFeatureClick = new Subject<Feature>();
            this.featureSubscription = this.onFeatureClick
                .switchMap((feature: GeoJSONFeature) => options.popup(feature).map((popupContext) => ([feature, popupContext])))
                .subscribe((data) => {
                    const [feature, popupContext] = data;
                    const element = this.renderPopup(feature, popupContext);
                    if (options.onPopupRendered) {
                        options.onPopupRendered(element);
                    }
                });
        }

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
            layer.on("click", () => {
                this.handleFeatureClick(feature);
            });
            layer.on("popupclose", () => {
                this.handlePopupClose(<GeoJSONFeature>feature, layer);
            });
            options.onEachFeature && options.onEachFeature(feature, layer);
        };

        return assign({}, options, {
            observable: null,
            featureId: featureId,
            pointToLayer: pointToLayer,
            onEachFeature: onEachFeature,
        });
    }

    private handlePopupClose(feature: GeoJSONFeature, layer: Layer): void {
        if(this.options.popupClose){
            const featureId: string = this.options.featureId(<GeoJSONFeature>feature);
            this.options.popupClose(this.cache.features[featureId], layer);
            return;
        }
        layer.unbindPopup();
    }

    private handleFeatureClick(feature: GeoJSON.Feature<GeoJSON.GeometryObject>): void {
        const geoFeature: GeoJSONFeature = <GeoJSONFeature>feature;
        const featureId: string = this.options.featureId(geoFeature);
        const featureCached: GeoJSONFeature = this.cache.features[featureId];
        if (this.onFeatureClick && !this.options.isCluster(geoFeature)) {
            this.onFeatureClick.onNext(featureCached);
        }
        
        this.options.onMarkerClick && this.options.onMarkerClick(featureCached);
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
                this.cache.layers[featureId].unbindPopup();
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

    private renderPopup(feature: GeoJSONFeature, context: PopupContext): HTMLElement {
        const featureToAnchor: GeoJSONFeature = get(context, 'displayOptions.anchorTo', feature);
        const featureId: string = this.options.featureId(featureToAnchor);

        context = assign<PopupContext>({
            displayOptions: {
                when: () => this.shouldDisplayPopup(this.cache.features[featureId], featureId)
            }
        }, context);
        return this.popupRenderer.renderOn(this.cache.layers[featureId], context);
    }

    private shouldDisplayPopup(feature: GeoJSONFeature, featureId: string): boolean {
        if(!this.cache.has(featureId)){
            return false;
        }
        let isMaxZoom = this.mapBoundaries.getMaxZoom() === this.mapBoundaries.getZoom();
        return (!this.options.isCluster || (this.options.isCluster && !this.options.isCluster(feature))) || isMaxZoom;
    }

    dispose(): void {
        if (this.featureSubscription) {
            this.featureSubscription.dispose();
        }
    }
}

export default GeoJSONLayerView;
