import { Layer } from "leaflet";
import { PopupContext } from "../geojson/GeoJSONProps";

export interface IPopupRenderer {
    renderOn(layer: Layer, context: PopupContext): void;
}