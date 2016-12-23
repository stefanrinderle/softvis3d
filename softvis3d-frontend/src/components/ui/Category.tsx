import * as React from "react";

interface CategoryProps {
    className?: string;
    label: string;
    toggle?: boolean;
    initialVisibility?: boolean;
}

interface CategoryStates {
    visible: boolean;
}

export default class Category extends React.Component<CategoryProps, CategoryStates> {

    public static defaultProps = {
        className: "",
        toggle: false,
        initialVisibility: true
    };

    public componentWillMount() {
        this.setState({
            visible: (this.props.initialVisibility as boolean)
        });
    }

    public render() {
        return (
            <fieldset className={this.getClassName()}>
                <legend onClick={() => this.toggleVisibility()}>{this.props.label}</legend>
                <div className="category-content">
                    {this.props.children}
                </div>
            </fieldset>
        );
    }

    private getClassName() {
        const {toggle, className} = this.props;
        let classes: string[] = [];

        if (className) {
            classes.push(className);
        }

        if (toggle) {
            classes.push("collapsable");

            if (!this.state.visible) {
                classes.push("collapsed");
            }
        }

        return classes.join(" ");
    }

    private toggleVisibility(): void {
        this.setState({
            visible: !this.state.visible
        });
    }
}
