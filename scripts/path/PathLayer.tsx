import {ObservableLayer} from "../layer/ObservableLayer";
import { PathProps } from "./PathProps";
import * as React from "react";

export class PathLayer extends ObservableLayer<PathProps> {

    getLayerType(props: PathProps): string {
        return "Path";
    }
}

export class FixedPathLayer extends React.Component<PathProps, void> {

    render() {
        return <PathLayer freezeBounds={true} {...this.props} />
    }
}
