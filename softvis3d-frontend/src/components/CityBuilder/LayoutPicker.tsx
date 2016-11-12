import * as React from "react";
import {observer} from "mobx-react";
import { RadioButton, RadioGroup } from "../ui/RadioButton";
import {CityBuilderConfig} from "../../stores/CityBuilder";
import PreviewPicture from "./PreviewPicture";

export interface LayoutPickerProps {
    layouts: Array<Layout>;
    store: CityBuilderConfig;
}

@observer export default class LayoutPicker extends React.Component<LayoutPickerProps, any> {

    public render() {
        return (
            <div className="layout-component">
                <RadioGroup
                    onChange={this.props.store.setLayout.bind(this.props.store)}
                    value={this.props.store.layoutType}
                    className={"list"}
                >
                    {
                        this.props.layouts.map(
                            (layout) => <RadioButton
                                key={layout.id}
                                value={layout}
                                label={layout.name}
                            />
                        )
                    }
                </RadioGroup>
                <PreviewPicture
                    profile={this.props.store.profile}
                    layout={this.props.store.layoutType}
                />
            </div>
        );
    }
}
