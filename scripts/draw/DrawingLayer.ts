import { ObservableLayer } from "../layer/ObservableLayer";
import { GeoJSONProps, GeoJSONCollection, GeoJSONFeature } from "../geojson/GeoJSONProps";
import { lazyInject } from "ninjagoat";
import IMapHolder from "../leaflet/IMapHolder";
import { Circle, LayerGroup, Draw } from "leaflet";
import { map, isEqual } from "lodash";
import IShapeTransformer from "./IShapeTransformer";
import { Children } from "react";

export type DrawingLayerProps = GeoJSONProps & {
    onChange: (shapes: GeoJSONCollection) => void,
    onVertex?: (collection: GeoJSONCollection) => void
};

export class DrawingLayer extends ObservableLayer<DrawingLayerProps> {

    @lazyInject("IMapHolder")
    private mapHolder: IMapHolder;
    @lazyInject("IShapeTransformer")
    private shapeTransformer: IShapeTransformer;

    getLayerType(props: GeoJSONProps): string {
        return "Drawing";
    }

    componentDidMount() {
        super.componentDidMount();
        let map = this.mapHolder.obtainMap();
        map.on(Draw.Event.EDITED, this.notifyShapes.bind(this));
        map.on(Draw.Event.DELETED, this.notifyShapes.bind(this));
        map.on(Draw.Event.DRAWSTOP, this.notifyShapes.bind(this));
        if (this.props.onVertex) {
            map.on(Draw.Event.DRAWVERTEX, (event: any) => this.notifyVertices(event.layers));
            map.on(Draw.Event.EDITVERTEX, (event: any) => this.notifyVertices(event.layers));
        }
    }

    private notifyShapes(event) {
        this.props.onChange({
            "type": "FeatureCollection",
            "features": this.combineShapes()
        });
    }

    private notifyVertices(layers) {
        if (this.props.onVertex) {
            this.props.onVertex(layers.toGeoJSON());
        }
    }

    private combineShapes(): GeoJSONFeature[] {
        let layers = (this.layer as LayerGroup).getLayers();
        return map(layers, (shape: any) => {
            let geojson = shape.toGeoJSON();
            if (shape instanceof Circle)
                geojson.properties.radius = shape.getRadius();
            return this.shapeTransformer.transform(geojson);
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        let map = this.mapHolder.obtainMap();
        if (map) { // Map could be already disposed
            map.off(Draw.Event.DRAWSTOP);
            map.off(Draw.Event.EDITED);
            map.off(Draw.Event.DELETED);
            if (this.props.onVertex) {
                map.off(Draw.Event.DRAWVERTEX);
                map.off(Draw.Event.EDITVERTEX);
            }
        }
    }

    shouldComponentUpdate(nextProps){
        return !isEqual(Children.only(this.props.children).props, Children.only(nextProps.children).props);
    }
}
