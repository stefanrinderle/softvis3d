import * as React from "react";
import LayoutPicker, {LayoutPickerProps} from "./LayoutPicker";
import Dropdown, {DropdownProps} from "./PropertyPicker";
import {TreeService} from "../layout/TreeService";

const test: DropdownProps = {
    defaultOption: "Choose!!!",
    defaultValue: "test1",
    name: "test",
    options: [
        {
            label: "Test1",
            value: "test1"
        },
        {
            label: "Test2",
            value: "test2"
        },
        {
            label: "Test3",
            value: "test3"
        }
    ]
};


export default class CityBuilder extends React.Component<LayoutPickerProps, any> {

    public render() {
        console.log(TreeService.Instance);
        console.log(TreeService.Instance.searchTreeNode("123"));
        return (
            <div className="city-builder">
                <div className="building">
                    <fieldset>
                        <legend>Building</legend>
                        <Dropdown {...test} /><br />
                        <Dropdown {...test} />
                    </fieldset>
                </div>
                <div className="layout">
                    <fieldset>
                        <legend>Layout</legend>
                        <LayoutPicker {...this.props} />
                    </fieldset>
                </div>
            </div>
        );
    }
}
