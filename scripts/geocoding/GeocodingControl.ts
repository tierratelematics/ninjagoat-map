import MapControl from "../leaflet/MapControl";
import {GeoSearchControl} from "leaflet-geosearch";
import {merge} from "lodash";
import {lazyInject} from "ninjagoat";
import IGeocodingProvider from "./IGeocodingProvider";

export type GeocodingControlProps = any;

export class GeocodingControl extends MapControl<GeocodingControlProps> {

    @lazyInject("IGeocodingProvider")
    private geocodingProvider: IGeocodingProvider;

    createLeafletElement(props: GeocodingControlProps): Object {
        return new GeoSearchControl(merge({}, {provider: this.geocodingProvider}, props));
    }
}
