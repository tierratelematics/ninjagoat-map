import {GeoJSONOptions, Icon, Layer, Content, TooltipOptions, Tooltip, PopupOptions, MarkerOptions} from "leaflet";;
import { ObservableLayerProps } from "../layer/ObservableLayer";
import { Observable } from "rx";

export type SupportedGeometries = GeoJSON.Point | GeoJSON.Polygon | GeoJSON.MultiPolygon | GeoJSON.LineString;

export type GeoJSONCollection<P = GeoJSON.GeoJsonProperties> = GeoJSON.FeatureCollection<SupportedGeometries, P>;

export type GeoJSONFeature = GeoJSON.Feature<SupportedGeometries>;

export type GeoJSONProps = ObservableLayerProps<GeoJSONCollection> & GeoJSONOptions & {
    icon?: (feature: GeoJSONFeature) => Icon<any>;
    onMarkerClick?: (feature: GeoJSONFeature) => void;
    popup?: (feature: GeoJSONFeature) => Observable<PopupContext>;
    featureId?: (feature: GeoJSONFeature) => string;
    markerOptions?: (feature: GeoJSONFeature) => Omit<MarkerOptions, 'icon'>;
};

export type ClusterProps = GeoJSONProps & {
    isCluster: (feature: GeoJSONFeature) => boolean;
    clusterIcon?: (feature: GeoJSONFeature) => Icon<any>;
    zoomTo?: (feature: GeoJSONFeature) => number;
    bindTooltip?: (feature: GeoJSONFeature) => TooltipDetail;
    popupClose?: (feature: GeoJSONFeature, Layer: Layer) => void;
    onPopupRendered?: (element: HTMLElement) => void;
};

export type TooltipDetail = {
    content: Tooltip | Content,
    options?: TooltipOptions
};

export type PopupContext = {
    content?: JSX.Element,
    options?: PopupOptions,
    displayOptions?: DisplayPopupOptions,
}

export type DisplayPopupOptions = {
    anchorTo?: GeoJSONFeature;
    when?: () => boolean
}
