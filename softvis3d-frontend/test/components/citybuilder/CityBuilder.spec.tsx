import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {CityBuilderStore} from "../../../src/stores/CityBuilderStore";
import {AppStatusStore} from "../../../src/stores/AppStatusStore";
import CityBuilder from "../../../src/components/citybuilder/CityBuilder";

describe("<CityBuilder/>", () => {

    it("should show if appStore isVisible and cityStore show", () => {
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let testAppStatusStore: AppStatusStore = new AppStatusStore();

        testCityBuilderStore.show = true;

        const cityBuilder = shallow(
            <CityBuilder store={testCityBuilderStore} appStatusStore={testAppStatusStore}/>
        );

        expect(cityBuilder.children().length).to.be.greaterThan(1);
    });

    it("should not show if cityStore show is false", () => {
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        testCityBuilderStore.show = false;
        let testAppStatusStore: AppStatusStore = new AppStatusStore();

        const cityBuilder = shallow(
            <CityBuilder store={testCityBuilderStore} appStatusStore={testAppStatusStore}/>
        );

        expect(cityBuilder.children().length).to.be.eq(0);
    });

});