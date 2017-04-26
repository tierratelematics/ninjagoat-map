import {IModule, IViewModelRegistry, IServiceLocator} from "ninjagoat";
import {interfaces} from "inversify";
import ILayerBinder from "./layer/ILayerBinder";
import LayerBinder from "./layer/LayerBinder";
import ILayerView from "./layer/ILayerView";
import GeoJSONProps from "./geojson/GeoJSONProps";
import GeoJSONLayerView from "./geojson/GeoJSONLayerView";
import IMapView from "./leaflet/IMapView";
import IMapHolder from "./leaflet/IMapHolder";
import MapHolder from "./leaflet/MapHolder";
import MapView from "./leaflet/MapView";

class MapModule implements IModule {

    modules = (container: interfaces.Container) => {
        container.bind<IMapHolder>("IMapHolder").to(MapHolder).inSingletonScope();
        container.bind<IMapView>("IMapView").to(MapView).inSingletonScope();
        container.bind<ILayerBinder>("ILayerBinder").to(LayerBinder).inSingletonScope();
        container.bind<ILayerView<GeoJSONProps, void>>("ILayerView").to(GeoJSONLayerView).inSingletonScope();
    };

    register(registry: IViewModelRegistry, serviceLocator?: IServiceLocator, overrides?: any): void {
    }

}

export default MapModule