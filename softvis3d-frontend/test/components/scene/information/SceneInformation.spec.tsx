import {expect} from "chai";
import {shallow} from "enzyme";
import * as React from "react";
import MetricKey from "../../../../src/components/scene/information/MetricKey";
import SceneInformation from "../../../../src/components/scene/information/SceneInformation";
import CityBuilderStore from "../../../../src/stores/CityBuilderStore";
import SceneStore from "../../../../src/stores/SceneStore";

describe("<SceneInformation/>", () => {

    it("should show default text div on start", () => {
        let testSceneStore: SceneStore = new SceneStore();
        let cityBuilderStore: CityBuilderStore = new CityBuilderStore();

        const bottomBar = shallow(
            <SceneInformation sceneStore={testSceneStore} cityBuilderStore={cityBuilderStore}/>
        );

        expect(bottomBar
            .contains(<MetricKey
                title="Footprint"
                metric={cityBuilderStore.options.profile.footprintMetric}
                selectedElement={testSceneStore.selectedElement}
            />)).to.be.true;

        expect(bottomBar.children()).to.be.length(3);
    });

});