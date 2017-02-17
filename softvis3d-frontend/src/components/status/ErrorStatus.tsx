import * as React from "react";
import {observer} from "mobx-react";
import {AppStatusStore} from "../../stores/AppStatusStore";

@observer
export default class ErrorStatus extends React.Component<{ appStatusStore: AppStatusStore; }, any> {

    public render() {
        if (!this.props.appStatusStore.errors.isEmpty) {
            let elements = this.createErrorElements();
            return (
                <div>
                    <h2>An error occured:</h2>
                    <ul className="events">
                        {elements}
                    </ul>
                </div>
            );
        } else {
            return <div />;
        }

    }

    private createErrorElements() {
        let elements: Array<React.ReactElement<any>> = [];

        for (let queueElement of this.props.appStatusStore.errors) {
            elements.push(
                <li key={queueElement.key}>
                    {queueElement.description}
                    <br /><br />
                    <div className="buttons">
                        <button onClick={() => queueElement.retryCallback()}>{queueElement.retryButtonText}</button>
                    </div>
                </li>
            );
        }
        return elements;
    }

}
