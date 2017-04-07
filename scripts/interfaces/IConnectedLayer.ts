import {MapContext} from "../LayerRegistration";

interface IConnectedLayer {
    refresh(context: MapContext);
}

export default IConnectedLayer