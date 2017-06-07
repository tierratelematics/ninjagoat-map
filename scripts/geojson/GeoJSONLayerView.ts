import * as _ from "lodash";
import ILayerView from "../layer/ILayerView";
import { Layer, geoJSON as geoJSONLayer, GeoJSON as GeoJSONLeaflet, LayerGroup, marker } from "leaflet";
import { inject, injectable } from "inversify";
import { GeoJSONCollection, GeoJSONFeature, GeoJSONProps } from "./GeoJSONProps";
import IMapHolder from "../leaflet/IMapHolder";
import { render } from "react-dom";
import { GeoJSONLayerCache } from "./GeoJSONLayerCache";
import {interfaces} from "inversify";
import {Component} from "react";

@injectable()
class GeoJSONLayerView implements ILayerView<GeoJSONCollection, GeoJSONProps> {
    type = "GeoJSON";

    constructor(@inject("IMapHolder") private mapHolder: IMapHolder,
                @inject("GeoJSONLayerCache") private cache: GeoJSONLayerCache) { }

    create(options: GeoJSONProps): Layer | LayerGroup {
        this.cache.init();
        return geoJSONLayer(null, options);
    }

    update(fromProps: GeoJSONCollection, toProps: GeoJSONCollection, layer: Layer | LayerGroup, options: GeoJSONProps) {
        if (!toProps || !toProps.features) return;

        this.cache.clear();
        toProps.features.map(f => this.drawFeature(f, this.enrichOptions(options)));
        this.removeLayers();
    }

    private enrichOptions(options: GeoJSONProps): GeoJSONProps {
        let featureId = !options.featureId ? (feature: any) => feature.properties.id : options.featureId;
        let popup = !options.popup ? () => null : options.popup;
        let onEachFeature = (feature: GeoJSON.Feature<GeoJSON.GeometryObject>, layer: Layer) => {
            layer.on("click", () => options.onMarkerClick && options.onMarkerClick(<GeoJSONFeature>feature));
            options.onEachFeature && options.onEachFeature(feature, layer);
        };

        return <GeoJSONProps>{
            featureId: featureId,
            pointToLayer: options.pointToLayer,
            popup: popup,
            style: options.style,
            onEachFeature: onEachFeature,
            filter: options.filter,
            coordsToLatLng: options.coordsToLatLng
        };
    }

    private drawFeature(feature: GeoJSONFeature, options: GeoJSONProps): void {
        let featureId = options.featureId(feature);
        let layer = this.updateFeature(feature, this.cache.layers[featureId], options);
        this.cache.add(featureId, feature, layer);
    }

    private updateFeature(feature: GeoJSONFeature, previous: Layer, options: GeoJSONProps): Layer {
        if (feature.geometry.type !== "Point") return;
        return !previous ? this.createLayer(feature, options) : this.moveLayer(previous, feature, options);
    }

    private createLayer(feature: GeoJSONFeature, options: GeoJSONProps): Layer {
        let layer = GeoJSONLeaflet.geometryToLayer(feature, options);
        if (!layer) return;

        options.onEachFeature(feature, layer);
        layer.bindPopup(stringifyTemplate(options.popup(feature)));
        this.mapHolder.obtainMap().addLayer(layer);
        return layer;
    }

    private moveLayer(previous, feature: GeoJSONFeature, options: GeoJSONProps): Layer {
        if (!previous) return;

        let [lng, lat] = feature.geometry.coordinates;
        previous.setLatLng([lat, lng]);
        previous.setPopupContent(stringifyTemplate(options.popup(feature)));
        return previous;
    }

    private removeLayers() {
        _.map(this.cache.layers, (l: Layer, fId: string) => {
            if (this.cache.has(fId)) return;

            this.mapHolder.obtainMap().removeLayer(this.cache.layers[fId]);
            this.cache.remove(fId);
        });
    }
}

const stringifyTemplate = (template: interfaces.Newable<Component<any, any>>): string => {
    if (!template) return;
    let host = document.createElement("div");
    render(template, host);
    return host.innerHTML;
};

export default GeoJSONLayerView;
