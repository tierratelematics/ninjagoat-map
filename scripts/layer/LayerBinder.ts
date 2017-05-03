import ILayerBinder from "./ILayerBinder";
import {inject, injectable, multiInject} from "inversify";
import ILayerView from "./ILayerView";
import {find} from "lodash";
import {MapObservableFactory} from "./MapContext";
import IMapBoundaries from "../leaflet/IMapBoundaries";
import {Layer} from "leaflet";
import {Observable} from "rx";

@injectable()
class LayerBinder implements ILayerBinder {

    constructor(@multiInject("ILayerView") private layerViews: ILayerView<any,any>[],
                @inject("IMapBoundaries") private mapBoundaries: IMapBoundaries) {

    }

    bind<T>(source: MapObservableFactory<T>, type: string, options: any): [Layer, Observable<void>] {
        let layerView = find(this.layerViews, ['type', type]);
        if (!layerView)
            throw new Error("No views registered for this type of layer");

        let layer = layerView.create(options),
            fromData: T;

        let binder = this.mapBoundaries.boundsChanges()
            .startWith(null)
            .map(() => source({
                bounds: this.mapBoundaries.getBounds(),
                zoom: this.mapBoundaries.getZoom()
            }))
            .switch()
            .map(newData => {
                layerView.update(fromData, newData, layer, options);
                fromData = newData;
            });

        return [layer, binder];
    }

}

export default LayerBinder