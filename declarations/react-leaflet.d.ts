declare module "react-leaflet" {
    export * from "@types/react-leaflet";

    //Enable the extension of react-leaflet base classes
    export class FeatureGroup<P> extends React.Component<P, any> {
        setStyle(style);

        setStyleIfChanged(fromProps, toProps);

        getOptions(options): any;

        componentDidMount();
    }

    export class LayersControl<P> extends React.Component<P, any> {

    }
}