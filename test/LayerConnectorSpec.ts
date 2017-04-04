import "reflect-metadata";
import expect = require("expect.js");

describe("Given a layer connector", () => {
    context("when a layer is shown for the first time", () => {
        it("should be created");
    });

    context("when the data gets an update", () => {
        it("the layer itself should be updated");
    });

    context("when a layer type is not registered", () => {
        it("should throw an error");
    });

    context("when the layer to be shown is of type editor", () => {
        it("should return the layer changes");
    });

    context("when the bounding box is changed", () => {
        it("should reload the source with the new bounding box");
    });

    context("when the zoom level is changed", () => {
        it("should reload the sourc with the new zoom");
    });
});