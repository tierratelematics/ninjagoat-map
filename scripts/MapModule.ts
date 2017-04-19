import {IModule, IViewModelRegistry, IServiceLocator} from "ninjagoat";
import {interfaces} from "inversify";
import MapHolder from "./leaflet/MapHolder";
import IMapHolder from "./interfaces/IMapHolder";
import MapView from "./leaflet/MapView";
import IMapView from "./interfaces/IMapView";
import ILayerPresenter from "./interfaces/ILayerPresenter";
import LayerPresenter from "./LayerPresenter";

class MapModule implements IModule {

    modules = (container: interfaces.Container) => {
        container.bind<IMapHolder>("IMapHolder").to(MapHolder).inSingletonScope();
        container.bind<IMapView>("IMapView").to(MapView).inSingletonScope();
        container.bind<ILayerPresenter>("ILayerPresenter").to(LayerPresenter).inSingletonScope();
    };

    register(registry: IViewModelRegistry, serviceLocator?: IServiceLocator, overrides?: any): void {
    }

}

export default MapModule