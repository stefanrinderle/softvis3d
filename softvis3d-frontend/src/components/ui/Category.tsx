import * as React from "react";

interface CategoryProps {
    className?: string;
    label: string;
    toggle?: boolean|null;
}

export default class Category extends React.Component<CategoryProps, any> {
    public static defaultProps = {
        className: "",
        toggle: null
    };

    public render() {
        return (
            <div className={this.getClassName()}>
                <fieldset>
                    <legend>{this.props.label}</legend>
                        {this.props.children}
                </fieldset>
            </div>
        );
    }

    private getClassName() {
        let classes: string[] = [];

        if (this.props.className) {
            classes.push(this.props.className);
        }

        if (this.props.toggle !== null) {
            classes.push("collapsable");
        }

        if (this.props.toggle !== null && !this.props.toggle) {
            classes.push("collapsed");
        }

        return classes.join(" ");
    }
}
