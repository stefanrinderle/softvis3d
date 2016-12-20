import * as React from "react";
import {observer} from "mobx-react";
import SelectedElementInfo from "./SelectedElementInfo";
import TopBarMenu from "./TopBarMenu";
import {CityBuilderStore} from "../../stores/CityBuilderStore";

interface TopBarProbs {
    selectedElement: TreeElement | null;
    cityBuilderStore: CityBuilderStore;
}

@observer export default class TopBar extends React.Component<TopBarProbs, any> {
    public render() {
        const {cityBuilderStore, selectedElement} = this.props;
        return <div id="app-topbar" className="top-bar">
            <TopBarMenu cityBuilderStore={cityBuilderStore}/>
            <SelectedElementInfo cityBuilderStore={cityBuilderStore} selectedElement={selectedElement}/>
        </div>;
    }
}
