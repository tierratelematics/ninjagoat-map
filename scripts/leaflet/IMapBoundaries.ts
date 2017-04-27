import {LatLng, LatLngBounds} from "leaflet";
import {Observable} from "rx";

interface IMapBoundaries {
    getCenter(): LatLng;
    getBounds(): LatLngBounds;
    getZoom(): number;
    setCenter(center: LatLng, zoom?: number);
    boundsChanges(): Observable<void>;
}

export default IMapBoundaries