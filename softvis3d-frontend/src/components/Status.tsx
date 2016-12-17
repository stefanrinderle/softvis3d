import * as React from "react";
import {observer} from "mobx-react";
import appStatusStore from "../stores/AppStatusStore";

@observer export default class Status extends React.Component<any, any> {
    public render() {
        if (!appStatusStore.isVisible) {
            return <div />;
        }

        return (
            <div className="status-component">
                <h3 className="softvis-logo">
                    <span className="p1">SoftVis</span>
                    <span className="p2">3D</span>
                </h3>

                {this.renderLoader()}
            </div>
        );
    }

    private renderLoader() {
        return (
            <div>
                {this.renderLoadingImage()}
                {this.renderLoadingQueue()}
                {this.renderErrorQueue()}
            </div>
        );
    }

    private renderLoadingImage() {
        return (
            <div>
                <span className="cssload-label">Loading...</span>
                <div className="cssload-container">
                    <div className="cssload-cord cssload-leftMove">
                        <div className="cssload-ball"></div>
                    </div>
                    <div className="cssload-cord">
                        <div className="cssload-ball"></div>
                    </div>
                    <div className="cssload-cord">
                        <div className="cssload-ball"></div>
                    </div>
                    <div className="cssload-cord">
                        <div className="cssload-ball"></div>
                    </div>
                    <div className="cssload-cord">
                        <div className="cssload-ball"></div>
                    </div>
                    <div className="cssload-cord">
                        <div className="cssload-ball"></div>
                    </div>
                    <div className="cssload-cord cssload-rightMove">
                        <div className="cssload-ball"></div>
                    </div>
                    <div className="cssload-shadows">
                        <div className="cssload-leftShadow"></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div className="cssload-rightShadow"></div>
                    </div>
                </div>
            </div>
        );
    }

    private renderLoadingQueue() {
        if (!appStatusStore.showLoadingQueue) {
            return null;
        }

        const queue = appStatusStore.loadingQueue;

        if (queue.length === 0) {
            return null;
        }

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

    private renderErrorQueue() {
        const queue = appStatusStore.errors;

        if (queue.length === 0) {
            return null;
        }

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
