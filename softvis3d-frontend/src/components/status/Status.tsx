import * as React from "react";
import {observer} from "mobx-react";
import {AppStatusStore} from "../../stores/AppStatusStore";
import Loading from "./loading/Loading";
import SoftVis3DLogo from "./SoftVis3DLogo";
import ErrorStatus from "./ErrorStatus";
import InfoStatus from "./InfoStatus";
import {lazyInject} from "../../inversify.config";

@observer
export default class Status extends React.Component<any, any> {

    @lazyInject("AppStatusStore")
    private appStatusStore: AppStatusStore;

    public render() {
        if (!this.appStatusStore.isVisible) {
            return <div />;
        }

        return (
            <div className="status-component">
                <SoftVis3DLogo/>

                <InfoStatus appStatusStore={this.appStatusStore}/>
                <Loading appStatusStore={this.appStatusStore}/>
                <ErrorStatus appStatusStore={this.appStatusStore}/>
            </div>
        );
    }

}
