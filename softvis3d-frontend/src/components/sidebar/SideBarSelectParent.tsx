import * as React from "react";
import { observer } from "mobx-react";
import { SceneStore } from "../../stores/SceneStore";

/**
 * Currently used for an example use of selected scene object store.
 */
@observer
export default class SideBarSelectParent
        extends React.Component<{ sceneStore: SceneStore; parentElement: TreeElement | null }, any> {

    public render() {
        if (this.props.parentElement === null) {
            return <div></div>;
        } else {
            return <div>
                <a href="#" onClick={this.setSelectedObjectId.bind(this, this.props.parentElement.id)}>
                    Select parent folder: {this.props.parentElement.name}
                </a>
            </div>;
        }
    }

    private setSelectedObjectId(id: string): any {
        this.props.sceneStore.setSelectedObjectId(id);
    }

}
