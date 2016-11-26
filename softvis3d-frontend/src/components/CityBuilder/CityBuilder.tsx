import * as React from "react";
import LayoutPicker from "./LayoutPicker";
import PropertyPicker from "./PropertyPicker";
import {district, evostreet} from "../../dtos/Layouts";
import {CityBuilderStore} from "../../stores/CityBuilderStore";
import Category from "../ui/Category";
import {demo, custom} from "../../dtos/Profiles";
import * as softvisActions from "../../events/EventInitiator";

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

                <br />
                <hr />
                <br />
                <button onClick={this.fakeLoader}>Fake Loading</button>
                &nbsp;
                <button onClick={this.hideBuilder}>Hide Builder</button>
            </div>
        );
    }

    private fakeLoader() {
        softvisActions.loadAvailableMetrics();
        softvisActions.loadAvailableMetrics();
        softvisActions.loadAvailableMetrics();

        window.setTimeout(
            softvisActions.availableMetricsLoaded,
            1000
        );
        window.setTimeout(
            softvisActions.availableMetricsLoaded,
            2000
        );
        window.setTimeout(
            softvisActions.availableMetricsLoaded,
            3500
        );
    }

    private hideBuilder() {
        softvisActions.createScene();
        window.setTimeout(
            softvisActions.sceneSuccessfullyCreated,
            500
        );
    }
}
