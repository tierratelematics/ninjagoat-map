import {GeoJSONOptions, Icon} from "leaflet";
import {MapObservableFactory} from "../layer/MapContext";

type SupportedGeometries = GeoJSON.Point | GeoJSON.Polygon | GeoJSON.MultiPolygon;

export type GeoJSONCollection = GeoJSON.FeatureCollection<SupportedGeometries>;

export type GeoJSONFeature = GeoJSON.Feature<SupportedGeometries>;

export type GeoJSONProps = GeoJSONOptions & {
    observable: MapObservableFactory<GeoJSONCollection>,
    icon?: Icon,
    onMarkerClick?: (feature: GeoJSONFeature) => void
};