import {latLng, LatLng} from "leaflet";

class CoordinatesUtil {
    static latLng(latitude: number, longitude: number): LatLng {
        return latLng(latitude, longitude);
    }
}

export default CoordinatesUtil