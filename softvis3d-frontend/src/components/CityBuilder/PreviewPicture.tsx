import * as React from "react";

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