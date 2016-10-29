import * as React from "react";

interface CategoryProps {
    className: string;
    label: string;
}

export default class Category extends React.Component<CategoryProps, any> {

    public render() {
        return (
            <div className={this.props.className}>
                <fieldset>
                    <legend>{this.props.label}</legend>
                        {this.props.children}
                </fieldset>
            </div>
        );
    }
}
