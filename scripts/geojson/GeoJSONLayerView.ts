import ILayerView from "../layer/ILayerView";
import {Layer, geoJSON as geoJSONLayer} from "leaflet";
import {injectable} from "inversify";
import GeoJSONProps from "./GeoJSONProps";
import {LayerType} from "../layer/LayerRegistration";

@injectable()
class GeoJSONLayerView implements ILayerView<GeoJSONProps, any> {
    type: LayerType = "GeoJSON";

    create(options: any): Layer {
        return geoJSONLayer(null, options);
    }

    update(fromProps: GeoJSONProps, toProps: GeoJSONProps, layer: Layer, options: any) {
        let untypedLayer = (<any>layer); //Due since leaflet types are incomplete
        untypedLayer.clearLayers();
        untypedLayer.addData(toProps);
    }

}

export default GeoJSONLayerView