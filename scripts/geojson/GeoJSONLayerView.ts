import ILayerView from "../layer/ILayerView";
import {Layer, geoJSON as geoJSONLayer, GeoJSON as GeoJSONGroup, LayerGroup, marker, Icon, icon} from "leaflet";
import {injectable} from "inversify";
import {GeoJSONCollection, GeoJSONFeature, GeoJSONProps} from "./GeoJSONProps";

@injectable()
class GeoJSONLayerView implements ILayerView<GeoJSONCollection, GeoJSONProps> {
    type = "GeoJSON";

    create(options: GeoJSONProps): Layer | LayerGroup {
        let pointToLayer = !options.icon ? options.pointToLayer : (feature, latlng) => marker(latlng, {
            icon: options.icon(feature)
        });
        let onEachFeature = (feature: GeoJSON.Feature<GeoJSON.GeometryObject>, layer: Layer) => {
            layer.on("click", () => options.onMarkerClick && options.onMarkerClick(<GeoJSONFeature>feature));
            options.onEachFeature && options.onEachFeature(feature, layer);
        };
        return geoJSONLayer(null, {
            pointToLayer: pointToLayer,
            style: options.style,
            onEachFeature: onEachFeature,
            filter: options.filter,
            coordsToLatLng: options.coordsToLatLng
        });
    }

    update(fromProps: GeoJSONCollection, toProps: GeoJSONCollection, layer: Layer | LayerGroup, options: GeoJSONProps) {
        let featureGroup = <GeoJSONGroup>layer;
        featureGroup.clearLayers();
        featureGroup.addData(toProps);
    }

}

export default GeoJSONLayerView