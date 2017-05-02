declare module "react-leaflet" {
    //Enable the extension of react-leaflet FeatureGroup class
    export class FeatureGroup<P> extends React.Component<P, any> {
        setStyle(style);

        setStyleIfChanged(fromProps, toProps);

        getOptions(options): any;
    }

    export * from "@types/react-leaflet";
}