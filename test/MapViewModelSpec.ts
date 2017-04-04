import "reflect-metadata";
import expect = require("expect.js");
import MapViewModel from "../scripts/MapViewModel";
import {LayerEntry} from "../scripts/LayerRegistration";
import {Observable} from "rx";

describe("Given a map viewmodel", () => {
    let subject: MapViewModel;
    let layers = [<LayerEntry<any>>{
        type: "GeoJSON",
        observable: (context) => Observable.empty()
    }];

    beforeEach(() => {
        subject = new MapViewModel(layers);
    });

    context("on startup", () => {
        it("should expose the list of layers", () => {
            expect(subject.layers).to.be(layers);
        });
    });
});