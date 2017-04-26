import ILayerBinder from "../interfaces/ILayerBinder";
import {LayerType, MapObservableFactory} from "./LayerRegistration";
import {inject, injectable, multiInject} from "inversify";
import ILayerView from "../interfaces/ILayerView";
import IMapView from "./interfaces/IMapView";
import {Layer} from "leaflet";
import {find} from "lodash";
import ILayerManager from "./interfaces/ILayerManager";

@injectable()
class LayerBinder implements ILayerBinder {

    constructor(@multiInject("ILayerView") private layerViews: ILayerView<any,any>[],
                @inject("IMapView") private mapView: IMapView,
                @inject("ILayerManager") private layerManager: ILayerManager) {

    }

    bind<T>(source: MapObservableFactory<T>, type: LayerType, options: any) {
        let layerView = find(this.layerViews, ['type', type]);
        if (!layerView)
            throw new Error("No views registered for this type of layer");

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
                if (!fromData) {
                    layer = layerView.create(newData, options);
                    this.layerManager.add(layer);
                } else {
                    layerView.update(fromData, newData, layer, options);
                }
                fromData = newData;
            });
    }

}

export default LayerBinder