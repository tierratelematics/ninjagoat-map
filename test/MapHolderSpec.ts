import "reflect-metadata";
import expect = require("expect.js");
import {Map} from "leaflet";
import IMapHolder from "../scripts/leaflet/IMapHolder";
import MapHolder from "../scripts/leaflet/MapHolder";

describe("Given a map holder", () => {

    let subject: IMapHolder;

    beforeEach(() => {
        subject = new MapHolder();
    });

    context("after a map has been set", () => {
        let map = <Map>{};
        beforeEach(() => subject.setMap(map));
        it("should be retrieved", () => {
            expect(subject.obtainMap()).to.be(map);
        });
    });
});