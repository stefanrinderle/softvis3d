import * as React from "react";
import {observer} from "mobx-react";
import {SceneStore} from "../../stores/SceneStore";
import {TreeService} from "../../services/TreeService";

interface SelectParentProps {
    sceneStore: SceneStore;
    selectedElement: TreeElement;
}

/**
 * Currently used for an example use of selected scene object store.
 */
@observer
export default class ParentElement extends React.Component<SelectParentProps, any> {

    public render() {
        const {sceneStore, selectedElement} = this.props;
        let parent: TreeElement | null = this.getParentElement(selectedElement);

        if (parent && !selectedElement.isNode) {
            parent = this.getParentElement(parent);
        }

        if (parent === null || typeof parent === "undefined") {
            return <div className="select-parent" />;
        }

        const myParent = parent;
        return (
            <div className="select-parent">
                <span onClick={() => { sceneStore.selectedObjectId = myParent.id; }}>
                    {myParent.name}
                </span>
            </div>
        );
    }

    private getParentElement(element: TreeElement) {
        if (!this.props.sceneStore.legacyData) {
            return null;
        }

        return TreeService.searchParentNode(this.props.sceneStore.legacyData, element);
    }
}
