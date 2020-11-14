import {expect} from "chai";
import {shallow} from "enzyme";
import * as React from "react";
import MetricKey from "../../../../src/components/scene/information/MetricKey";
import SceneInformation from "../../../../src/components/scene/information/SceneInformation";
import SceneStore from "../../../../src/stores/SceneStore";

describe("<SceneInformation/>", () => {

    it("should show default text div on start", () => {
        let testSceneStore: SceneStore = new SceneStore();

        const bottomBar = shallow(
            <SceneInformation sceneStore={testSceneStore}/>
        );

        expect(bottomBar
            .contains(<MetricKey
                title="Footprint"
                metric={testSceneStore.options.footprint}
                selectedElement={testSceneStore.selectedElement}
            />)).to.be.true;

        expect(bottomBar.children()).to.be.length(3);
    });

});