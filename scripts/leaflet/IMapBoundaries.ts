import {LatLng, LatLngBounds} from "leaflet";
import {Observable} from "rx";

interface IMapBoundaries {
    getCenter(): LatLng;
    getBounds(): LatLngBounds;
    getZoom(): number;
    setCenter(center: LatLng, zoom?: number);
    changes(): Observable<void>;
}

export default IMapBoundaries