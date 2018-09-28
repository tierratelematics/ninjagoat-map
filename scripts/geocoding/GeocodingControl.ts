import { LayersControl, LayersControlProps } from "react-leaflet";
import {GeoSearchControl} from "leaflet-geosearch";
import {merge} from "lodash";
import {lazyInject} from "ninjagoat";
import IGeocodingProvider from "./IGeocodingProvider";
import {Icon} from "leaflet";
import { IGeocodingProviderResult } from "./IGeocodingProviderResult";

export type GeocodingControlProps = LayersControlProps & {
    position: string;
    style?: "bar" | "button",
    showMarker?: boolean,
    marker?: {
        icon: Icon,
        draggable?: boolean,
    },
    searchLabel?: string,
    autoComplete?: boolean,
    autoCompleteDelay?: number,
    maxMarkers?: number,
    retainZoomLevel?: boolean,
    animateZoom?: boolean,
    autoClose?: boolean,
    keepResult?: boolean,
    popupFormat?: (context: GecondingControlContext) => string
};

export type GecondingControlContext = {
    query: string,
    result: IGeocodingProviderResult
}

export class GeocodingControl extends LayersControl<GeocodingControlProps, any> {

    @lazyInject("IGeocodingProvider")
    private geocodingProvider: IGeocodingProvider;

    createLeafletElement(props: GeocodingControlProps): Object {
        return new GeoSearchControl(merge({}, {provider: this.geocodingProvider}, props));
    }
}
