import "reflect-metadata";
require("jsdom-global")();
import expect = require("expect.js");
import {IMock, Mock, Times, It} from "typemoq";
import {ReplaySubject, Subject, Observable} from "rx";
import {LatLng, LatLngBounds} from "leaflet";
import IMapBoundaries from "../scripts/leaflet/IMapBoundaries";
import ILayerView from "../scripts/layer/ILayerView";
import LayerBinder from "../scripts/layer/LayerBinder";
import ILayerBinder from "../scripts/layer/ILayerBinder";
import { ILayerFactory } from "../scripts/layer/ILayerFactory";

describe("Given a layer binder", () => {

    let subject: ILayerBinder;
    let layerView: IMock<ILayerView<any, any>>;
    let data: ReplaySubject<any>;
    let mapBoundaries: IMock<IMapBoundaries>;
    let layerViewFactory: IMock<ILayerFactory>;
    let viewChanges: Subject<void>;

    beforeEach(() => {
        viewChanges = new Subject<void>();
        mapBoundaries = Mock.ofType<IMapBoundaries>();
        mapBoundaries.setup(m => m.boundsChanges()).returns(() => viewChanges);
        
        layerView = Mock.ofType<ILayerView<any, any>>();

        layerViewFactory = Mock.ofType<ILayerFactory>();
        layerViewFactory.setup(l => l.create("GeoJSON", It.isAny())).returns(() => [null, layerView.object]);

        data = new ReplaySubject<any>();
        subject = new LayerBinder(layerViewFactory.object, mapBoundaries.object);
    });

    context("when a layer is shown for the first time", () => {
        it("should be just created", () => {
            subject.bind(context => data, "GeoJSON", {popup: false});
            layerViewFactory.verify(l => l.create("GeoJSON", It.isValue({popup: false})), Times.once());
        });
    });

    context("when the data gets an update", () => {
        beforeEach(() => {
            data.onNext({markers: []});
            data.onNext({markers: [{id: "8283"}]});
        });
        it("the layer itself should be updated", () => {
            subject.bind(context => data, "GeoJSON", null)[1].subscribe();

            layerView.verify(g => g.update(It.isValue({markers: []}), It.isValue({markers: [{id: "8283"}]})), Times.once());
        });
    });

    context("when the bounding box changes", () => {
        beforeEach(() => {
            data.onNext({markers: []});
            data.onNext({markers: [{id: "8283"}]});
        });
        context("when those changes are enabled", () => {
            it("should reload the source with the new bounding box", () => {
                subject.bind(context => {
                    if (!context.bounds) return data;
                    return Observable.just(context);
                }, "GeoJSON", null)[1].subscribe();
                mapBoundaries.setup(m => m.getBounds()).returns(() => new LatLngBounds(new LatLng(50, 50), new LatLng(60, 80)));
                mapBoundaries.setup(m => m.getZoom()).returns(() => 12);
                viewChanges.onNext(null);

                layerView.verify(g => g.update(It.isAny(), It.isValue({
                    bounds: new LatLngBounds(new LatLng(50, 50), new LatLng(60, 80)),
                    zoom: 12
                })), Times.once());
            });
        });
        context("when those changes are disabled", () => {
            it("should not trigger an update", () => {
                subject.bind(context => data, "GeoJSON", {
                    freezeBounds: true
                })[1].subscribe();
                viewChanges.onNext(null);

                layerView.verify(g => g.update(It.isAny(), It.isAny()), Times.exactly(2));
            });
        });
    });
});