import * as React from "react";
import {observer} from "mobx-react";
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import Category from "../ui/Category";
import PropertyPicker from "./PropertyPicker";

@observer export default class OptionsAdvanced extends React.Component<{ store: CityBuilderStore; }, any> {
    public render() {
        return (
            <Category label="Advanced Options" className="advanced">
                <PropertyPicker
                    profiles={[]}
                    store={this.props.store}
                />
            </Category>
        );
    }
}