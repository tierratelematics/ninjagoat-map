import { LayersControl } from "react-leaflet";
import { isEqual, cloneDeep } from "lodash";
import "leaflet-draw";
import { Control } from "leaflet";

export interface DrawControlProps {
    draw: {
        polyline: object | boolean,
        polygon: object | boolean,
        rectangle: object | boolean,
        circle: object | boolean,
        marker: object | boolean
    },
    position: 'topright' | 'topleft' | 'bottomright' | 'bottomleft',
    edit?: {
        edit?: boolean,
        remove?: boolean,
        poly?: boolean,
        allowIntersection?: boolean
    }
};


export class DrawControl extends LayersControl<DrawControlProps, any> {
    onDrawCreate = (e) => {
        const { layerContainer } = this.context;
        layerContainer.addLayer(e.layer);
    };

    componentWillMount() {
        const { map } = this.context;
        this.updateDrawControls();
        map.on('draw:created', this.onDrawCreate);
    }

    componentDidMount() {
        super.componentDidMount();
    }

    componentWillUnmount() {
        const { map } = this.context;
        this.leafletElement.remove(map);

        map.off('draw:created', this.onDrawCreate);
    }

    componentDidUpdate(prevProps, prevState, prevContext) {
        super.componentDidUpdate(prevProps, prevState, prevContext);

        if (isEqual(this.props.draw, prevProps.draw) || this.props.position !== prevProps.position) {
            return false;
        }

        const { map } = this.context;
        this.leafletElement.remove(map);
        this.updateDrawControls();
        this.leafletElement.addTo(map);
        return null;
    }

    updateDrawControls = () => {
        const { layerContainer } = this.context;
        const { draw, edit, position } = cloneDeep(this.props);
        const options: any = {
            edit: {
                ...edit,
                featureGroup: layerContainer
            }
        };

        if (draw) {
            options.draw = draw;
        }

        if (position) {
            options.position = position;
        }

        this.leafletElement = new Control.Draw(options) as any;
    };
}