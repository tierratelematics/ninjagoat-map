declare module "react-leaflet" {
    //Enable the extension of react-leaflet Path class
    export class Path extends React.Component<any, any> {
        setStyle(style);

        setStyleIfChanged(fromProps, toProps);

        getOptions(options): any;
    }

    export * from "@types/react-leaflet";
}