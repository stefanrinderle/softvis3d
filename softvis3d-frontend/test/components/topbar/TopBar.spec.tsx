import {expect} from "chai";
import {shallow} from "enzyme";
import * as React from "react";
import * as Sinon from "sinon";
import SelectedElementInfo from "../../../src/components/topbar/SelectedElementInfo";
import TopBar from "../../../src/components/topbar/TopBar";
import TopBarMenu from "../../../src/components/topbar/TopBarMenu";
import CityBuilderStore from "../../../src/stores/CityBuilderStore";
import SceneStore from "../../../src/stores/SceneStore";

describe("<TopBar/>", () => {

    it("should show default text div on start", () => {
        const localCityBuilderStore: CityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        const localSceneStore: SceneStore = Sinon.createStubInstance(SceneStore);

        const selectedElementInfo = shallow(
            <TopBar cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        );

        expect(selectedElementInfo.contains(<SelectedElementInfo sceneStore={localSceneStore}/>)).to.be.true;
        expect(selectedElementInfo.contains(
            <TopBarMenu cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>)).to.be.true;
    });

});