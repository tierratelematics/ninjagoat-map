import ILayerPresenter from "./interfaces/ILayerPresenter";
import {LayerType, MapContext} from "./LayerRegistration";
import {Observable} from "rx";
import {inject} from "inversify";
import ILayerView from "./interfaces/ILayerView";
import {Dictionary} from "ninjagoat";
import IMapView from "./interfaces/IMapView";

class LayerPresenter implements ILayerPresenter {

    constructor(@inject("LayerViews") private layerViews: Dictionary<ILayerView<any,any>>,
                @inject("IMapView") private mapView: IMapView) {

    }

    present<T>(source: (context: MapContext) => Observable<T>, type: LayerType) {
        let observable = source({
            bounds: this.mapView.getBounds(),
            zoom: this.mapView.getZoom()
        });
        let subscription = observable.subscribe(data => {

        });
    }

}

export default LayerPresenter