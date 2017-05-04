import "reflect-metadata";
import expect = require("expect.js");
import IShapeTransformer from "../scripts/draw/IShapeTransformer";
import ShapeTransformer from "../scripts/draw/ShapeTransformer";
import {GeoJSONFeature} from "../scripts/geojson/GeoJSONProps";

describe("Given a shape transformer", () => {

    let subject: IShapeTransformer;

    beforeEach(() => {
        subject = new ShapeTransformer();
    });

    context("when a circle is supplied", () => {
        it("should be approximated into a polygon", () => {
            let shape = subject.transform({
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [45, 45]
                },
                "properties": <any>{"radius": 20}
            });

            expect(shape.geometry.type).to.be("Polygon");
            expect(shape.geometry.coordinates[0][0]).to.have.length(32);
            expect((<any>shape.properties).radius).to.be(undefined);
        });
    });

    context("when another shape is supplied", () => {
        it("should be left untouched", () => {
            let originalShape: GeoJSONFeature = {
                "type": "Feature",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[[45, 45], [30, 30], [10, 10]]]
                },
                "properties": {}
            };
            let resultingShape = subject.transform(originalShape);

            expect(resultingShape).to.be(originalShape);
        });
    });
});