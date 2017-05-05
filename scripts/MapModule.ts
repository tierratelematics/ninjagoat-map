import {IModule, IViewModelRegistry, IServiceLocator, Dictionary} from "ninjagoat";
import {interfaces} from "inversify";
import ILayerBinder from "./layer/ILayerBinder";
import LayerBinder from "./layer/LayerBinder";
import ILayerView from "./layer/ILayerView";
import GeoJSONLayerView from "./geojson/GeoJSONLayerView";
import IMapBoundaries from "./leaflet/IMapBoundaries";
import IMapHolder from "./leaflet/IMapHolder";
import MapHolder from "./leaflet/MapHolder";
import MapBoundaries from "./leaflet/MapBoundaries";
import {GeoJSONCollection, GeoJSONProps} from "./geojson/GeoJSONProps";
import FeatureLayerView from "./draw/DrawingLayerView";
import IShapeTransformer from "./draw/IShapeTransformer";
import ShapeTransformer from "./draw/ShapeTransformer";
import IGeocodingProvider from "./geocoding/IGeocodingProvider";
import {OpenStreetMapProvider} from 'leaflet-geosearch';
import GoogleGeocodingProvider from "./geocoding/GoogleGeocodingProvider";

class MapModule implements IModule {

    modules = (container: interfaces.Container) => {
        container.bind<IMapHolder>("IMapHolder").to(MapHolder).inSingletonScope();
        container.bind<IMapBoundaries>("IMapBoundaries").to(MapBoundaries).inSingletonScope();
        container.bind<ILayerBinder>("ILayerBinder").to(LayerBinder).inSingletonScope();
        container.bind<ILayerView<GeoJSONCollection, GeoJSONProps>>("ILayerView").to(GeoJSONLayerView).inSingletonScope();
        container.bind<ILayerView<GeoJSONCollection, GeoJSONProps>>("ILayerView").to(FeatureLayerView).inSingletonScope();
        container.bind<IShapeTransformer>("IShapeTransformer").to(ShapeTransformer).inSingletonScope();
        container.bind<IGeocodingProvider>("IGeocodingProvider").to(GoogleGeocodingProvider).inSingletonScope();
    };

    register(registry: IViewModelRegistry, serviceLocator?: IServiceLocator, overrides?: any): void {
    }

}

export default MapModule