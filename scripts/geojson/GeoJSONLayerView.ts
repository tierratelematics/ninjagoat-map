import * as _ from "lodash";
import ILayerView from "../layer/ILayerView";
import { Layer, geoJSON as geoJSONLayer, LayerGroup, marker } from "leaflet";
import { injectable } from "inversify";
import { GeoJSONCollection, GeoJSONFeature, GeoJSONProps } from "./GeoJSONProps";
import IMapHolder from "../leaflet/IMapHolder";
import { lazyInject } from "ninjagoat";
import { render } from "react-dom";
import { GeoJSONLayerCache } from "./GeoJSONLayerCache";

@injectable()
class GeoJSONLayerView implements ILayerView<GeoJSONCollection, GeoJSONProps> {
    type = "GeoJSON";

    @lazyInject("IMapHolder")
    private mapHolder: IMapHolder;
    private options: GeoJSONProps;
    private cache: GeoJSONLayerCache;

    create(options: GeoJSONProps): Layer | LayerGroup {
        this.cache = new GeoJSONLayerCache();
        this.options = this.enrichOptions(options);
        return geoJSONLayer(null, this.options);
    }

    update(fromProps: GeoJSONCollection, toProps: GeoJSONCollection, layer: Layer | LayerGroup, options: GeoJSONProps) {
        this.cache.init();
        this.handleFeature(toProps);
        this.removeLayers();
    }

    private enrichOptions(options: GeoJSONProps): GeoJSONProps {
        let getFeatureId = !options.getFeatureId ? (feature: any) => feature.properties.id : options.getFeatureId;
        let getPopupContent = !options.getPopupContent ? () => null : options.getPopupContent;
        let isPopupOpen = !options.isPopupOpen ? () => false : options.isPopupOpen;

        let pointToLayer = !options.icon ? options.pointToLayer : (feature, latlng) => marker(latlng, {
            icon: options.icon(feature)
        });

        let onEachFeature = (feature: GeoJSON.Feature<GeoJSON.GeometryObject>, layer: Layer) => {
            layer.on("click", () => options.onMarkerClick && options.onMarkerClick(<GeoJSONFeature>feature));
            options.onEachFeature && options.onEachFeature(feature, layer);
        };

        return <GeoJSONProps>{
            getFeatureId: getFeatureId,
            isPopupOpen: isPopupOpen,
            pointToLayer: pointToLayer,
            getPopupContent: getPopupContent,
            style: options.style,
            onEachFeature: onEachFeature,
            filter: options.filter,
            coordsToLatLng: options.coordsToLatLng
        };
    }

    private handleFeature(geojson: GeoJSONFeature | GeoJSONCollection): void {
        let features = L.Util.isArray(geojson)
            ? (geojson as GeoJSONFeature)
            : (geojson as GeoJSONCollection).features;

        if (features) (features as GeoJSONFeature[]).map(f => isFeature(f) ? this.handleFeature(f) : null);
        else this.drawFeature(geojson as GeoJSONFeature);
    }

    private drawFeature(geojson: GeoJSONFeature): void {
        let feature = L.GeoJSON.asFeature(geojson) as GeoJSONFeature;
        let fId = this.options.getFeatureId(feature);
        let layer = this.updateFeature(feature, this.cache.layers[fId]);
        this.options.isPopupOpen(feature) && layer.openPopup();
        this.cache.add(fId, feature, layer);
    }

    private updateFeature(feature: GeoJSONFeature, previous: Layer): Layer {
        if (feature.geometry.type !== "Point") return;
        return !previous ? this.createLayer(feature) : this.moveLayer(previous, feature);
    }

    private createLayer(feature: GeoJSONFeature): Layer {
        let layer = L.GeoJSON.geometryToLayer(feature, this.options);
        if (!layer) return;

        this.options.onEachFeature(feature, layer);
        layer.bindPopup(stringifyTemplate(this.options.getPopupContent(feature)));
        this.mapHolder.obtainMap().addLayer(layer);
        return layer;
    }

    private moveLayer(previous, feature: GeoJSONFeature): Layer {
        if (!previous) return;

        let [lng, lat] = feature.geometry.coordinates;
        previous.setLatLng([lat, lng]);
        previous.setPopupContent(stringifyTemplate(this.options.getPopupContent(feature)));
        return previous;
    }

    private removeLayers() {
        _.map(this.cache.layers, (l, fId) => {
            if (this.cache.has(fId)) return;

            this.mapHolder.obtainMap().removeLayer(this.cache.layers[fId]);
            this.cache.remove(fId);
        });
    }
}

const isFeature = (feature): boolean => (feature.geometries || feature.geometry || feature.features || feature.coordinates);

const stringifyTemplate = (template: JSX.Element): string => {
    if (!template) return;
    let host = document.createElement("div");
    render(template, host);
    return host.innerHTML;
};

export default GeoJSONLayerView;
