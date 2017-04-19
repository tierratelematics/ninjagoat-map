import ILayerPresenter from "./interfaces/ILayerPresenter";
import {LayerType, MapObservableFactory} from "./LayerRegistration";
import {inject, injectable, multiInject} from "inversify";
import ILayerView from "./interfaces/ILayerView";
import IMapView from "./interfaces/IMapView";
import {Layer} from "leaflet";
import {find} from "lodash";

@injectable()
class LayerPresenter implements ILayerPresenter {

    constructor(@multiInject("ILayerView") private layerViews: ILayerView<any,any>[],
                @inject("IMapView") private mapView: IMapView) {

    }

    present<T>(source: MapObservableFactory<T>, type: LayerType, options: any) {
        let layerView = find(this.layerViews, ['type', type]);
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