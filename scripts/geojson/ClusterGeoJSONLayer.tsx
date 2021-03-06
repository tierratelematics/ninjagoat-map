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
                    const markerOptions = {
                        ...this.props.markerOptions?.(feature),
                        icon: this.props.icon?.(feature)
                    };
                    return marker(latlng, markerOptions);
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
                    let defaultZoomTo = () => this.mapBoundaries.getZoom() + 2;
                    let zoomTo = this.props.zoomTo || defaultZoomTo;
                    let [lng, lat] = feature.geometry.coordinates;
                    this.mapBoundaries.setCenter(new LatLng(lat, lng), zoomTo(feature));
                } else if (this.props.onMarkerClick) {
                    this.props.onMarkerClick(feature);
                }
            }}
        />;
    }
}

export default ClusterGeoJSONLayer
