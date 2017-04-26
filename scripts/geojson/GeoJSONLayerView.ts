import ILayerView from "../interfaces/ILayerView";
import {Layer, geoJSON as geoJSONLayer} from "leaflet";
import {LayerType} from "../LayerRegistration";
import {injectable} from "inversify";

type GeoJSONProps = GeoJSON.FeatureCollection<GeoJSON.GeometryObject>;

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