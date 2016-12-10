import * as React from "react";
import {observer} from "mobx-react";
import SelectedElementInfo from "./SelectedElementInfo";
import TopBarMenu from "./TopBarMenu";
import {CityBuilderStore} from "../../stores/CityBuilderStore";

/**
 * Currently used for an example use of selected scene object store.
 */
@observer
export default class TopBar
        extends React.Component<{ selectedElement: TreeElement | null; cityBuilderStore: CityBuilderStore}, any> {

    public render() {
        return <div className="top-bar">
            <SelectedElementInfo cityBuilderStore={this.props.cityBuilderStore}
                                 selectedElement={this.props.selectedElement}/>
            <TopBarMenu cityBuilderStore={this.props.cityBuilderStore}/>
        </div>;
    }
}
