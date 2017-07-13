import {Map} from "leaflet";

interface IMapHolder {
    obtainMap(): Map;
    setMap(map: Map);
}

export default IMapHolder
