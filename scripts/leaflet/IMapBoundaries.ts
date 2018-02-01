import {LatLng, LatLngBounds, LatLngBoundsExpression, FitBoundsOptions} from "leaflet";
import {Observable} from "rx";

interface IMapBoundaries {
    getCenter(): LatLng;
    getBounds(): LatLngBounds;
    getZoom(): number;
    getMaxZoom(): number;
    setCenter(center: LatLng, zoom?: number);
    boundsChanges(): Observable<void>;
    fitBounds(bounds: LatLngBoundsExpression, options?: FitBoundsOptions): void;
}

export default IMapBoundaries