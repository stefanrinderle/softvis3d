import * as React from "react";
import {observer} from "mobx-react";
import {SceneStore} from "../../stores/SceneStore";
import {TreeElement} from "../../classes/TreeElement";

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

        if (parent && selectedElement.isFile) {
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

    private getParentElement(element: TreeElement): TreeElement | null {
        if (!this.props.sceneStore.projectData) {
            return null;
        }

        return element.parent ? element.parent : null;
    }
}
