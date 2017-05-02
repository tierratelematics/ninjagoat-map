import {GeoJSONOptions} from "leaflet";
import {MapObservableFactory} from "../layer/MapContext";

export type GeoJSONCollection = GeoJSON.FeatureCollection<GeoJSONCollection.GeometryObject>;

export type GeoJSONProps = GeoJSONOptions & {observable: MapObservableFactory<GeoJSONCollection>};