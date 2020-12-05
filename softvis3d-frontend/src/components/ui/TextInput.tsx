import {ChangeEvent} from "react";
import * as React from "react";

type BoundChangeEvent = (event: ChangeEvent<HTMLInputElement>, src: React.Component<any, any>) => void;

interface TextInputProps {
    id: string;
    label: string;
    onChange: BoundChangeEvent;
    value: string;
}

export class TextInput extends React.Component<TextInputProps, any> {

    public handleChange(event: ChangeEvent<HTMLInputElement>): void {
        this.props.onChange(event, this);
    }

    public render() {
        return (
            <div>
                <span>{this.props.label}</span>
                <input type="text"
                       id={this.props.id}
                       name={this.props.id}
                       value={this.props.value}
                       className="text-input"
                       onChange={this.handleChange.bind(this)}/>
            </div>
        );
    }
}