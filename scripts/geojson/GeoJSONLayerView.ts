import ILayerView from "../layer/ILayerView";
import {Layer, geoJSON as geoJSONLayer, GeoJSON as GeoJSONGroup} from "leaflet";
import {injectable} from "inversify";
import {GeoJSONCollection} from "./GeoJSONProps";

@injectable()
class GeoJSONLayerView implements ILayerView<GeoJSONCollection, any> {
    type = "GeoJSON";

    create(options: any): Layer {
        return geoJSONLayer(null, options);
    }

    update(fromProps: GeoJSONCollection, toProps: GeoJSONCollection, layer: Layer, options: any) {
        let featureGroup = <GeoJSONGroup>layer;
        featureGroup.clearLayers();
        featureGroup.addData(toProps);
    }

}

export default GeoJSONLayerView