declare module "react-leaflet" {
    export class Path {
        setStyle(style);

        setStyleIfChanged(fromProps, toProps);

        getOptions(options): any;
    }

    export * from "@types/react-leaflet";
}