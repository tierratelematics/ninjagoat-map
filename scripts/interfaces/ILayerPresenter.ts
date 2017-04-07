import {LayerType, MapContext} from "../LayerRegistration";
import {Observable} from "rx";
import IConnectedLayer from "./IConnectedLayer";

interface ILayerPresenter {
    present<T>(source: (context: MapContext) => Observable<T>, type: LayerType): IConnectedLayer;
}

export default ILayerPresenter