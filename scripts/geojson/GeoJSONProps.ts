import { GeoJSONOptions } from "leaflet";
import { MapObservableFactory } from "../layer/MapContext";

type SupportedGeometries = GeoJSON.Point | GeoJSON.Polygon | GeoJSON.MultiPolygon;

export type GeoJSONCollection = GeoJSON.FeatureCollection<SupportedGeometries>;

export type GeoJSONFeature = GeoJSON.Feature<SupportedGeometries>;

export type GeoJSONProps = GeoJSONOptions & {
    observable: MapObservableFactory<GeoJSONCollection>,
    onMarkerClick?: (feature: GeoJSONFeature) => void,
    popup?: (feature: GeoJSONFeature) => JSX.Element,
    featureId: (feature: GeoJSONFeature) => string
};

export type ClusterProps = GeoJSONProps & {
    isCluster: (feature: GeoJSONFeature) => boolean;
};
