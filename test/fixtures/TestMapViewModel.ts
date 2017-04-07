import MapViewModel from "../../scripts/MapViewModel";
import {LayerEntry} from "../../scripts/LayerRegistration";
import {Observable} from "rx";

class TestMapViewModel extends MapViewModel<void> {

    onData() {

    }

    defineLayers():LayerEntry<any>[] {
        return [<LayerEntry<any>>{
            type: "GeoJSON",
            observable: (context) => Observable.empty()
        }];
    }
}

export default TestMapViewModel