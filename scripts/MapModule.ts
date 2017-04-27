import {IModule, IViewModelRegistry, IServiceLocator} from "ninjagoat";
import {interfaces} from "inversify";
import ILayerBinder from "./layer/ILayerBinder";
import LayerBinder from "./layer/LayerBinder";
import ILayerView from "./layer/ILayerView";
import GeoJSONLayerView from "./geojson/GeoJSONLayerView";
import IMapBoundaries from "./leaflet/IMapBoundaries";
import IMapHolder from "./leaflet/IMapHolder";
import MapHolder from "./leaflet/MapHolder";
import MapBoundaries from "./leaflet/MapBoundaries";
import {GeoJSON} from "./geojson/GeoJSONProps";

class MapModule implements IModule {

    modules = (container: interfaces.Container) => {
        container.bind<IMapHolder>("IMapHolder").to(MapHolder).inSingletonScope();
        container.bind<IMapBoundaries>("IMapBoundaries").to(MapBoundaries).inSingletonScope();
        container.bind<ILayerBinder>("ILayerBinder").to(LayerBinder).inSingletonScope();
        container.bind<ILayerView<GeoJSON, void>>("ILayerView").to(GeoJSONLayerView).inSingletonScope();
    };

    register(registry: IViewModelRegistry, serviceLocator?: IServiceLocator, overrides?: any): void {
    }

}

export default MapModule