import * as React from "react";
import {observer} from "mobx-react";
import {AppStatusStore} from "../../stores/AppStatusStore";

@observer
export default class InfoStatus extends React.Component<{ appStatusStore: AppStatusStore; }, any> {

    public render() {
        if (!this.props.appStatusStore.statusQueue.isEmpty) {
            let elements = this.createInfoStatusElements();
            return (
                <div>
                    <ul className="events">
                        {elements}
                    </ul>
                </div>
            );
        } else {
            return <div />;
        }

    }

    private createInfoStatusElements() {
        let elements: Array<React.ReactElement<any>> = [];

        for (let queueElement of this.props.appStatusStore.statusQueue) {
            elements.push(
                <li key={queueElement.key}>
                    {queueElement.description}
                    <br /><br />
                    <div className="buttons">
                        <button onClick={() => this.props.appStatusStore.removeStatus(queueElement)}>OK</button>
                    </div>
                </li>
            );
        }
        return elements;
    }

}
