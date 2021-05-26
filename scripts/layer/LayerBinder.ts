import {inject, injectable} from "inversify";
import {Layer, LayerGroup} from "leaflet";
import {EMPTY, iif, Observable} from "rxjs";
import IMapBoundaries from "../leaflet/IMapBoundaries";
import ILayerBinder from "./ILayerBinder";
import {ILayerFactory} from "./ILayerFactory";
import {MapObservableFactory} from "./MapContext";
import ILayerView from "./ILayerView";
import {map, startWith, switchAll} from "rxjs/operators";

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
        let binder = iif(() => !(options && options.freezeBounds), this.mapBoundaries.boundsChanges(), EMPTY)
            .pipe(
                startWith(null),
                map(() => source({
                    bounds: this.mapBoundaries.getBounds(),
                    zoom: this.mapBoundaries.getZoom()
                })),
                switchAll(),
                map(newData => {
                    layerView.update(fromData, newData);
                    fromData = newData as T;
                })
            );
        return [layer, binder];
    }

    dispose(): void {
        this.layerView.dispose();
    }

}

export default LayerBinder
