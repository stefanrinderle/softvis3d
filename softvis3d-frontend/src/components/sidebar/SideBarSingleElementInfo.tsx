import * as React from "react";
import { observer } from "mobx-react";
import { SceneStore } from "../../stores/SceneStore";

/**
 * Currently used for an example use of selected scene object store.
 */
@observer
export default class SideBarSingleElementInfo extends React.Component<
        { element: TreeElement; isCurrentSelectedElement: boolean; sceneStore: SceneStore}, any> {

    public render() {
        if (this.props.isCurrentSelectedElement) {
            return <li className="current-selected" key={this.props.element.id}>{this.props.element.name}</li>;
        } else {
            return <li onClick={this.selectElement.bind(this)} key={this.props.element.id}>
                <a href="#">{this.props.element.name}</a>
            </li>;
        }
    }

    private selectElement() {
        this.props.sceneStore.setSelectedObjectId(this.props.element.id);
    }

}
