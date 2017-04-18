import ILayerPresenter from "./interfaces/ILayerPresenter";
import {LayerType, MapContext} from "./LayerRegistration";
import {Observable} from "rx";
import {inject, injectable} from "inversify";
import ILayerView from "./interfaces/ILayerView";
import {Dictionary} from "ninjagoat";
import IMapView from "./interfaces/IMapView";
import {Layer} from "leaflet";

@injectable()
class LayerPresenter implements ILayerPresenter {

    constructor(@inject("LayerViews") private layerViews: Dictionary<ILayerView<any,any>>,
                @inject("IMapView") private mapView: IMapView) {

    }

    present<T>(source: (context: MapContext) => Observable<T>, type: LayerType, options: any) {
        let layerView = this.layerViews[type];
        if (!layerView)
            throw new Error("No view registered for this type of layer");

        let layer: Layer,
            fromData: T;

        this.mapView.changes()
            .startWith(null)
            .map(() => source({
                bounds: this.mapView.getBounds(),
                zoom: this.mapView.getZoom()
            }))
            .switch()
            .subscribe(newData => {
                if (!fromData)
                    layer = layerView.create(newData, options);
                else
                    layerView.update(fromData, newData, layer, options);
                fromData = newData;
            });
    }

}

export default LayerPresenter