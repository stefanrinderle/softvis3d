import * as React from "react";
import { observer } from "mobx-react";
import { SoftVis3dScene } from "./visualization/SoftVis3dScene";
import { SceneStore } from "../../stores/SceneStore";
import SceneInformation from "./information/SceneInformation";

interface SceneProps {
    sceneStore: SceneStore;
}

/**
 * Responsible for the drawing the canvas for the visualization.
 */
@observer
export default class Scene extends React.Component<SceneProps, any> {

    private mouseMoved: boolean = false;

    constructor() {
        super();
    }

    public componentDidMount() {
        this.props.sceneStore.scenePainter.init();
        this.props.sceneStore.refreshScene = true;
        this.props.sceneStore.sceneComponentIsMounted = true;
    }

    public componentWillUnmount() {
        this.props.sceneStore.sceneComponentIsMounted = false;
    }

    public render() {
        const {sceneStore} = this.props;

        return (
            <div className="scene">
                <canvas id={SoftVis3dScene.CANVAS_ID}
                        onMouseDown={() => { this.mouseMoved = false; }}
                        onMouseMove={() => { this.mouseMoved = true; }}
                        onMouseUp={(e) => !this.mouseMoved && this.makeSelection(e) }
                        />
                <SceneInformation sceneStore={sceneStore}/>
           </div>
        );
    }

    private makeSelection(event: any) {
        const {sceneStore} = this.props;
        sceneStore.selectedObjectId = sceneStore.scenePainter.makeSelection(event);
    }
}