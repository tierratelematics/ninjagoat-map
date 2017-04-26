import {LatLng, LatLngBounds} from "leaflet";
import {Observable} from "rx";

interface IMapView {
    getCenter(): LatLng;
    getBounds(): LatLngBounds;
    getZoom(): number;
    setCenter(center: LatLng, zoom?: number);
    changes(): Observable<void>;
}

export default IMapView