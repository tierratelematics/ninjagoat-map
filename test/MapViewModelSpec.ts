import "reflect-metadata";
import expect = require("expect.js");
import MapViewModel from "../scripts/MapViewModel";
import TestMapViewModel from "./fixtures/TestMapViewModel";

describe("Given a map viewmodel", () => {
    let subject: MapViewModel<void>;

    beforeEach(() => {
        subject = new TestMapViewModel();
    });

    context("on startup", () => {
        it("should expose the list of layers", () => {
            expect(subject.layers[0].type).to.be("GeoJSON");
        });
    });
});