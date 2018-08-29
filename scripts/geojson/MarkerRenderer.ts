import { IFeatureRendeder } from "./IFeatureRenderer";
import { injectable, inject } from "inversify";
import { Layer } from "leaflet";
import { GeoJSONFeature, ClusterProps } from "./GeoJSONProps";
import IMapBoundaries from "../leaflet/IMapBoundaries";
import { defaultClusterIcon } from "./Icons";
import { render } from "react-dom";

@injectable()
export class MarkerRenderer implements IFeatureRendeder {
    constructor(@inject("IMapBoundaries") private mapBoundaries: IMapBoundaries) { }

    addFeature(layer: Layer, feature: GeoJSONFeature, options: ClusterProps): Layer {
        if (this.shouldDisplayPopup(feature, options)) {
            layer.bindPopup(this.stringifyTemplate(options.popup(feature)));
        }

        return layer;
    }

    updateFeature(previousLayer, previousFeature: GeoJSONFeature, feature: GeoJSONFeature, options: ClusterProps): Layer {
        let [lng, lat] = feature.geometry.coordinates;
        previousLayer.setLatLng([lat, lng]);
        if (options.isCluster && options.isCluster(feature)) {
            let iconGenerator = options.clusterIcon || defaultClusterIcon;
            previousLayer.setIcon(iconGenerator(feature));
        } else {
            if (options.icon) previousLayer.setIcon(options.icon(feature));
        }

        if (this.shouldDisplayPopup(feature, options)) {
            previousLayer.setPopupContent(this.stringifyTemplate(options.popup(feature)));
        }

        return previousLayer;
    }

    private shouldDisplayPopup(feature: GeoJSONFeature, options: ClusterProps): boolean {
        let isMaxZoom = this.mapBoundaries.getMaxZoom() === this.mapBoundaries.getZoom();
        return ((!options.isCluster || (options.isCluster && !options.isCluster(feature))) || isMaxZoom) && !!options.popup;
    }

    private stringifyTemplate = (template: JSX.Element) => {
        if (!template) return;
        let host = document.createElement("div");
        render(template, host);
        return host;
    }
}