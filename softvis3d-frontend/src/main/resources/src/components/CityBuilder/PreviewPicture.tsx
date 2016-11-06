import * as React from "react";
import Profile from "../../classes/Profile";
import Layout from "../../classes/Layout";

export interface PreviewPictureProps {
    profile: Profile;
    layout: Layout;
}

export default class PreviewPicture extends React.Component<PreviewPictureProps, any> {

    public render() {
        let previewStyle = {
            backgroundImage: "url(" + this.getPreviewBackground() + ")"
        };

        return (
            <div className={"preview"} style={previewStyle} />
        );
    }

    private getPreviewBackground() {
        const {layout} = this.props;
        return layout.preview;
    }
}