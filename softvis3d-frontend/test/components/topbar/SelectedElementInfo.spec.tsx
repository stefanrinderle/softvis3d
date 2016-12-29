import * as React from "react";
import { expect } from "chai";
import { shallow } from "enzyme";
import SelectedElementInfo from "../../../src/components/topbar/SelectedElementInfo";
import { CityBuilderStore } from "../../../src/stores/CityBuilderStore";
import SelectedElementMetricInfo from "../../../src/components/topbar/SelectedElementMetricInfo";

describe("<SelectedElementInfo/>", () => {

    it("should show default text div on start", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();

        const selectedElementInfo = shallow(
            <SelectedElementInfo cityBuilderStore={localCityBuilderStore} selectedElement={null}/>
        );

        expect(selectedElementInfo.html().includes("Select an object to see the details here")).to.be.true;
    });

    it("should node element if node details are requested", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();

        let selectedElement: TreeElement = createTestTreeElement("my test element");
        selectedElement.isNode = true;
        selectedElement.children.push(createTestTreeElement("child"));

        const selectedElementInfo = shallow(
            <SelectedElementInfo cityBuilderStore={localCityBuilderStore} selectedElement={selectedElement}/>
        );

        expect(selectedElementInfo.html()).to.contain(selectedElement.name);
        expect(selectedElementInfo.contains(<SelectedElementMetricInfo title="Content" name="Elements" value={1}/>))
            .to.be.true;
    });

    it("should leaf element if node details are requested", () => {
        let myHeightMetricValue: number = 321;
        let myFootprintMetricValue: number = 123;
        let myColorMetricValue: number = 222;

        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        localCityBuilderStore.metricColor = {key: "c", name: "c", type: "NONE"};
        localCityBuilderStore.metricHeight = {key: "h", name: "h", type: "NONE"};
        localCityBuilderStore.metricWidth = {key: "f", name: "f", type: "NONE"};

        let testId: string = "siudgffsiuhdsfiu2332";
        let selectedElement: TreeElement = createTestTreeElement(
            testId,
            myHeightMetricValue,
            myFootprintMetricValue,
            myColorMetricValue
        );

        const selectedElementInfo = shallow(
            <SelectedElementInfo cityBuilderStore={localCityBuilderStore} selectedElement={selectedElement}/>
        );

        expect(selectedElementInfo.html()).to.contain(selectedElement.name);
        expect(selectedElementInfo.contains(
            <SelectedElementMetricInfo title="Footprint" name="f" value={myFootprintMetricValue}/>
        )).to.be.true;

        expect(selectedElementInfo.contains(
            <SelectedElementMetricInfo title="Color" name="c" value={myColorMetricValue}/>
        )).to.be.true;

        expect(selectedElementInfo.contains(
            <SelectedElementMetricInfo title="Height" name="h" value={myHeightMetricValue}/>
        )).to.be.true;
    });
});

function createTestTreeElement(
    name: string,
    expectedHeightMetricValue: number = 0,
    expectedFootprintMetricValue: number = 0,
    expectedColorMetricValue: number = 0
): TreeElement {
    return {
        id: name,
        name,
        isNode: false,

        children: [],

        measures: {
            c: expectedColorMetricValue,
            h: expectedHeightMetricValue,
            f: expectedFootprintMetricValue
        },
        parentId: null
    };
}