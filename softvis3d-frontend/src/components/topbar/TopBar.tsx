import * as React from "react";
import {observer} from "mobx-react";
import SelectedElementInfo from "./SelectedElementInfo";
import TopBarMenu from "./TopBarMenu";

/**
 * Currently used for an example use of selected scene object store.
 */
@observer
export default class TopBar extends React.Component<any, any> {

    public render() {
        return <div className="top-bar">
            <SelectedElementInfo/>
            <TopBarMenu/>
        </div>;
    }
}
