import * as React from "react";

interface KeyLegendProps {
    show?: boolean;
}

export class KeyLegend extends React.Component<KeyLegendProps, any> {

    public static defaultProps = {
        show: true
    };

    public render() {
        const {show} = this.props;

        if (!show) {
            return <div />;
        }

        return (
            <div className="key-legend">
                <table>
                    <tbody>
                        <tr>
                            <td><div className="mouse-key mouse-left" /></td>
                            <td><span>Rotate</span></td>
                        </tr>
                        <tr>
                            <td><div className="mouse-key mouse-middle" /></td>
                            <td><span>Zoom</span></td>
                        </tr>
                        <tr>
                            <td><div className="mouse-key mouse-right" /></td>
                            <td><span>Move</span></td>
                        </tr>
                        <tr>
                            <td><div className="keyboard-key">R</div></td>
                            <td><span>Reset Camera</span></td>
                        </tr>
                        <tr>
                            <td><div className="keyboard-key">L</div></td>
                            <td><span>Toggle Legend</span></td>
                        </tr>
                        <tr>
                            <td><div className="keyboard-key">C</div></td>
                            <td><span>Toggle Color Theme</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}
