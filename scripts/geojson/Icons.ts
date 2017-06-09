import {BaseIcon, divIcon, point} from "leaflet";
import {GeoJSONFeature} from "./GeoJSONProps";

export function defaultClusterIcon(feature: GeoJSONFeature): BaseIcon {
    let props = (feature.properties as any),
        size = props.point_count < 100 ? "small" : props.point_count < 1000 ? "medium" : "large";
    return divIcon({
        html: `<div><span>${props.point_count}</span></div>`,
        className: "marker-cluster marker-cluster-" + size,
        iconSize: point(44, 44)
    });
}