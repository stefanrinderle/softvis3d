import * as React from "react";
import { observer } from "mobx-react";
import { SceneStore } from "../../stores/SceneStore";
import {TreeService} from "../../services/TreeService";

interface SelectParentProps {
    sceneStore: SceneStore;
    selectedElement: TreeElement;
}

/**
 * Currently used for an example use of selected scene object store.
 */
@observer
export default class SelectParent extends React.Component<SelectParentProps, any> {

    public render() {
        let parent: TreeElement | null = this.getParentElement(this.props.selectedElement);

        if (parent && !this.props.selectedElement.isNode) {
            parent = this.getParentElement(parent);
        }

        if (parent === null || typeof parent === "undefined") {
            return <div className="select-parent"></div>;
        }

        const myParent = parent;
        return (
            <div className="select-parent">
                <span onClick={() => this.setSelectedObjectId(myParent.id)}>
                    {myParent.name}
                </span>
            </div>
        );
    }

    private setSelectedObjectId(id: string): any {
        this.props.sceneStore.setSelectedObjectId(id);
    }

    private getParentElement(element: TreeElement) {
        if (!this.props.sceneStore.legacyData) {
            return null;
        }

        return TreeService.searchParentNode(this.props.sceneStore.legacyData, element);
    }
}
