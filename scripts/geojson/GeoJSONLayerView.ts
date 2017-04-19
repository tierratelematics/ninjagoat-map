import ILayerView from "../interfaces/ILayerView";
import {Layer, geoJSON as geoJSONLayer} from "leaflet";
import GeoJSONProps from "./GeoJSONProps";
import {LayerType} from "../LayerRegistration";
import {injectable} from "inversify";

@injectable()
class GeoJSONLayerView implements ILayerView<GeoJSONProps, void> {
    type: LayerType = "GeoJSON";

    create(props: GeoJSONProps, options: void): Layer {
        return geoJSONLayer(props);
    }

    update(fromProps: GeoJSONProps, toProps: GeoJSONProps, layer: Layer, options: void) {
        let untypedLayer = (<any>layer); //Due since leaflet types are incomplete
        untypedLayer.clearLayers();
        untypedLayer.addData(toProps);
    }

}

export default GeoJSONLayerView