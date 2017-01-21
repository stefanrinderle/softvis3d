import * as React from "react";
import {observer} from "mobx-react";
import {AppStatusStore} from "../../stores/AppStatusStore";
import Loading from "./loading/Loading";
import SoftVis3DLogo from "./SoftVis3DLogo";
import ErrorStatus from "./ErrorStatus";

@observer
export default class Status extends React.Component<{ appStatusStore: AppStatusStore; }, any> {
    public render() {
        if (!this.props.appStatusStore.isVisible) {
            return <div />;
        }

        return (
            <div className="status-component">
                <SoftVis3DLogo/>

                <Loading appStatusStore={this.props.appStatusStore}/>
                <ErrorStatus appStatusStore={this.props.appStatusStore}/>
            </div>
        );
    }

}
