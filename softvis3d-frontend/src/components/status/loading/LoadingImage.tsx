import * as React from "react";

export default class LoadingImage extends React.Component<undefined, any> {
    public render() {
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
}
