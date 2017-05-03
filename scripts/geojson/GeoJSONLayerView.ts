import ILayerView from "../layer/ILayerView";
import {Layer, geoJSON as geoJSONLayer, GeoJSON as GeoJSONGroup} from "leaflet";
import {injectable} from "inversify";
import {GeoJSONCollection, GeoJSONProps} from "./GeoJSONProps";

@injectable()
class GeoJSONLayerView implements ILayerView<GeoJSONCollection, GeoJSONProps> {
    type = "GeoJSON";

    create(options: GeoJSONProps): Layer {
        return geoJSONLayer(null, options);
    }

    update(fromProps: GeoJSONCollection, toProps: GeoJSONCollection, layer: Layer, options: GeoJSONProps) {
        let featureGroup = <GeoJSONGroup>layer;
        featureGroup.clearLayers();
        featureGroup.addData(toProps);
    }

}

export default GeoJSONLayerView