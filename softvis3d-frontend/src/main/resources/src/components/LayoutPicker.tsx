import * as React from "react";

interface Layout {
    value: string;
    label: string;
    img: string;
}

interface LayoutListElement extends Layout {
    name: string;
}

interface LayoutRadioButtonProps extends LayoutListElement {
    checked: boolean;
    onChange: (key: string, img: string) => void;
}

class RadioButton extends React.Component<LayoutRadioButtonProps, any>
{
    public onChange() {
        this.props.onChange(this.props.value, this.props.img);
    }

    public render() {
        const uiKey = this.props.name + "-" + this.props.value;
        const className = "option" + (this.props.checked ? " active": "");
        return (
            <div className={className} onClick={this.onChange.bind(this)}>
                <input
                    id={uiKey}
                    type="radio"
                    name={this.props.name}
                    value={this.props.value}
                    checked={this.props.checked}
                    onChange={this.onChange.bind(this)}
                />
                <label htmlFor={uiKey}>{this.props.label}</label>
            </div>
        );
    }
}

interface LayoutListProp {
    drawImage: (img: string) => void;
    list: Array<LayoutListElement>;
}

class LayoutList extends React.Component<LayoutListProp, any>
{
    public constructor(props: LayoutListProp) {
        super(props);
        this.state = {
            active: null
        }
    }

    public onChange(key: string, img: string) {
        this.setState({active: key});
        this.props.drawImage(img);
    }

    public render() {
        return (
            <div className="list">{
                this.props.list.map(
                    (t) => <RadioButton key={t.value} checked={this.state.active === t.value} onChange={this.onChange.bind(this)} {...t} />
                )
            }</div>
        );
    }
}

class LayoutPreview extends React.Component<{img: string;}, any>
{
    public render () {
        let inline: any = {};
        if (this.props.img) {
            inline.backgroundImage = "url(" + this.props.img + ")";
        }

        return (
            <div className="preview" style={inline} />
        );
    }
}

export interface LayoutPickerProps {
    name: string;
    layouts: Array<Layout>;
}

export default class LayoutPicker extends React.Component<LayoutPickerProps, any>
{
    public constructor(props: LayoutPickerProps) {
        super(props);
        this.state = { img: '' }
    }

    public drawImage(img: string): void {
        this.setState({img: img});
    }

    public render() {
        const layouts = this.props.layouts.map(
            (t) => Object.assign({ name: this.props.name }, t)
        );
        return (
            <div className="layout-component">
                <LayoutList list={layouts} drawImage={this.drawImage.bind(this)} />
                <LayoutPreview img={this.state.img} />
            </div>
        );
    }
}
