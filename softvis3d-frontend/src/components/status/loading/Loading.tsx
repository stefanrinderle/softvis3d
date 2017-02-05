import * as React from "react";
import {observer} from "mobx-react";
import LoadingImage from "./LoadingImage";
import LoadingQueue from "./LoadingQueue";
import {AppStatusStore} from "../../../stores/AppStatusStore";

@observer
export default class Loading extends React.Component<{ appStatusStore: AppStatusStore; }, any> {
    public render() {
        if (!this.props.appStatusStore.loadingQueue.isEmpty) {
            return <div>
                <LoadingImage/>
                <LoadingQueue appStatusStore={this.props.appStatusStore}/>
            </div>;
        } else {
            return <div />;
        }
    }

}
