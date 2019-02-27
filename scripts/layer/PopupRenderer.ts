import { IPopupRenderer } from "./IPopupRenderer";
import { Layer, Popup } from "leaflet";
import { render } from "react-dom";
import { PopupContext } from "../geojson/GeoJSONProps";
import { get, isMatch } from "lodash";
import { injectable } from "inversify";
@injectable()
export class PopupRenderer implements IPopupRenderer {
    renderOn(layer: Layer, context: PopupContext): void {
        const shouldDisplayPopup = get(context, 'displayOptions.when', () => true);
        if(!shouldDisplayPopup()) {
            return;
        }

        const popup: Popup = layer.getPopup();
        if(!popup || !isMatch(popup.options, context.options)){
            layer.unbindPopup();
            layer.bindPopup(this.stringifyTemplate(context.content), context.options);
        } else {
            layer.setPopupContent(this.stringifyTemplate(context.content));
        }

        if(!layer.isPopupOpen()){
            layer.openPopup();
        }
    }

    private stringifyTemplate = (template: JSX.Element) => {
        if (!template) return;
        let host = document.createElement("div");
        render(template, host);
        return host;
    }
}