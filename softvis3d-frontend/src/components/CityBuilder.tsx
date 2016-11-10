import * as React from "react";
import LayoutPicker from "./CityBuilder/LayoutPicker";
import PropertyPicker from "./CityBuilder/PropertyPicker";
import { district, evostreet } from "../classes/Layout";
import { CityBuilderConfig } from "../stores/CityBuilder";
import Category from "./ui/Category";

export default class CityBuilder extends React.Component<{ store: CityBuilderConfig; }, any> {

    public render() {
        return (
            <div className="city-builder">
                <Category label={"Building"} className="building">
                    <PropertyPicker store={this.props.store} />
                </Category>

                <Category label={"Layouts"} className="layout">
                    <LayoutPicker
                        layouts={[district, evostreet]}
                        store={this.props.store}
                    />
                </Category>

            </div>
        );
    }
}
