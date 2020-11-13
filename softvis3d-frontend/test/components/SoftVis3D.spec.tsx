import {expect} from "chai";
import {shallow} from "enzyme";
import * as React from "react";
import * as Sinon from "sinon";
import CityBuilder from "../../src/components/citybuilder/CityBuilder";
import Softvis3D from "../../src/components/Softvis3D";
import Status from "../../src/components/status/Status";
import Visualization from "../../src/components/visualization/Visualization";
import AppStatusStore from "../../src/stores/AppStatusStore";
import CityBuilderStore from "../../src/stores/CityBuilderStore";
import SceneStore from "../../src/stores/SceneStore";

describe("<SoftVis3D/>", () => {

    it("should draw all componenty on start", () => {
        let localCityBuilderStore: CityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        let localSceneStore: SceneStore = Sinon.createStubInstance(SceneStore);
        let localAppStatusStore: AppStatusStore = Sinon.createStubInstance(AppStatusStore);
        const baseUrl = "suzdgs";
        const softvis3d = shallow(
            <Softvis3D cityBuilderStore={localCityBuilderStore}
                       sceneStore={localSceneStore} appStatusStore={localAppStatusStore}
                       baseUrl={baseUrl}/>
        );

        expect(softvis3d.contains(<Status appStatusStore={localAppStatusStore}/>)).to.be.true;
        expect(softvis3d.contains(
            <CityBuilder store={localCityBuilderStore}
                         appStatusStore={localAppStatusStore}
                         sceneStore={localSceneStore}
                         baseUrl={baseUrl}/>
        )).to.be.true;
        expect(softvis3d.contains(
            <Visualization cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}/>
        )).to.be.true;
    });

});