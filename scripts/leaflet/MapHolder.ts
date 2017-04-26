import IMapHolder from "./interfaces/IMapHolder";
import {Map} from "leaflet";
import {injectable} from "inversify";

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