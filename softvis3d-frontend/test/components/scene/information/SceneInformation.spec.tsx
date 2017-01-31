import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import SceneInformation from "../../../../src/components/scene/information/SceneInformation";
import MetricKey from "../../../../src/components/scene/information/MetricKey";
import {SceneStore, default as sceneStore} from "../../../../src/stores/SceneStore";

describe("<SceneInformation/>", () => {

    it("should show default text div on start", () => {
        let testSceneStore: SceneStore = new SceneStore();

        const bottomBar = shallow(
            <SceneInformation sceneStore={testSceneStore}/>
        );

        expect(bottomBar
            .contains(<MetricKey
                title="Width"
                metric={sceneStore.profile.metricWidth}
                selectedElement={testSceneStore.selectedElement}
            />)).to.be.true;

        expect(bottomBar.children().length).to.be.eq(3);
    });

});