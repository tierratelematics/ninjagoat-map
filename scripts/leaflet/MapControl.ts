import { TypedLayersControl } from "../layer/TypedLayersControl";
const PropTypes = require("prop-types");

abstract class MapControl<P> extends TypedLayersControl<P> {

    // Patch to link context correctly in React (probably due since static fields are not inherited from javascript classes)
    static contextTypes = {
        map: PropTypes.any.isRequired,
    };

    static childContextTypes = {
        layerContainer: PropTypes.any.isRequired,
    };

    abstract createLeafletElement(props: P): Object;
}

export default MapControl
