import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import {CityBuilderStore} from "../../../src/stores/CityBuilderStore";
import TopBarMenu from "../../../src/components/topbar/TopBarMenu";
import VisualizationLinkService from "../../../src/services/VisualizationLinkService";

describe("<TopBarMenu/>", () => {

    it("should show settings button", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localVisualizationLinkService = new VisualizationLinkService(localCityBuilderStore);

        localCityBuilderStore.show = false;

        const topBarMenu = shallow(
            <TopBarMenu cityBuilderStore={localCityBuilderStore} 
                        visualizationLinkService={localVisualizationLinkService}/>
        );

        const topBarButtons = topBarMenu.find("button");
        expect(topBarButtons).to.be.lengthOf(4);

        topBarButtons.first().simulate("click");
        expect(localCityBuilderStore.show).to.be.true;
    });

});