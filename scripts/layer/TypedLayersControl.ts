
import { LayersControl } from "react-leaflet";

export class TypedLayersControl<P> extends LayersControl implements React.Component<P, any> {
    
    render(): false | JSX.Element {
        return super.render();
    }

    setState<K extends string>(f: (prevState: any, props: P) => Pick<any, K>, callback?: () => void): void;
    setState<K extends string>(state: Pick<any, K>, callback?: () => void): void;
    setState(state: any, callback?: any) {
        super.setState(state, callback);
    }
    forceUpdate(callBack?: () => void): void {
        super.forceUpdate(callBack);
    }
    props: Readonly<{ children?: React.ReactNode; }> & Readonly<P>;
    state: Readonly<any>;
    context: any;
    refs: { [key: string]: React.ReactInstance; };

}