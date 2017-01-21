import * as React from "react";
import {AppStatusStore} from "../../../stores/AppStatusStore";

export default class LoadingQueue extends React.Component<{ appStatusStore: AppStatusStore; }, any> {

    public render() {
        const queue = this.props.appStatusStore.loadingQueue;

        let elements: Array<React.ReactElement<any>> = [];
        for (let i = 0; i < queue.length; i++) {
            elements.push(
                <li key={queue[i] + "_" + i}>{queue[i]}</li>
            );
        }

        return (
            <ul className="events">
                {elements}
            </ul>
        );
    }

}
