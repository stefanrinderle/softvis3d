import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import Softvis3D from "../../src/components/Softvis3D";
import {CityBuilderStore} from "../../src/stores/CityBuilderStore";
import CityBuilder from "../../src/components/citybuilder/CityBuilder";
import Visualization from "../../src/components/visualization/Visualization";
import {AppStatusStore} from "../../src/stores/AppStatusStore";
import {SceneStore} from "../../src/stores/SceneStore";
import Status from "../../src/components/status/Status";
import VisualizationLinkService from "../../src/services/VisualizationLinkService";
import * as Sinon from "sinon";
import { ObjectFactory } from "../../src/components/scene/visualization/objects/ObjectFactory";

describe("<SoftVis3D/>", () => {

    it("should draw all components on start", () => {
        let localCityBuilderStore: CityBuilderStore = Sinon.createStubInstance(CityBuilderStore);
        let localSceneStore: SceneStore = Sinon.createStubInstance(SceneStore);
        let localVisualizationLinkService = Sinon.createStubInstance(VisualizationLinkService);
        let localAppStatusStore: AppStatusStore = Sinon.createStubInstance(AppStatusStore);

        ObjectFactory.loadFonts = Sinon.stub();

        const baseUrl = "suzdgs";
        const softvis3d = shallow(
            <Softvis3D cityBuilderStore={localCityBuilderStore}
                       sceneStore={localSceneStore} appStatusStore={localAppStatusStore}
                       visualizationLinkService={localVisualizationLinkService}
                       baseUrl={baseUrl}/>
        );

        expect(softvis3d.contains(<Status appStatusStore={localAppStatusStore}/>)).to.be.true;
        expect(softvis3d.contains(
            <CityBuilder store={localCityBuilderStore} appStatusStore={localAppStatusStore}  baseUrl={baseUrl}/>
        )).to.be.true;
        expect(softvis3d.contains(
            <Visualization cityBuilderStore={localCityBuilderStore} sceneStore={localSceneStore}
                           visualizationLinkService={localVisualizationLinkService}/>
        )).to.be.true;
    });

});