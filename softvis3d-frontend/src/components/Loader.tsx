import * as React from "react";
import config from "config";

interface LoaderProps {
    queue: string[];
}

export default class Loader extends React.Component<LoaderProps, any> {
    public render() {
        return (
            <div className="loader-component">

                {this.renderSoftvisLogo()}
                {this.renderLoadingImage()}
                {this.renderLoadingQueue()}
            </div>
        );
    }

    private renderSoftvisLogo() {
        return (
            <h3 className="softvis-logo">
                <span className="p1">SoftVis</span>
                <span className="p2">3D</span>
            </h3>
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

        let elements = [];
        for (let i = 0; i < this.props.queue.length; i++) {
            elements.push(
                <li key={this.props.queue[i] + "_" + i}>{this.props.queue[i]}</li>
            );
        }
        return (
            <div>
                <ul>
                    {elements}
                </ul>
            </div>
        );
    }
}
