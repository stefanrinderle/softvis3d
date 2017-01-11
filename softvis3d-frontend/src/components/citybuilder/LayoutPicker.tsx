import * as React from "react";
import {observer} from "mobx-react";
import { RadioButton, RadioGroup } from "../ui/RadioButton";
import {CityBuilderStore} from "../../stores/CityBuilderStore";

export interface LayoutPickerProps {
    layouts: Layout[];
    store: CityBuilderStore;
}

@observer
export default class LayoutPicker extends React.Component<LayoutPickerProps, any> {

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
            </div>
        );
    }
}
