import {expect} from "chai";
import {shallow} from "enzyme";
import * as React from "react";
import AdvancedAnalysisOptions from "../../../src/components/citybuilder/AdvancedAnalysisOptions";
import CityBuilder from "../../../src/components/citybuilder/CityBuilder";
import OptionsSimple from "../../../src/components/citybuilder/OptionsSimple";
import AppStatusStore from "../../../src/stores/AppStatusStore";
import CityBuilderStore from "../../../src/stores/CityBuilderStore";
import SceneStore from "../../../src/stores/SceneStore";

describe("<CityBuilder/>", () => {

    it("should show if appStore isVisible and cityStore show", () => {
        const testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        const testAppStatusStore: AppStatusStore = new AppStatusStore();
        const testSceneStore: SceneStore = new SceneStore();

        testCityBuilderStore.show = true;

        const cityBuilder = shallow(
            <CityBuilder store={testCityBuilderStore} appStatusStore={testAppStatusStore} sceneStore={testSceneStore}/>
        );

        expect(cityBuilder.children().length).to.be.greaterThan(1);
    });

    it("should show advanced tab on click", () => {
        const testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        const testAppStatusStore: AppStatusStore = new AppStatusStore();
        const testSceneStore: SceneStore = new SceneStore();

        testCityBuilderStore.show = true;

        const cityBuilder = shallow(
            <CityBuilder store={testCityBuilderStore} appStatusStore={testAppStatusStore} sceneStore={testSceneStore}/>
        );

        expect(cityBuilder.contains(<OptionsSimple store={testCityBuilderStore} baseUrl={undefined}/>)).to.be.true;
        expect(cityBuilder.contains(<AdvancedAnalysisOptions store={testCityBuilderStore}/>)).to.be.false;

        cityBuilder.find("#city-builder-tab-1").simulate("click");

        expect(cityBuilder.contains(<OptionsSimple store={testCityBuilderStore} baseUrl={undefined}/>)).to.be.false;
        expect(cityBuilder.contains(<AdvancedAnalysisOptions store={testCityBuilderStore}/>)).to.be.true;
    });

    it("should not show if cityStore show is false", () => {
        const testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        testCityBuilderStore.show = false;
        const testAppStatusStore: AppStatusStore = new AppStatusStore();
        const testSceneStore: SceneStore = new SceneStore();

        const cityBuilder = shallow(
            <CityBuilder store={testCityBuilderStore} appStatusStore={testAppStatusStore} sceneStore={testSceneStore}/>
        );

        expect(cityBuilder.children().length).to.be.eq(0);
    });

});