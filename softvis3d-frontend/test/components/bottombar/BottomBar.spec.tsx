import * as React from "react";
import {shallow} from "enzyme";
import BottomBar from "../../../src/components/bottombar/BottomBar";
import {expect} from "chai";
import {CityBuilderStore} from "../../../src/stores/CityBuilderStore";
import BottomBarMetricInfo from "../../../src/components/bottombar/BottomBarMetricInfo";

describe("<BottomBar/>", () => {

    it("should show default text div on start", () => {
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();

        const bottomBar = shallow(
            <BottomBar cityBuilderStore={testCityBuilderStore}/>
        );

        expect(bottomBar
            .contains(<BottomBarMetricInfo title="Width" metric={testCityBuilderStore.metricWidth}/>))
            .to.be.true;

        expect(bottomBar.children().length).to.be.eq(5);
    });

});