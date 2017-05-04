import * as React from "react";
import {EditControl as OriginalEditControl} from "react-leaflet-draw";

class EditControl extends React.Component<any, any> {

    render() {
        return <OriginalEditControl {...props} />
    }
}

export default EditControl