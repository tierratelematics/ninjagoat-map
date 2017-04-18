import "reflect-metadata";
import expect = require("expect.js");
import MapViewModel from "../scripts/MapViewModel";
import TestMapViewModel from "./fixtures/TestMapViewModel";
import {IMock, Mock, Times, It} from "typemoq";
import ILayerPresenter from "../scripts/interfaces/ILayerPresenter";
import MissingMapViewModel from "./fixtures/MissingMapViewModel";

describe("Given a map viewmodel", () => {
    let subject: MapViewModel<void>;
    let layerPresenter: IMock<ILayerPresenter>;

    beforeEach(() => {
        layerPresenter = Mock.ofType<ILayerPresenter>();
        subject = new TestMapViewModel(layerPresenter.object);
    });

    context("when asked to show the map's layers", () => {
        beforeEach(() => subject.setLayers([
            {
                type: "GeoJSON",
                name: "foo"
            }, {
                type: "GeoJSON",
                name: "bar"
            }
        ]));
        context("and all the sources are registered", () => {
            it("should present the layers", () => {
                let sources = subject.defineSources();
                subject.present();

                layerPresenter.verify(l => l.present(sources["foo"], "GeoJSON"), Times.once());
                layerPresenter.verify(l => l.present(sources["bar"], "GeoJSON"), Times.once());
            });
        });
        context("and some sources are missing", () => {
            it("should throw an error", () => {
                let subject = new MissingMapViewModel(layerPresenter.object);

                expect(() => subject.present()).to.throwError();
            });
        });
    });
});
