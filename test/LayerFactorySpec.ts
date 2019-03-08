import "reflect-metadata";
import { Factory, ILayerFactory } from "../scripts/layer/ILayerFactory";
import ILayerView from "../scripts/layer/ILayerView";
import { IMock, Mock, It, Times } from "typemoq";
import { LayerFactory } from "../scripts/layer/LayerFactory";
import expect = require("expect.js");

describe("Given a LayerFactory", () => {
    let layerViewFactory: IMock<Factory<ILayerView<any, any>>>,
        layerView: IMock<ILayerView<any, any>>,
        subject: ILayerFactory;

    beforeEach(() => {
        layerView = Mock.ofType<ILayerView<any, any>>();

        layerViewFactory = Mock.ofType<Factory<ILayerView<any, any>>>();
        layerViewFactory.setup(m => m()).returns(() => layerView.object);

        subject = new LayerFactory(layerViewFactory.object, layerViewFactory.object, layerViewFactory.object);
    });

    context("When creating a layer for a unmanaged type", () => {
        it("should erase a error", () => {
            expect(() => subject.create("notExpectedType", {})).to.throwError();
        });
    });

    context("When creating a layer for a managed type", () => {
        beforeEach(() => {
            subject.create("Drawing", { optionA: "" });
        });

        it("should create it", () => {
            layerViewFactory.verify(l => l(), Times.once())
            layerView.verify(lv => lv.create(It.isValue({ optionA: "" })), Times.once());
        });
    });
});