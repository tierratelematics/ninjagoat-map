import { IModule, IViewModelRegistry, IServiceLocator } from "ninjagoat";
import { interfaces } from "inversify";
import ILayerBinder from "./layer/ILayerBinder";
import LayerBinder from "./layer/LayerBinder";
import ILayerView from "./layer/ILayerView";
import GeoJSONLayerView from "./geojson/GeoJSONLayerView";
import IMapBoundaries from "./leaflet/IMapBoundaries";
import IMapHolder from "./leaflet/IMapHolder";
import MapHolder from "./leaflet/MapHolder";
import MapBoundaries from "./leaflet/MapBoundaries";
import FeatureLayerView from "./draw/DrawingLayerView";
import IShapeTransformer from "./draw/IShapeTransformer";
import ShapeTransformer from "./draw/ShapeTransformer";
import IGeocodingProvider from "./geocoding/IGeocodingProvider";
import GoogleGeocodingProvider from "./geocoding/GoogleGeocodingProvider";
import { PathLayerView } from "./path/PathLayerView";
import { ShapeRenderer } from "./geojson/ShapeRenderer";
import { MarkerRenderer } from "./geojson/MarkerRenderer";
import { IFeatureRendeder } from "./geojson/IFeatureRenderer";
import { GeoJSONLayerCacheFactory } from "./geojson/GeoJSONLayerCacheFactory";
import { ILayerFactory } from "./layer/ILayerFactory";
import { LayerFactory } from "./layer/LayerFactory";
import { IPopupRenderer } from "./layer/IPopupRenderer";
import { PopupRenderer } from "./layer/PopupRenderer";

class MapModule implements IModule {

    modules = (container: interfaces.Container) => {
        container.bind<IMapHolder>("IMapHolder").to(MapHolder).inSingletonScope();
        container.bind<IMapBoundaries>("IMapBoundaries").to(MapBoundaries).inSingletonScope();
        container.bind<ILayerBinder>("ILayerBinder").to(LayerBinder).inSingletonScope();
        container.bind<ILayerFactory>("ILayerFactory").to(LayerFactory).inRequestScope();
        container.bind<GenericLayerView>("GeoJSONLayerView").to(GeoJSONLayerView);
        container.bind<GenericLayerView>("PathLayerView").to(PathLayerView);
        container.bind<GenericLayerView>("FeatureLayerView").to(FeatureLayerView);
        container.bind<interfaces.Factory<GenericLayerView>>("Factory<ILayerView>").toAutoFactory("GeoJSONLayerView").whenTargetNamed("GeoJSON");
        container.bind<interfaces.Factory<GenericLayerView>>("Factory<ILayerView>").toAutoFactory("PathLayerView").whenTargetNamed("Path");
        container.bind<interfaces.Factory<GenericLayerView>>("Factory<ILayerView>").toAutoFactory("FeatureLayerView").whenTargetNamed("Drawing");
        container.bind<IPopupRenderer>("IPopupRenderer").to(PopupRenderer).inSingletonScope();
        container.bind<IShapeTransformer>("IShapeTransformer").to(ShapeTransformer).inSingletonScope();
        container.bind<IGeocodingProvider>("IGeocodingProvider").to(GoogleGeocodingProvider).inSingletonScope();
        container.bind<IFeatureRendeder>("ShapeRenderer").to(ShapeRenderer).inSingletonScope();
        container.bind<IFeatureRendeder>("MarkerRenderer").to(MarkerRenderer).inSingletonScope();
        container.bind<GeoJSONLayerCacheFactory>("GeoJSONLayerCacheFactory").to(GeoJSONLayerCacheFactory);
    };

    register(registry: IViewModelRegistry, serviceLocator?: IServiceLocator, overrides?: any): void {
    }

}

type GenericLayerView = ILayerView<any, any>;

export default MapModule
