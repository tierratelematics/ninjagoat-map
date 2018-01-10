import * as React from "react";
import {ClusterProps, GeoJSONFeature} from "./GeoJSONProps";
import GeoJSONLayer from "./GeoJSONLayer";
import {LatLng, marker} from "leaflet";
import {lazyInject} from "ninjagoat";
import IMapBoundaries from "../leaflet/IMapBoundaries";
import {defaultClusterIcon} from "./Icons";

class ClusterGeoJSONLayer extends React.Component<ClusterProps, any> {

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
                    {icon: defaultClusterIcon(feature)});
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
                    this.mapBoundaries.setCenter(new LatLng(lat, lng), this.mapBoundaries.getZoom() + 2);
                } else if (this.props.onMarkerClick) {
                    this.props.onMarkerClick(feature);
                }
            }}
        />;
    }
}

export default ClusterGeoJSONLayer
