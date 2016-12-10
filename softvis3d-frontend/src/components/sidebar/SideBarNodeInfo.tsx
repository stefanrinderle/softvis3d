import * as React from "react";
import {observer} from "mobx-react";

/**
 * Currently used for an example use of selected scene object store.
 */
@observer
export default class SideBarNodeInfo extends React.Component<{ selectedElement: TreeElement }, any> {

    // TODO how to render child elements
    public render() {
        return <ul>
        </ul>;
    }

}
