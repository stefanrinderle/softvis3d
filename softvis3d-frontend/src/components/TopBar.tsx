import * as React from "react";
import { observer } from "mobx-react";
import sceneStore from "../stores/SceneStore";
import { SelectBox, SelectOption } from "./ui/SelectBox";

/**
 * Currently used for an example use of selected scene object store.
 */
@observer
export default class TopBar extends React.Component<any, any> {

    public render() {
        return (
            <div className="top-bar">
                <h1>{sceneStore.selectedObjectId}</h1>
                <SelectBox onChange={this.handelChange.bind(this)} value={sceneStore.selectedObjectId}>
                    {this.createOptionsFromShapes()}
                </SelectBox>
            </div>
        );
    }

    private handelChange(id: string) {
        sceneStore.setSelectedObjectId(id);
    }

    private createOptionsFromShapes() {
        let shapes: any[] = sceneStore.shapes;
        return shapes
            .map(shape => <SelectOption key={shape.key} value={shape.key} label={shape.key} />);
    }
}
