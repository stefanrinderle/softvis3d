import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import SelectedElementInfo from "../../../src/components/topbar/SelectedElementInfo";
import {CityBuilderStore} from "../../../src/stores/CityBuilderStore";
import {SceneStore} from "../../../src/stores/SceneStore";
import SelectedElementNodeInfo from "../../../src/components/topbar/SelectedElementNodeInfo";
import SelectedElementLeafInfo from "../../../src/components/topbar/SelectedElementLeafInfo";

describe("<SelectedElementInfo/>", () => {

    it("should show default text div on start", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();

        const selectedElementInfo = shallow(
            <SelectedElementInfo cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        );

        expect(selectedElementInfo.html().includes("Select an object to see the details here")).to.be.true;
    });

    it("should node element if node details are requested", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();

        let testId: string = "siudgffsiuhdsfiu2332";
        localSceneStore.legacyData = createTestTreeElement(testId);
        localSceneStore.selectedObjectId = testId;
        localSceneStore.legacyData.isNode = true;

        const selectedElementInfo = shallow(
            <SelectedElementInfo cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        );

        expect(selectedElementInfo.contains(<SelectedElementNodeInfo selectedElement={localSceneStore.legacyData}/>))
            .to.be.true;
    });

    it("should leaf element if node details are requested", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();

        let testId: string = "siudgffsiuhdsfiu2332";
        localSceneStore.legacyData = createTestTreeElement(testId);
        localSceneStore.selectedObjectId = testId;

        const selectedElementInfo = shallow(
            <SelectedElementInfo cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        );

        expect(selectedElementInfo.contains(<SelectedElementLeafInfo selectedElement={localSceneStore.legacyData}
                                                                     cityBuilderStore={localCityBuilderStore}/>))
            .to.be.true;
    });
});

function createTestTreeElement(id: string): TreeElement {
    return {
        id,
        name: "",
        isNode: false,

        children: [],

        colorMetricValue: 0,
        footprintMetricValue: 0,
        heightMetricValue: 0,
        parentInfo: null
    };
}