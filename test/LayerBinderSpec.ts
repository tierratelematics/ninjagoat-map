import "reflect-metadata";
require("jsdom-global")();
import expect = require("expect.js");
import {IMock, Mock, Times, It} from "typemoq";
import ILayerBinder from "../scripts/layer/ILayerBinder";
import LayerBinder from "../scripts/LayerBinder";
import ILayerView from "../scripts/layer/ILayerView";
import {ReplaySubject, Subject, Observable} from "rx";
import IMapView from "../scripts/interfaces/IMapView";
import {LatLng, LatLngBounds} from "leaflet";
import MockLayerView from "./fixtures/MockLayerView";
import ILayerManager from "../scripts/interfaces/ILayerManager";

describe("Given a layer binder", () => {

    let subject: ILayerBinder;
    let layerView: IMock<ILayerView<any, any>>;
    let data: ReplaySubject<any>;
    let mapView: IMock<IMapView>;
    let viewChanges: Subject<void>;
    let layerManager: IMock<ILayerManager>;

    beforeEach(() => {
        viewChanges = new Subject<void>();
        mapView = Mock.ofType<IMapView>();
        mapView.setup(m => m.changes()).returns(() => viewChanges);
        data = new ReplaySubject<any>();
        layerView = Mock.ofType<ILayerView<any, any>>(MockLayerView);
        layerManager = Mock.ofType<ILayerManager>();
        subject = new LayerBinder([layerView.object], mapView.object, layerManager.object);
    });

    context("when a layer type is not registered", () => {
        it("should throw an error", () => {
            expect(() => subject.bind(context => data, <any>"InexistentType", null)).to.throwError();
        });
    });

    context("when a layer is shown for the first time", () => {
        beforeEach(() => {
            data.onNext({markers: []});
        });
        it("should be created", () => {
            subject.bind(context => data, "GeoJSON", null);

            layerView.verify(g => g.create(It.isValue({markers: []}), null), Times.once());
            layerManager.verify(l => l.add(It.isAny()), Times.once());
        });
        context("and custom options are passed", () => {
            it("should be used on the view", () => {
                subject.bind(context => data, "GeoJSON", {popup: false});

                layerView.verify(g => g.create(It.isValue({markers: []}), It.isValue({popup: false})), Times.once());
            });
        });
    });

    context("when the data gets an update", () => {
        beforeEach(() => {
            data.onNext({markers: []});
            data.onNext({markers: [{id: "8283"}]});
        });
        it("the layer itself should be updated", () => {
            subject.bind(context => data, "GeoJSON", null);

            layerView.verify(g => g.update(It.isValue({markers: []}), It.isValue({markers: [{id: "8283"}]}), It.isAny(), null), Times.once());
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
            subject.bind(context => {
                if (!context.bounds) return data;
                return Observable.just(context);
            }, "GeoJSON", null);
            mapView.setup(m => m.getBounds()).returns(() => new LatLngBounds(new LatLng(50, 50), new LatLng(60, 80)));
            mapView.setup(m => m.getZoom()).returns(() => 12);
            viewChanges.onNext(null);

            layerView.verify(g => g.update(It.isAny(), It.isValue({
                bounds: new LatLngBounds(new LatLng(50, 50), new LatLng(60, 80)),
                zoom: 12
            }), It.isAny(), null), Times.once());
        });
    });
});