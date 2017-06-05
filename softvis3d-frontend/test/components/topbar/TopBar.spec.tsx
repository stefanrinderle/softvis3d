import * as React from "react";
import TopBar from "../../../src/components/topbar/TopBar";
import { expect } from "chai";
import { shallow } from "enzyme";
import { CityBuilderStore } from "../../../src/stores/CityBuilderStore";
import TopBarMenu from "../../../src/components/topbar/TopBarMenu";
import SelectedElementInfo from "../../../src/components/topbar/SelectedElementInfo";
import {SceneStore} from "../../../src/stores/SceneStore";
import VisualizationLinkService from "../../../src/services/VisualizationLinkService";
import * as Sinon from "sinon";

describe("<TopBar/>", () => {

    it("should show default text div on start", () => {
        let localCityBuilderStore: CityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        let localSceneStore: SceneStore = Sinon.createStubInstance(SceneStore);
        let localVisualizationLinkService = Sinon.createStubInstance(VisualizationLinkService);

        const selectedElementInfo = shallow(
            <TopBar cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}
                    visualizationLinkService={localVisualizationLinkService}/>
        );

        expect(selectedElementInfo.contains(<SelectedElementInfo sceneStore={localSceneStore}/>)).to.be.true;
        expect(selectedElementInfo.contains(
            <TopBarMenu cityBuilderStore={localCityBuilderStore}
                        visualizationLinkService={localVisualizationLinkService}/>)).to.be.true;
    });

});