import IShapeTransformer from "./IShapeTransformer";
import {GeoJSONFeature} from "../geojson/GeoJSONProps";

class ShapeTransformer implements IShapeTransformer {

    transform(shape: GeoJSONFeature): GeoJSONFeature {
        return null;
    }
}

export default ShapeTransformer