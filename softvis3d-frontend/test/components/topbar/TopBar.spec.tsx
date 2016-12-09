import * as React from "react";
import TopBar from "../../../src/components/topbar/TopBar";
import {expect} from "chai";
import {shallow} from "enzyme";
import {SceneStore} from "../../../src/stores/SceneStore";
import {CityBuilderStore} from "../../../src/stores/CityBuilderStore";
import TopBarMenu from "../../../src/components/topbar/TopBarMenu";
import SelectedElementInfo from "../../../src/components/topbar/SelectedElementInfo";

describe("<TopBar/>", () => {

    it("should show default text div on start", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();

        const selectedElementInfo = shallow(
            <TopBar cityBuilderStore={localCityBuilderStore}
                    sceneStore={localSceneStore}/>
        );

        expect(selectedElementInfo.contains(<SelectedElementInfo cityBuilderStore={localCityBuilderStore}
                                                                 sceneStore={localSceneStore}/>)).to.be.true;
        expect(selectedElementInfo.contains(<TopBarMenu cityBuilderStore={localCityBuilderStore}/>)).to.be.true;
    });

});