import {GeoJSONFeature} from "../geojson/GeoJSONProps";

interface IShapeTransformer {
    transform(shape: GeoJSONFeature): GeoJSONFeature;
}

export default IShapeTransformer