import { GeoJSONOptions, BaseIcon } from "leaflet";;
import { ObservableLayerProps } from "../layer/ObservableLayer";

export type SupportedGeometries = GeoJSON.Point | GeoJSON.Polygon | GeoJSON.MultiPolygon;

export type GeoJSONCollection = GeoJSON.FeatureCollection<SupportedGeometries>;

export type GeoJSONFeature = GeoJSON.Feature<SupportedGeometries>;

export type GeoJSONProps = ObservableLayerProps<GeoJSONCollection> & GeoJSONOptions & {
    icon?: (feature: GeoJSONFeature) => BaseIcon,
    onMarkerClick?: (feature: GeoJSONFeature) => void,
    popup?: (feature: GeoJSONFeature) => JSX.Element,
    featureId: (feature: GeoJSONFeature) => string
};

export type ClusterProps = GeoJSONProps & {
    isCluster: (feature: GeoJSONFeature) => boolean;
    clusterIcon?: (feature: GeoJSONFeature) => BaseIcon,
};
