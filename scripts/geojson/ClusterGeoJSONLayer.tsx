import * as React from "react";
import {ClusterProps, GeoJSONFeature} from "./GeoJSONProps";
import GeoJSONLayer from "./GeoJSONLayer";
import {LatLng} from "leaflet";

class ClusterGeoJSONLayer extends React.Component<ClusterProps, void> {

    render() {
        let BaseGeoJSONLayer = GeoJSONLayer as any; // Cast since in @types/react-leaflet FeatureGroup is not a react class
        return <BaseGeoJSONLayer {...this.props}
                                 pointToLayer={(featurePoint: GeoJSON.Feature<GeoJSON.Point>, latlng: LatLng) => {
                                     
                                 }}
                                 featureId={(feature: GeoJSONFeature) => {
                                     let featureId = this.props.featureId(feature);
                                     if (this.props.isCluster(feature))
                                         featureId = "__cluster__:" + featureId; // Assign an unique identifier to a cluster
                                     return featureId;
                                 }}
        />;
    }
}

export default ClusterGeoJSONLayer
