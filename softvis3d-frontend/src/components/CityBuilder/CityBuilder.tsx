import * as React from "react";
import LayoutPicker from "./LayoutPicker";
import PropertyPicker from "./PropertyPicker";
import {district, evostreet} from "../../dtos/Layouts";
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import Category from "../ui/Category";
import {demo, custom} from "../../dtos/Profiles";

export default class CityBuilder extends React.Component<{ store: CityBuilderStore; }, any> {

    public render() {
        return (
            <div className="city-builder">

                <Category label={"Building Properties"} className="building">
                    <PropertyPicker
                        profiles={[demo, custom]}
                        store={this.props.store}
                    />
                </Category>

                <Category label={"City Layout"} className="layout">
                    <LayoutPicker
                        layouts={[district, evostreet]}
                        store={this.props.store}
                    />
                </Category>

            </div>
        );
    }
}
