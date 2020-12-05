import {observer} from "mobx-react";
import * as React from "react";
import Layout from "../../classes/Layout";
import CityBuilderStore from "../../stores/CityBuilderStore";
import {RadioButton} from "../ui/RadioButton";
import {RadioGroup} from "../ui/RadioGroup";

export interface LayoutPickerProps {
    layouts: Layout[];
    store: CityBuilderStore;
}

@observer
export default class LayoutPicker extends React.Component<LayoutPickerProps, any> {

    public render() {
        const {layouts, store} = this.props;
        return (
            <div className="layout-component">
                <RadioGroup
                    onChange={(l: Layout) => { store.options.layout = l; }}
                    value={store.options.layout}
                    className={"list"}
                >
                    { this.mapLayouts(layouts) }
                </RadioGroup>
            </div>
        );
    }

    private mapLayouts(l: Layout[]): RadioButton[] {
        return l.map(
            (layout) => <RadioButton
                key={layout.id}
                value={layout}
                label={layout.label}
            />
        ) as any[];
    }
}
