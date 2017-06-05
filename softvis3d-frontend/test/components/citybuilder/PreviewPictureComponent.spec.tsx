import * as React from "react";
import {shallow} from "enzyme";
import {expect} from "chai";
import {CityBuilderStore} from "../../../src/stores/CityBuilderStore";
import PreviewPictureComponent from "../../../src/components/citybuilder/PreviewPictureComponent";

describe("<PreviewPictureComponent/>", () => {

    it("should show resolve url for preview picture", () => {
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let baseUrl: string = "";

        const underTest = shallow(
            <PreviewPictureComponent store={testCityBuilderStore} baseUrl={baseUrl}/>
        );

        expect(underTest.html()).to.include("evostreet_complexity_loc_EXTINT.png");
    });

    it("should show resolve url for preview picture with base url", () => {
        let testCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let baseUrl: string = "/isudfisu";

        const underTest = shallow(
            <PreviewPictureComponent store={testCityBuilderStore} baseUrl={baseUrl}/>
        );

        expect(underTest.html()).to.include(baseUrl);
    });
});