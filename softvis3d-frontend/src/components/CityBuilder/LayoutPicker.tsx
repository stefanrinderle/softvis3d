import * as React from "react";
import Layout from "../../classes/Layout";
import { RadioButton, RadioGroup } from "../ui/RadioButton";
import { CityBuilderConfig } from "../../stores/CityBuilder";
import { observer } from "mobx-react";

export interface LayoutPickerProps {
    layouts: Array<Layout>;
    store: CityBuilderConfig;
}

@observer export default class LayoutPicker extends React.Component<LayoutPickerProps, any> {

    public render() {
        let previewStyle = {
            backgroundImage: "url(" + this.props.store.layoutType.preview + ")"
        };

        return (
            <div className="layout-component">
                <div className={"preview"} style={previewStyle} />
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
            </div>
        );
    }
}
