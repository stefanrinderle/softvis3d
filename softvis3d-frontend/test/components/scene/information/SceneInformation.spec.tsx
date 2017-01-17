import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import SceneInformation from "../../../../src/components/scene/information/SceneInformation";
import MetricKey from "../../../../src/components/scene/information/MetricKey";
import {CityBuilderStore} from "../../../../src/stores/CityBuilderStore";
import {SceneStore} from "../../../../src/stores/SceneStore";

describe("<SceneInformation/>", () => {

    it("should show default text div on start", () => {
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let testSceneStore: SceneStore = new SceneStore();

        const bottomBar = shallow(
            <SceneInformation cityBuilderStore={testCityBuilderStore} sceneStore={testSceneStore}/>
        );

        expect(bottomBar
            .contains(<MetricKey
                title="Width"
                metric={testCityBuilderStore.profile.metricWidth}
                selectedElement={testSceneStore.selectedElement}
            />)).to.be.true;

        expect(bottomBar.children().length).to.be.eq(3);
    });

});