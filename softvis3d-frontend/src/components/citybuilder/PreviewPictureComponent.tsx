import * as React from "react";
import { CityBuilderStore } from "../../stores/CityBuilderStore";
import { PreviewPicture } from "../../classes/PreviewPicture";

export interface PreviewPictureComponentProps {
    store: CityBuilderStore;
    baseUrl?: string;
}

export default class PreviewPictureComponent extends React.Component<PreviewPictureComponentProps, any> {

    public render() {
        const preview: PreviewPicture = this.props.store.getPreviewBackground();

        let url: string = preview.bgPicture;
        if (this.props.baseUrl) {
            url = this.props.baseUrl + url;
        }

        const previewStyle = {
            backgroundImage: "url(" + url + ")"
        };

        return (
            <div className={"preview"} style={previewStyle}>
            </div>
        );
    }

}