import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import {CityBuilderStore} from "../../../src/stores/CityBuilderStore";
import TopBarMenu from "../../../src/components/topbar/TopBarMenu";

describe("<TopBarMenu/>", () => {

    it("should show settings button", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();

        localCityBuilderStore.show = false;

        const topBarMenu = shallow(
            <TopBarMenu cityBuilderStore={localCityBuilderStore}/>
        );

        const topBarButtons = topBarMenu.find("button");
        expect(topBarButtons).to.be.lengthOf(3);

        topBarButtons.first().simulate("click");
        expect(localCityBuilderStore.show).to.be.true;
    });

});