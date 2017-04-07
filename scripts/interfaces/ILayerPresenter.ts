import {LayerType, MapContext} from "../LayerRegistration";
import {Observable} from "rx";

interface ILayerPresenter {
    present<T>(source: (context: MapContext) => Observable<T>, type: LayerType);
}

export default ILayerPresenter