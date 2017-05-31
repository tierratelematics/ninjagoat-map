import { GeoJSONOptions, Icon } from "leaflet";
import { MapObservableFactory } from "../layer/MapContext";

type SupportedGeometries = GeoJSON.Point | GeoJSON.Polygon | GeoJSON.MultiPolygon;

export type GeoJSONCollection = GeoJSON.FeatureCollection<SupportedGeometries>;

export type GeoJSONFeature = GeoJSON.Feature<SupportedGeometries>;

export type GeoJSONProps = GeoJSONOptions & {
    observable: MapObservableFactory<GeoJSONCollection>,
    icon?: (feature: GeoJSONFeature) => Icon,
    onMarkerClick?: (feature: GeoJSONFeature) => void,
    getPopupContent?: (feature: GeoJSONFeature) => JSX.Element,
    isPopupOpen?: (feature: GeoJSONFeature) => boolean,
    getFeatureId?: (feature: GeoJSONFeature) => string,
}