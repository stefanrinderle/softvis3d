import * as React from "react";
import {AppStatusStore} from "../../../stores/AppStatusStore";
import StatusActionQueue from "../../../classes/status/StatusActionQueue";
import LoadAction from "../../../classes/status/LoadAction";

export default class LoadingQueue extends React.Component<{ appStatusStore: AppStatusStore; }, any> {

    public render() {
        const queue: StatusActionQueue<LoadAction> = this.props.appStatusStore.loadingQueue;

        let elements: Array<React.ReactElement<any>> = [];
        for (let queueElement of queue) {
            if (queueElement.current && queueElement.limit) {
                elements.push(
                    <li key={queueElement.key}>
                        {queueElement.description}<br />
                        {queueElement.current} of {queueElement.limit} | {queueElement.percent} %
                    </li>
                );
            } else {
                elements.push(
                    <li key={queueElement.key}>
                        {queueElement.description}
                    </li>
                );
            }
        }

        return (
            <ul className="events">
                {elements}
            </ul>
        );
    }

}
