import * as React from "react";
import { observer } from "mobx-react";
import { SceneStore } from "../../stores/SceneStore";

interface SideBarSelectParentProps {
    sceneStore: SceneStore;
    parentElement: TreeElement;
}

/**
 * Currently used for an example use of selected scene object store.
 */
@observer export default class SideBarSelectParent extends React.Component<SideBarSelectParentProps, any> {

    public render() {
        const parent: TreeElement | null = this.props.parentElement;

        if (parent === null || typeof parent === "undefined") {
            return <div></div>;
        }

        return (
            <div>
                <a href="#" onClick={() => this.setSelectedObjectId(parent.id)}>
                    Select parent folder: {parent.name}
                </a>
            </div>
        );
    }

    private setSelectedObjectId(id: string): any {
        this.props.sceneStore.setSelectedObjectId(id);
    }

}
