import * as React from "react";

interface Option {
    label: string;
    value: string;
}

export interface DropdownProps {
    defaultOption?: string;
    defaultValue?: string;
    name: string
    options: Array<Option>;
}

export default class Dropdown extends React.Component<DropdownProps, any>
{
    public render() {
        let defOption: any = null;
        if (this.props.defaultOption) {
            defOption = <option value="">{this.props.defaultOption}</option>;
        }

        return (
            <select name={this.props.name} defaultValue={this.props.defaultValue}>
                {defOption}
                {
                    this.props.options.map(
                        (o) =>
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                    )
                }
            </select>
        );
    }
}