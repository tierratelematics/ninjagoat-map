import { IPopupRenderer } from "./IPopupRenderer";
import { Layer, Popup } from "leaflet";
import { render } from "react-dom";
import { PopupContext } from "../geojson/GeoJSONProps";
import { get, isMatch } from "lodash";
import { injectable } from "inversify";


@injectable()
export class PopupRenderer implements IPopupRenderer {

    renderOn(layer: Layer, context: PopupContext): HTMLElement {
        const shouldDisplayPopup = get(context, 'displayOptions.when', () => true);
        if(!shouldDisplayPopup()) {
            return;
        }

        const host = this.stringifyTemplate(context.content);
        const popup: Popup = layer.getPopup();

        if(!popup || !isMatch(popup.options, context.options)){
            layer.unbindPopup();
            layer.bindPopup(host, context.options);
        } else {
            layer.setPopupContent(host);
        }

        if(!layer.isPopupOpen()){
            layer.openPopup();
        }

        return host;
    }

    private stringifyTemplate = (template: JSX.Element) => {
        let host = document.createElement("div");
        render(template, host);
        return host;
    }
}
