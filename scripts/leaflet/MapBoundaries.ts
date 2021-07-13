import { LatLng, LatLngBounds } from "leaflet";
import {fromEvent, Observable} from "rxjs";
import { inject, injectable } from "inversify";
import IMapBoundaries from "./IMapBoundaries";
import IMapHolder from "./IMapHolder";

@injectable()
class MapBoundaries implements IMapBoundaries {

    constructor(@inject("IMapHolder") private holder: IMapHolder) { }

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

    getMaxZoom(): number {
        let map = this.holder.obtainMap();
        return map.getMaxZoom();
    }

    setCenter(center: LatLng, zoom?: number) {
        let map = this.holder.obtainMap();
        map.setView(center, zoom);
    }

    boundsChanges(): Observable<void> {
        return fromEvent(this.holder.obtainMap(), "moveend");
    }

    fitBounds(bounds, options?) {
        let map = this.holder.obtainMap();
        map.fitBounds(bounds, options);
    }
}

export default MapBoundaries;
