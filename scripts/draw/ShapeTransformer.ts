import IShapeTransformer from "./IShapeTransformer";
import {GeoJSONFeature} from "../geojson/GeoJSONProps";
import {injectable} from "inversify";
const toPolygon = require("circle-to-polygon");

@injectable()
class ShapeTransformer implements IShapeTransformer {

    transform(shape: GeoJSONFeature): GeoJSONFeature {
        let props = <any>shape.properties;
        return props.radius && shape.geometry.type === "Point" ? this.circleToPolygon(shape) : shape;
    }

    private circleToPolygon(circle: GeoJSONFeature): GeoJSONFeature {
        let props = <any>circle.properties;
        circle.geometry = toPolygon(circle.geometry.coordinates, props.radius);
        delete props.radius;
        return circle;
    }
}

export default ShapeTransformer