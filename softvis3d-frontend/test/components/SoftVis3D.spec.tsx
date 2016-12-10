import * as React from "react";
import {expect} from "chai";
import {shallow} from "enzyme";
import Softvis3D from "../../src/components/Softvis3D";
import Status from "../../src/components/Status";
import cityBuilderStore, {CityBuilderStore} from "../../src/stores/CityBuilderStore";
import CityBuilder from "../../src/components/CityBuilder/CityBuilder";
import Visualization from "../../src/components/visualization/Visualization";
import {AppStatusStore} from "../../src/stores/AppStatusStore";
import sceneStore, {SceneStore} from "../../src/stores/SceneStore";

describe("<SoftVis3D/>", () => {

    it("should show nothing on start", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();
        let localAppStatusStore: AppStatusStore = new AppStatusStore();

        const softvis3d = shallow(
            <Softvis3D cityBuilderStore={localCityBuilderStore}
                       sceneStore={localSceneStore} appStatusStore={localAppStatusStore}/>
        );

        expect(softvis3d.contains(<Status/>)).to.be.false;
        expect(softvis3d.contains(<CityBuilder store={cityBuilderStore}/>)).to.be.false;
        expect(softvis3d.contains(
            <Visualization cityBuilderStore={cityBuilderStore} sceneStore={sceneStore}/>)).to.be.false;
    });

    it("should show loader on state change", () => {
        let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
        let localSceneStore: SceneStore = new SceneStore();
        let localAppStatusStore: AppStatusStore = new AppStatusStore();

        localAppStatusStore.loadingQueue = ['eins'];
        localCityBuilderStore.show = true;

        const softvis3d = shallow(
            <Softvis3D cityBuilderStore={localCityBuilderStore}
                       sceneStore={localSceneStore} appStatusStore={localAppStatusStore}/>
        );

        expect(softvis3d.contains(<Status/>)).to.be.true;
    });

    /**
     * TODO test does not work because CityBuilderStore.isVisible depends on the AppStatusStore within the
     *      CityBuilderStore which i have no idea how to mock this without changing the overall
     *      AppStatus store and changing the AppStatusStore would have side effects
     *      on other tests.
     */
    // it("should show builder on state change", () => {
    //     let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
    //     let localSceneStore: SceneStore = new SceneStore();
    //     let localAppStatusStore: AppStatusStore = new AppStatusStore();
    //
    //     localAppStatusStore.loadingQueue = [];
    //     localCityBuilderStore.show = true;
    //
    //     const softvis3d = shallow(
    //         <Softvis3D cityBuilderStore={localCityBuilderStore}
    //                    sceneStore={localSceneStore} appStatusStore={localAppStatusStore}/>
    //     );
    //
    //     expect(softvis3d.contains(<CityBuilder store={cityBuilderStore}/>)).to.be.true;
    // });

    /**
     * TODO test does not work because CityBuilderStore.isVisible depends on the AppStatusStore within the
     *      CityBuilderStore which i have no idea how to mock this without changing the overall
     *      AppStatus store and changing the AppStatusStore would have side effects
     *      on other tests.
     */
    // it("should show scene on state change", () => {
    //     let localCityBuilderStore: CityBuilderStore = new CityBuilderStore();
    //     let localSceneStore: SceneStore = new SceneStore();
    //     let localAppStatusStore: AppStatusStore = new AppStatusStore();
    //
    //     localSceneStore.shapes = [];
    //
    //     const softvis3d = shallow(
    //         <Softvis3D cityBuilderStore={localCityBuilderStore}
    //                    sceneStore={localSceneStore} appStatusStore={localAppStatusStore}/>
    //     );
    //
    //     expect(softvis3d.contains(
    //         <Visualization cityBuilderStore={cityBuilderStore} sceneStore={sceneStore}/>)).to.be.true;
    // });

});