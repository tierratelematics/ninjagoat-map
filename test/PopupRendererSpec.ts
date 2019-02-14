import "reflect-metadata";
import { Layer, Popup } from "leaflet";
import { IMock, It, Mock, Times } from "typemoq";
import { PopupContext } from "../scripts/geojson/GeoJSONProps";
import { IPopupRenderer } from "../scripts/layer/IPopupRenderer";
import { PopupRenderer } from "../scripts/layer/PopupRenderer";

describe("Given a Popup Layer", () => {
    let subject: IPopupRenderer,
        layer: IMock<Layer>,
        popup: IMock<Popup>,
        popupContext: PopupContext;

    beforeEach(() => {
        layer = Mock.ofType<Layer>();
        popup = Mock.ofType<Popup>();
        subject = new PopupRenderer();
    });

    context("When the popup should NOT be displayed", () => {
        beforeEach(() => {
            popupContext = {
                content: null,
                displayOptions: {
                    when: () => false
                },
            };

            subject.renderOn(layer.object, popupContext);
            layer.setup(l => l.getPopup()).returns(() => null);
        });

        it("should not bind the popup", () => {
            layer.verify(l => l.bindPopup(It.isAny()), Times.never());
        });
    });

    context("When the popup should be displayed", () => {
        beforeEach(() => {
            popupContext = {
                content: null,
                options: {
                    maxHeight: 200,
                    maxWidth: 200
                }
            };
        });

        context("and the layer has NOT a popup already binded", () => {
            beforeEach(() => {
                layer.setup(l => l.getPopup()).returns(() => null);
                subject.renderOn(layer.object, popupContext);
            });

            it("should bind it", () => {
                layer.verify(l => l.bindPopup(It.isAny(), It.isValue(popupContext.options)), Times.once());
            });

            it("should open it", () => {
                layer.verify(l => l.openPopup(), Times.once());
            });
        });

        context("and the layer has a poup already binded", () => {
            beforeEach(() => {
                layer.setup(l => l.getPopup()).returns(() => popup.object);
                subject.renderOn(layer.object, popupContext);
            });

            it("should update the content", () => {
                layer.verify(l => l.setPopupContent(It.isAny()), Times.once());
                layer.verify(l => l.bindPopup(It.isAny(), It.isAny()), Times.never());
            });
            
            it("should open it", () => {
                layer.verify(l => l.openPopup(), Times.once());
            });
        });
    })
});