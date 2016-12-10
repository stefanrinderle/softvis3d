import * as React from "react";
import {observer} from "mobx-react";
import {SceneStore} from "../../stores/SceneStore";

/**
 * Currently used for an example use of selected scene object store.
 */
@observer
export default class SideBarSelectParent
        extends React.Component<{ sceneStore: SceneStore; selectedElement: TreeElement }, any> {

    public render() {
        const parent: TreeElement | null = this.props.selectedElement.parentInfo;

        if (parent === null || typeof parent === "undefined") {
            return <div></div>;
        } else {
            return <div>
                <a href="#" onClick={this.setSelectedObjectId.bind(this, parent.id)}>
                    Select parent folder: {parent.name}
                </a>
            </div>;
        }
    }

    private setSelectedObjectId(id: string): any {
        this.props.sceneStore.setSelectedObjectId(id);
    }

}
