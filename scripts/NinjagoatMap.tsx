import * as React from "react";
import {forEach} from "lodash";
import {lazyInject} from "ninjagoat";
import {Map} from "react-leaflet";
import ILayerPresenter from "./interfaces/ILayerPresenter";

class NinjagoatMap extends React.Component<void, void> {

    @lazyInject("ILayerPresenter")
    private layerPresenter: ILayerPresenter;

    render() {
        return <Map/>;
    }

    componentDidMount() {
        forEach(React.Children.toArray(this.props.children), (children:React.ReactElement<any>) => {
            let layer = {
                type: children.props.type,
                observable: children.props.observable,
                options: children.props.options
            };
            this.layerPresenter.present(layer.observable, layer.type, layer.options);
        });
    }
}

export default NinjagoatMap