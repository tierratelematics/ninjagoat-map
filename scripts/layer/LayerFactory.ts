import { ILayerFactory, Factory } from "./ILayerFactory";
import ILayerView from "./ILayerView";
import { injectable, inject, named } from "inversify";
import { Layer, LayerGroup } from "leaflet";

@injectable()
export class LayerFactory implements ILayerFactory {
    constructor(
        @inject("Factory<ILayerView>") @named("GeoJSON") private geoJsonlayerViewFactory: Factory<ILayerView<any, any>>,
        @inject("Factory<ILayerView>") @named("Path") private pathLayerViewFactory: Factory<ILayerView<any, any>>,
        @inject("Factory<ILayerView>") @named("Drawing") private drawingLayerViewFactory: Factory<ILayerView<any, any>>
    ) {
    }

    create<TProps = any, TOptions = any>(type: string, options: TOptions): [Layer | LayerGroup, ILayerView<TProps, TOptions>] {
        let layerView: ILayerView<TProps, TOptions>;
        if (type === "GeoJSON") {
            layerView = this.geoJsonlayerViewFactory();
        }
        else if (type === "Path") {
            layerView = this.pathLayerViewFactory();
        }
        else if (type === "Drawing") {
            layerView = this.drawingLayerViewFactory();
        }

        if (!layerView) {
            throw new Error(`No layerView found for type ${type}`);
        }

        return [layerView.create(options), layerView];
    }
}