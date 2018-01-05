import {ObservableLayer} from "../layer/ObservableLayer";
import { PathProps } from "./PathProps";

export class PathLayer extends ObservableLayer<PathProps> {

    getLayerType(props: PathProps): string {
        return "Path";
    }
}
