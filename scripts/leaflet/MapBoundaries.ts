import {LatLng, LatLngBounds} from "leaflet";
import {Observable} from "rx";
import {inject, injectable} from "inversify";
import IMapBoundaries from "./IMapBoundaries";
import IMapHolder from "./IMapHolder";

@injectable()
class MapBoundaries implements IMapBoundaries {

    constructor(@inject("IMapHolder") private holder: IMapHolder) {

    }

    getCenter(): LatLng {
        let map = this.holder.obtainMap();
        return map.getCenter();
    }

    getBounds(): LatLngBounds {
        let map = this.holder.obtainMap();
        return map.getBounds();
    }

    getZoom(): number {
        let map = this.holder.obtainMap();
        return map.getZoom();
    }

    setCenter(center: LatLng, zoom?: number) {
        let map = this.holder.obtainMap();
        map.flyTo(center, zoom);
    }

    boundsChanges(): Observable<void> {
        return Observable.fromEvent(this.holder.obtainMap(), 'moveend');
    }

}

export default MapBoundaries