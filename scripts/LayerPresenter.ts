import ILayerPresenter from "./interfaces/ILayerPresenter";
import {LayerType, MapContext} from "./LayerRegistration";
import {Observable} from "rx";
import {inject} from "inversify";
import ILayerView from "./interfaces/ILayerView";
import {Dictionary} from "ninjagoat";

class LayerPresenter implements ILayerPresenter {

    constructor(@inject("LayerViews") private layerViews:Dictionary<ILayerView<any,any>>) {

    }

    present<T>(source: (context: MapContext) => Observable<T>, type: LayerType) {
        
    }

}

export default LayerPresenter