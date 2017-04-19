import ILayerManager from "../interfaces/ILayerManager";
import {Layer} from "leaflet";
import {injectable, inject} from "inversify";
import IMapHolder from "../interfaces/IMapHolder";

@injectable()
class LayerManager implements ILayerManager {

    constructor(@inject("IMapHolder") private mapHolder: IMapHolder) {

    }

    add(layer: Layer) {
        layer.addTo(this.mapHolder.obtainMap());
    }

}

export default LayerManager