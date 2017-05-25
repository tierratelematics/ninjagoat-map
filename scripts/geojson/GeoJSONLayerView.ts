import ILayerView from "../layer/ILayerView";
import {Layer, geoJSON as geoJSONLayer, GeoJSON as GeoJSONGroup, LayerGroup, marker, Icon, icon} from "leaflet";
import {injectable} from "inversify";
import {GeoJSONCollection, GeoJSONProps} from "./GeoJSONProps";

@injectable()
class GeoJSONLayerView implements ILayerView<GeoJSONCollection, GeoJSONProps> {
    type = "GeoJSON";

    create(options: GeoJSONProps): Layer | LayerGroup {
        let pointToLayer = !options.icon ? options.pointToLayer : (geoJsonPoint, latlng) => marker(latlng, {
            icon: options.icon
        });
        return geoJSONLayer(null, {
            pointToLayer: pointToLayer,
            style: options.style,
            onEachFeature: options.onEachFeature,
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