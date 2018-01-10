import { LayersControl, LayersControlProps } from "react-leaflet";
import {GeoSearchControl} from "leaflet-geosearch";
import {merge} from "lodash";
import {lazyInject} from "ninjagoat";
import IGeocodingProvider from "./IGeocodingProvider";
import {Icon} from "leaflet";

export type GeocodingControlProps = LayersControlProps & {
    position: string;
    style?: "bar" | "button",
    showMarker?: boolean,
    marker?: {
        icon: Icon,
        draggable?: boolean,
    },
    searchLabel?: string
};

export class GeocodingControl extends LayersControl<GeocodingControlProps, any> {

    @lazyInject("IGeocodingProvider")
    private geocodingProvider: IGeocodingProvider;

    createLeafletElement(props: GeocodingControlProps): Object {
        return new GeoSearchControl(merge({}, {provider: this.geocodingProvider}, props));
    }
}
