import ILayerBinder from "./ILayerBinder";
import {inject, injectable, multiInject} from "inversify";
import ILayerView from "./ILayerView";
import {find} from "lodash";
import {LayerType, MapObservableFactory} from "./LayerRegistration";
import IMapView from "../leaflet/IMapView";
import {Layer} from "leaflet";

@injectable()
class LayerBinder implements ILayerBinder {

    constructor(@multiInject("ILayerView") private layerViews: ILayerView<any,any>[],
                @inject("IMapView") private mapView: IMapView) {

    }

    bind<T>(source: MapObservableFactory<T>, type: LayerType, options: any): Layer {
        let layerView = find(this.layerViews, ['type', type]);
        if (!layerView)
            throw new Error("No views registered for this type of layer");

        let layer = layerView.create(options),
            fromData: T;

        this.mapView.changes()
            .startWith(null)
            .map(() => source({
                bounds: this.mapView.getBounds(),
                zoom: this.mapView.getZoom()
            }))
            .switch()
            .subscribe(newData => {
                layerView.update(fromData, newData, layer, options);
                fromData = newData;
            });

        return layer;
    }

}

export default LayerBinder