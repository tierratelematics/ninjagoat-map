import { IPopupRenderer } from "./IPopupRenderer";
import { Layer } from "leaflet";
import { render } from "react-dom";
import { PopupContext } from "../geojson/GeoJSONProps";
import { get } from "lodash";

export class PopupRenderer implements IPopupRenderer {
    renderOn(layer: Layer, context: PopupContext): void {
        const shouldDisplayPopup = get(context, 'displayOptions.when', () => true);
        if(!shouldDisplayPopup()) {
            return;
        }

        if (!layer.getPopup()) {
            layer.bindPopup(this.stringifyTemplate(context.content), context.options);
        } else {
            layer.setPopupContent(this.stringifyTemplate(context.content));
        }
        
        layer.openPopup();
    }

    private stringifyTemplate = (template: JSX.Element) => {
        if (!template) return;
        let host = document.createElement("div");
        render(template, host);
        return host;
    }
}