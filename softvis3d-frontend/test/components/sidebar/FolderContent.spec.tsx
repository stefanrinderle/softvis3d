import * as React from "react";
import { assert, expect } from "chai";
import { mount, shallow } from "enzyme";
import { SceneStore } from "../../../src/stores/SceneStore";
import FolderContentElement from "../../../src/components/sidebar/FolderContentElement";
import FolderContent, { NodeListProps } from "../../../src/components/sidebar/FolderContent";
import * as Sinon from "sinon";
import { HtmlDom } from "../../../src/services/HtmlDom";

describe("<FolderContent/>", () => {

    it("should show siblings of the selected element as list", () => {
        let parent: TreeElement = createTestTreeElement("parent");
        let child1: TreeElement = createTestTreeElement("child1");
        let child2: TreeElement = createTestTreeElement("child2");

        parent.isNode = true;
        parent.children.push(child1);
        parent.children.push(child2);
        child1.parentId = parent.id;
        child2.parentId = parent.id;

        let localSceneStore: SceneStore = new SceneStore();
        localSceneStore.legacyData = parent;
        localSceneStore.selectedObjectId = child1.id;

        const sideBarLeafInfo = shallow(
            <FolderContent
                activeFolder={parent}
                sceneStore={localSceneStore}
            />
        );

        expect(sideBarLeafInfo.contains(
            <FolderContentElement
                element={child1}
                isSelected={true}
                sceneStore={localSceneStore}
            />
        )).to.be.true;

        expect(sideBarLeafInfo.contains(
            <FolderContentElement
                element={child2}
                isSelected={false}
                sceneStore={localSceneStore}
            />
        )).to.be.true;
    });

    it("should show children of the selected element as list", () => {
        let root: TreeElement = createTestTreeElement("root");
        let child1: TreeElement = createTestTreeElement("child1");
        let child2: TreeElement = createTestTreeElement("child2");

        root.isNode = true;
        root.children.push(child1);
        root.children.push(child2);

        let localSceneStore: SceneStore = new SceneStore();
        localSceneStore.legacyData = root;

        const selectedElementInfo = shallow(
            <FolderContent
                activeFolder={root}
                sceneStore={localSceneStore}
            />
        );

        expect(selectedElementInfo.find("ul.node-list")).to.have.length(1);

        expect(selectedElementInfo.contains(
            <FolderContentElement
                element={child1}
                isSelected={false}
                sceneStore={localSceneStore}/>)
        ).to.be.true;

        expect(selectedElementInfo.contains(
            <FolderContentElement
                element={child2}
                isSelected={false}
                sceneStore={localSceneStore}/>)
        ).to.be.true;
    });

    it("should mount component with dimension update", () => {
        const htmlDomGetHeightStub = Sinon.stub(HtmlDom, "getHeightById").callsFake(() => 123);
        const htmlDomGetOffsetStub = Sinon.stub(HtmlDom, "getOffsetsById").callsFake(() => ({top: 312, left: 111}));

        let windowStub = Sinon.stub(window, "addEventListener");

        let localSceneStore: SceneStore = new SceneStore();
        Sinon.spy(FolderContent.prototype, "componentDidMount");
        let wrapper = mount(<FolderContent
            activeFolder={null}
            sceneStore={localSceneStore}
        />);
        expect(FolderContent.prototype.componentDidMount).to.have.property("callCount", 1);

        expect(wrapper.state().listHeight).to.be.eq(123);

        assert(windowStub.called);
        windowStub.restore();
        htmlDomGetHeightStub.restore();
        htmlDomGetOffsetStub.restore();
    });

    it("should remove event listener on unmount", () => {
        let windowStub = Sinon.stub(window, "removeEventListener");

        let underTest: FolderContent = new FolderContent();
        underTest.componentWillUnmount();

        assert(windowStub.called);
        windowStub.restore();
    });

    it("should resize on component update", () => {
        let underTest: FolderContent = new FolderContent();

        let underTestSpy = Sinon.mock(underTest);
        underTestSpy.expects("onResize").once();

        let localSceneStore: SceneStore = new SceneStore();
        let prevProps: NodeListProps = {
            activeFolder: null,
            sceneStore: localSceneStore
        };

        underTest.props = {
            activeFolder: createTestTreeElement("root2"),
            sceneStore: localSceneStore
        };

        underTest.componentDidUpdate(prevProps);

        underTestSpy.verify();

        // do not resize if no change in active folder
        underTest.componentDidUpdate(underTest.props);

        underTestSpy.verify();
    });

});

function createTestTreeElement(name: string): TreeElement {
    return {
        id: name,
        name,
        isNode: false,

        children: [],

        measures: {},
        parentId: null
    };
}