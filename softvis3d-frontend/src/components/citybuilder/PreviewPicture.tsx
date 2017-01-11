import * as React from "react";
import {customDistrict, customEvostreet, placeholder} from "../../constants/PreviewPictures";

export interface PreviewPictureProps {
    profile: Profile;
    layout: Layout;
}

export default class PreviewPictureComponent extends React.Component<PreviewPictureProps, any> {
    private availablePreviewPictures: PreviewPicture[];

    constructor(props: PreviewPictureProps) {
        super(props);
        this.availablePreviewPictures = [
            customDistrict,
            customEvostreet,
            placeholder
        ];
    }

    public render() {
        const preview: PreviewPicture = this.getPreviewBackground();

        let previewStyle = {
            backgroundImage: "url(" + preview.bgPicture + ")"
        };

        return (
            <div className={"preview"} style={previewStyle}>
                {preview.contents}
            </div>
        );
    }

    private getPreviewBackground(): PreviewPicture {
        const {layout, profile} = this.props;
        for (let preview of this.availablePreviewPictures) {
            if (preview.forLayout(layout) && preview.forProfile(profile)) {
                return preview;
            }
        }

        return placeholder;
    }
}