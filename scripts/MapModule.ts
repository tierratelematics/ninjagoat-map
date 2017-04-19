import {IModule, IViewModelRegistry, IServiceLocator} from "ninjagoat";
import {interfaces} from "inversify";
import MapHolder from "./leaflet/MapHolder";
import IMapHolder from "./interfaces/IMapHolder";
import MapView from "./leaflet/MapView";
import IMapView from "./interfaces/IMapView";
import ILayerPresenter from "./interfaces/ILayerPresenter";
import LayerPresenter from "./LayerPresenter";
import ILayerView from "./interfaces/ILayerView";
import GeoJSONLayerView from "./geojson/GeoJSONLayerView";
import TileLayerView from "./tile/TileLayerView";
import TileProps from "./tile/TileProps";
import GeoJSONProps from "./geojson/GeoJSONProps";
import LayerManager from "./leaflet/LayerManager";
import ILayerManager from "./interfaces/ILayerManager";

class MapModule implements IModule {

    modules = (container: interfaces.Container) => {
        container.bind<IMapHolder>("IMapHolder").to(MapHolder).inSingletonScope();
        container.bind<IMapView>("IMapView").to(MapView).inSingletonScope();
        container.bind<ILayerPresenter>("ILayerPresenter").to(LayerPresenter).inSingletonScope();
        container.bind<ILayerManager>("ILayerManager").to(LayerManager).inSingletonScope();
        container.bind<ILayerView<GeoJSONProps, void>>("ILayerView").to(GeoJSONLayerView).inSingletonScope();
        container.bind<ILayerView<TileProps, void>>("ILayerView").to(TileLayerView).inSingletonScope();
    };

    register(registry: IViewModelRegistry, serviceLocator?: IServiceLocator, overrides?: any): void {
    }

}

export default MapModule