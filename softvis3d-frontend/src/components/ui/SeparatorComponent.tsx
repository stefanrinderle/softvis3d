import * as React from "react";
import {observer} from "mobx-react";

/**
 * Separate text elements in bars.
 */
@observer
export default class SeparatorComponent extends React.Component<any, any> {

    public render() {
        return <span> | </span>;
    }

}
