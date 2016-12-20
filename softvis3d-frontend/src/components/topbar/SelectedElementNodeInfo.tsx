import * as React from "react";
import {observer} from "mobx-react";

/**
 * Currently used for an example use of selected scene object store.
 */
@observer
export default class SelectedElementNodeInfo extends React.Component<{selectedElement: TreeElement}, any> {

    public render() {
        return <div>
            Folder: <span className="top-bar-header">{this.props.selectedElement.name}</span>
            <span>Children: {this.props.selectedElement.children.length}</span>
        </div>;
    }

}
