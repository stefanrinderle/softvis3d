import * as React from "react";
import {observer} from "mobx-react";
import {AppStatusStore} from "../../stores/AppStatusStore";

@observer
export default class ErrorStatus extends React.Component<{ appStatusStore: AppStatusStore; }, any> {

    public render() {
        if (this.props.appStatusStore.errors.length > 0) {
            let elements = this.createErrorElements();
            return (
                <ul className="events">
                    {elements}
                </ul>
            );
        } else {
            return <div />;
        }

    }

    private createErrorElements() {
        const queue = this.props.appStatusStore.errors;

        let elements: Array<React.ReactElement<any>> = [];
        for (let i = 0; i < queue.length; i++) {
            elements.push(
                <li key={queue[i] + "_" + i}>{queue[i]}</li>
            );
        }
        return elements;
    }

}
