import {ObservableLayer} from "../layer/ObservableLayer";
import { PathProps } from "./PathProps";
import * as React from "react";
import { PathLayer } from "./PathLayer";

export class FixedPathLayer extends React.Component<PathProps, void> {

    render() {
        return <PathLayer freezeBounds={true} {...this.props} />
    }
}
