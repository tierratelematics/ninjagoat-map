import {Map} from "leaflet";
import {injectable} from "inversify";
import IMapHolder from "./IMapHolder";

@injectable()
class MapHolder implements IMapHolder {

    map: Map;

    obtainMap(): Map {
        return this.map;
    }

    setMap(map: Map) {
        this.map = map;
    }
}

export default MapHolder