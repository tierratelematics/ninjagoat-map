import * as React from "react";
import {ClusterProps, GeoJSONFeature} from "./GeoJSONProps";
import GeoJSONLayer from "./GeoJSONLayer";
import {LatLng, divIcon, BaseIcon, marker, point} from "leaflet";
import {lazyInject} from "ninjagoat";
import IMapBoundaries from "../leaflet/IMapBoundaries";

class ClusterGeoJSONLayer extends React.Component<ClusterProps, void> {

    @lazyInject("IMapBoundaries")
    private mapBoundaries: IMapBoundaries;

    render() {
        let BaseGeoJSONLayer = GeoJSONLayer as any; // Cast since in @types/react-leaflet FeatureGroup is not a react class
        return <BaseGeoJSONLayer
            {...this.props}
            pointToLayer={(feature: GeoJSON.Feature<GeoJSON.Point>, latlng: LatLng) => {
                if (!this.props.isCluster(feature)) {
                    return marker(latlng, this.props.icon ? {icon: this.props.icon(feature)} : undefined);
                }
                return marker(latlng, this.props.clusterIcon ? {icon: this.props.clusterIcon(feature)} :
                    {icon: this.getDefaultClusterIcon(feature)});
            }}
            featureId={(feature: GeoJSONFeature) => {
                let featureId = this.props.featureId(feature);
                if (this.props.isCluster(feature))
                    featureId = "__cluster__:" + featureId; // Assign an unique identifier to a cluster
                return featureId;
            }}
            onMarkerClick={(feature: GeoJSON.Feature<GeoJSON.Point>) => {
                if (this.props.isCluster(feature)) {
                    let [lng, lat] = feature.geometry.coordinates;
                    this.mapBoundaries.setCenter(new LatLng(lat, lng), this.mapBoundaries.getZoom() + 1);
                } else if (this.props.onMarkerClick) {
                    this.props.onMarkerClick(feature);
                }
            }}
        />;
    }

    private getDefaultClusterIcon(feature: GeoJSONFeature): BaseIcon {
        let props = (feature.properties as any),
            size = props.point_count < 100 ? "small" : props.point_count < 1000 ? "medium" : "large";
        return divIcon({
            html: `<div><span>${props.point_count_abbreviated}</span></div>`,
            className: "marker-cluster marker-cluster-" + size,
            iconSize: point(40, 40)
        });
    }
}

export default ClusterGeoJSONLayer
