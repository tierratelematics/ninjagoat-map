import { inject, injectable } from "inversify";
import { Layer, LayerGroup } from "leaflet";
import { Observable } from "rx";
import IMapBoundaries from "../leaflet/IMapBoundaries";
import ILayerBinder from "./ILayerBinder";
import { ILayerFactory } from "./ILayerFactory";
import { MapObservableFactory } from "./MapContext";
import ILayerView from "./ILayerView";

@injectable()
class LayerBinder implements ILayerBinder {
    private layerView: ILayerView<any, any>;
    
    constructor(@inject("ILayerFactory") private layerFactory: ILayerFactory,
                @inject("IMapBoundaries") private mapBoundaries: IMapBoundaries) {
    }

    bind<T>(source: MapObservableFactory<T>, type: string, options: any): [Layer | LayerGroup, Observable<void>] {
        let [layer, layerView] = this.layerFactory.create(type, options),
            fromData: T;

        this.layerView = layerView;
        let binder = Observable.if(() => !(options && options.freezeBounds), this.mapBoundaries.boundsChanges(), Observable.empty())
            .startWith(null)
            .map(() => source({
                bounds: this.mapBoundaries.getBounds(),
                zoom: this.mapBoundaries.getZoom()
            }))
            .switch()
            .map(newData => {
                layerView.update(fromData, newData);
                fromData = newData;
            });

        return [layer, binder];
    }

    dispose(): void {
        this.layerView.dispose();
    }

}

export default LayerBinder
