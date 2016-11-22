import * as React from "react";
import config from "config";

interface LoaderProps {
    queue: string[];
}

export default class Status extends React.Component<LoaderProps, any> {
    public render() {
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
        if (!this.props.queue.length) {
            return null;
        }

        return (
            <div>
                {this.renderLoadingImage()}
                {this.renderLoadingQueue()}
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
        if (config.env !== "development") {
            return null;
        }

        const {queue} = this.props;
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
