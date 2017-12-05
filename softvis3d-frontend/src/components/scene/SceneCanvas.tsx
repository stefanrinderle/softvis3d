import * as React from "react";
import { observer } from "mobx-react";
import { SceneMouseInteractions } from "./events/SceneMouseInteractions";
import Event from "./events/Event";
import SoftVis3dScene from "./visualization/scene/SoftVis3dScene";

interface SceneCanvasProps {
    selectObject(event: MouseEvent): void;
    updateCameraPosition(): void;
    updateSceneFocusState(isWithinScene: boolean): void;
}

/**
 * Responsible for the drawing the canvas for the visualization.
 */
@observer
export default class SceneCanvas extends React.Component<SceneCanvasProps, any> {

    private _mouseActions: SceneMouseInteractions;

    public componentDidMount() {
        this._mouseActions = SceneMouseInteractions.create();
        this._mouseActions.addMouseDownEventListener(this.handleMouseDown.bind(this));
        this._mouseActions.addMouseMovedEventListener(this.props.updateCameraPosition);
        this._mouseActions.addSelectObjectEventEventListener(this.handleSelectObject.bind(this));
    }

    public componentWillUnmount() {
        this._mouseActions.destroy();
    }

    public render() {
        return (
            <canvas id={SoftVis3dScene.CANVAS_ID}
                    onMouseDown={() => {
                        this._mouseActions.setMouseMoved(false);
                    }}
                    onMouseMove={() => {
                        this._mouseActions.setMouseMoved(true);
                    }}
                    onMouseUp={(e) => {
                        this._mouseActions.onMouseUp(e);
                    }}
            />
        );
    }

    public handleMouseDown(event: Event<boolean>) {
        this.props.updateSceneFocusState(event.getValue());
    }

    public handleSelectObject(event: Event<MouseEvent>) {
        this.props.selectObject(event.getValue());
    }

}
