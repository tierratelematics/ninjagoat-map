import {GeoJSONOptions} from "leaflet";
import {MapObservableFactory} from "../layer/LayerRegistration";

export type GeoJSON = GeoJSON.FeatureCollection<GeoJSON.GeometryObject>;

export type GeoJSONProps = GeoJSONOptions & {observable: MapObservableFactory<GeoJSON>};