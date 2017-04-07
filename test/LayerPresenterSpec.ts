import "reflect-metadata";
import expect = require("expect.js");
import {IMock, Mock, Times, It} from "typemoq";
import ILayerPresenter from "../scripts/interfaces/ILayerPresenter";
import LayerPresenter from "../scripts/LayerPresenter";
import ILayerView from "../scripts/interfaces/ILayerView";
import {Subject} from "rx";

describe("Given a layer presenter", () => {

    let subject: ILayerPresenter;
    let geojsonView: IMock<ILayerView<any, any>>;
    let data: Subject<any>;

    beforeEach(() => {
        data = new Subject<any>();
        geojsonView = Mock.ofType<ILayerView<any, any>>();
        subject = new LayerPresenter({"GeoJSON": geojsonView.object});
    });

    context("when a layer is shown for the first time", () => {
        it("should be created", () => {
            subject.present(context => data, "GeoJSON");
            data.onNext({markers: []});

            geojsonView.verify(g => g.create(It.isValue({markers: []}), null), Times.once());
        });
    });

    context("when the data gets an update", () => {
        it("the layer itself should be updated", () => {
            subject.present(context => data, "GeoJSON");
            data.onNext({markers: []});
            data.onNext({markers: [{id: "8283"}]});

            geojsonView.verify(g => g.update(It.isValue({markers: []}), It.isValue({markers: [{id: "8283"}]}), null), Times.once());
        });
    });

    context("when a layer type is not registered", () => {
        it("should throw an error", () => {
            expect(() => subject.present(context => data, <any>"InexistentType")).to.throwError();
        });
    });

    context("when the layer to be shown is of type editor", () => {
        it("should return the layer changes");
    });

    context("when the bounding box changes", () => {
        it("should reload the source with the new bounding box");
    });
});