import "reflect-metadata";
import expect = require("expect.js");
import IMapHolder from "../scripts/interfaces/IMapHolder";
import MapHolder from "../scripts/leaflet/MapHolder";
import {Map} from "leaflet";

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