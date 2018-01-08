
import { FeatureGroup } from "react-leaflet";

export class TypedFeatureGroup<P> extends FeatureGroup implements React.Component<P, any> {
    
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

    componentWillMount?(): void {
        super.componentWillMount();
    }
    componentDidMount?(): void {
        super.componentDidMount();
    }
    componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void {
        super.componentWillReceiveProps(nextProps, nextContext);
    }
    shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<any>, nextContext: any): boolean {
        return super.shouldComponentUpdate(nextProps, nextState, nextContext);
    }
    componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<any>, nextContext: any): void {
        super.componentWillUpdate(nextProps, nextState, nextContext);
    }
    componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<any>, prevContext: any): void {
        super.componentDidUpdate(prevProps, prevState, prevContext);
    }
    componentWillUnmount?(): void {
        super.componentWillUnmount();
    }

}