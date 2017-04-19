import IMapView from "./interfaces/IMapView";
import {LatLng, LatLngBounds} from "leaflet";
import {Observable} from "rx";
import {inject} from "inversify";
import IMapHolder from "./interfaces/IMapHolder";

class MapView implements IMapView {

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

    }

    changes(): Observable<void> {
        let map = this.holder.obtainMap();
        return Observable.fromCallback(map.on, map)('moveend');
    }

}

export default MapView