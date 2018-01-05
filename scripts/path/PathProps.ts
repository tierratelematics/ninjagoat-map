import { GeoJSONOptions, BaseIcon, PolylineOptions } from "leaflet";
import { ObservableLayerProps } from "../layer/ObservableLayer";
import { GeoJSONCollection } from "../geojson/GeoJSONProps";

export type PathProps = ObservableLayerProps<GeoJSONCollection> & PolylineOptions;
