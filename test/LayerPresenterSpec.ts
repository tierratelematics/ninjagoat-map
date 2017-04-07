require("jsdom-global")();
import "reflect-metadata";
import expect = require("expect.js");
import {IMock, Mock, Times, It} from "typemoq";
import ILayerPresenter from "../scripts/interfaces/ILayerPresenter";
import LayerPresenter from "../scripts/LayerPresenter";
import ILayerView from "../scripts/interfaces/ILayerView";
import {ReplaySubject, Subject, Observable} from "rx";
import IMapView from "../scripts/interfaces/IMapView";
import {LatLng, LatLngBounds} from "leaflet";

describe("Given a layer presenter", () => {

    let subject: ILayerPresenter;
    let geojsonView: IMock<ILayerView<any, any>>;
    let data: ReplaySubject<any>;
    let mapView: IMock<IMapView>;
    let viewChanges: Subject<void>;

    beforeEach(() => {
        viewChanges = new Subject<void>();
        mapView = Mock.ofType<IMapView>();
        mapView.setup(m => m.changes()).returns(() => viewChanges);
        data = new ReplaySubject<any>();
        geojsonView = Mock.ofType<ILayerView<any, any>>();
        subject = new LayerPresenter({"GeoJSON": geojsonView.object});
    });

    context("when a layer is shown for the first time", () => {
        beforeEach(() => {
            data.onNext({markers: []});
        });
        it("should be created", () => {
            subject.present(context => data, "GeoJSON");

            geojsonView.verify(g => g.create(It.isValue({markers: []}), null), Times.once());
        });
    });

    context("when the data gets an update", () => {
        beforeEach(() => {
            data.onNext({markers: []});
            data.onNext({markers: [{id: "8283"}]});
        });
        it("the layer itself should be updated", () => {
            subject.present(context => data, "GeoJSON");

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
        beforeEach(() => {
            data.onNext({markers: []});
            data.onNext({markers: [{id: "8283"}]});
        });
        it("should reload the source with the new bounding box", () => {
            subject.present(context => {
                if (!context.bounds) return data;
                return Observable.just(context);
            }, "GeoJSON");
            mapView.setup(m => m.getBounds()).returns(() => new LatLngBounds(new LatLng(50, 50), new LatLng(60, 80)));
            mapView.setup(m => m.getZoom()).returns(() => 12);
            viewChanges.onNext(null);

            geojsonView.verify(g => g.update(It.isAny(), It.isValue({
                bounds: new LatLngBounds(new LatLng(50, 50), new LatLng(60, 80)),
                zoom: 12
            }), null), Times.once());
        });
    });
});