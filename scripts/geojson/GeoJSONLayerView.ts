import * as _ from "lodash";
import ILayerView from "../layer/ILayerView";
import { Layer, geoJSON as geoJSONLayer, GeoJSON as GeoJSONLeaflet, LayerGroup, marker } from "leaflet";
import { inject, injectable } from "inversify";
import { GeoJSONCollection, GeoJSONFeature, ClusterProps } from "./GeoJSONProps";
import IMapHolder from "../leaflet/IMapHolder";
import { render } from "react-dom";
import { GeoJSONLayerCache } from "./GeoJSONLayerCache";

@injectable()
class GeoJSONLayerView implements ILayerView<GeoJSONCollection, ClusterProps> {
    type = "GeoJSON";

    constructor(@inject("IMapHolder") private mapHolder: IMapHolder,
                @inject("GeoJSONLayerCache") private cache: GeoJSONLayerCache) { }

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
        let featureId = !options.featureId ? (feature: any) => feature.properties.id : options.featureId;
        let popup = !options.popup ? () => null : options.popup;
        let pointToLayer = options.pointToLayer ? options.pointToLayer : (feature, latlng) => {
            return marker(latlng, options.icon ? {
                icon: options.icon(feature)
            } : undefined);
        };
        let onEachFeature = (feature: GeoJSON.Feature<GeoJSON.GeometryObject>, layer: Layer) => {
            layer.on("click", () => options.onMarkerClick && options.onMarkerClick(<GeoJSONFeature>feature));
            options.onEachFeature && options.onEachFeature(feature, layer);
        };

        return {
            observable: null,
            featureId: featureId,
            pointToLayer: pointToLayer,
            popup: popup,
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
        let layer = this.updateFeature(feature, this.cache.layers[featureId], options);
        this.cache.add(featureId, feature, layer);
    }

    private updateFeature(feature: GeoJSONFeature, previous: Layer, options: ClusterProps): Layer {
        if (feature.geometry.type !== "Point") return;
        return !previous ? this.createLayer(feature, options) : this.moveLayer(previous, feature, options);
    }

    private createLayer(feature: GeoJSONFeature, options: ClusterProps): Layer {
        let layer = GeoJSONLeaflet.geometryToLayer(feature, options);
        if (!layer) return;

        options.onEachFeature(feature, layer);
        if (!options.isCluster(feature) && options.popup)
            layer.bindPopup(this.stringifyTemplate(options.popup(feature)));
        this.mapHolder.obtainMap().addLayer(layer);
        return layer;
    }

    private moveLayer(previous, feature: GeoJSONFeature, options: ClusterProps): Layer {
        if (!previous) return;

        let [lng, lat] = feature.geometry.coordinates;
        previous.setLatLng([lat, lng]);
        if (options.isCluster && options.isCluster(feature)) {
            options.clusterIcon && previous.setIcon(options.clusterIcon(feature));
        } else {
            if (options.icon) previous.setIcon(options.icon(feature));
            if (options.popup) previous.setPopupContent(this.stringifyTemplate(options.popup(feature)));
        }
        return previous;
    }

    private removeLayers() {
        let map = this.mapHolder.obtainMap();
        _.map(this.cache.layers, (l: Layer, featureId: string) => {
            if (this.cache.has(featureId)) return;

            map.removeLayer(this.cache.layers[featureId]);
            this.cache.remove(featureId);
        });
    }

    private stringifyTemplate = (template: JSX.Element): string => {
        if (!template) return;
        let host = document.createElement("div");
        render(template, host);
        return host.innerHTML;
    }
}

export default GeoJSONLayerView;
