import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import * as Sinon from "sinon";
import Softvis3D from "../../src/components/Softvis3D";
import cityBuilderStore, {CityBuilderStore} from "../../src/stores/CityBuilderStore";
import CityBuilder from "../../src/components/citybuilder/CityBuilder";
import Visualization from "../../src/components/visualization/Visualization";
import {AppStatusStore, default as appStatusStore} from "../../src/stores/AppStatusStore";
import sceneStore, {SceneStore} from "../../src/stores/SceneStore";
import Status from "../../src/components/status/Status";
import LoadAction from "../../src/classes/status/LoadAction";
import VisualizationLinkService from "../../src/services/VisualizationLinkService";
import {ObjectFactory} from "../../src/components/scene/visualization/ObjectFactory";

describe("<SoftVis3D/>", () => {

    it("should draw all componenty on start", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();
        let localVisualizationLinkService = new VisualizationLinkService(localCityBuilderStore, localSceneStore);
        let localAppStatusStore: AppStatusStore = new AppStatusStore();

        let mockScenePainter = Sinon.mock(ObjectFactory);
        mockScenePainter.expects("loadFonts").once();

        const softvis3d = shallow(
            <Softvis3D cityBuilderStore={localCityBuilderStore}
                       sceneStore={localSceneStore} appStatusStore={localAppStatusStore}
                       visualizationLinkService={localVisualizationLinkService}/>
        );

        expect(softvis3d.contains(<Status appStatusStore={appStatusStore}/>)).to.be.true;
        expect(softvis3d.contains(<CityBuilder store={cityBuilderStore} appStatusStore={appStatusStore}/>)).to.be.true;
        expect(softvis3d.contains(
            <Visualization cityBuilderStore={cityBuilderStore} sceneStore={sceneStore}
                           visualizationLinkService={localVisualizationLinkService}/>
        )).to.be.true;

        mockScenePainter.verify();
        mockScenePainter.restore();
    });

    it("should show loader on state change", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();
        let localVisualizationLinkService = new VisualizationLinkService(localCityBuilderStore, localSceneStore);
        let localAppStatusStore: AppStatusStore = new AppStatusStore();

        localAppStatusStore.loadingQueue.add(new LoadAction("key", "eins"));
        localCityBuilderStore.show = true;

        let mockScenePainter = Sinon.mock(ObjectFactory);
        mockScenePainter.expects("loadFonts").once();

        const softvis3d = shallow(
            <Softvis3D cityBuilderStore={localCityBuilderStore}
                       sceneStore={localSceneStore} appStatusStore={localAppStatusStore}
                       visualizationLinkService={localVisualizationLinkService}/>
        );

        expect(softvis3d.contains(<Status appStatusStore={appStatusStore}/>)).to.be.true;

        mockScenePainter.verify();
        mockScenePainter.restore();
    });

});