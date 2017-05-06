import * as React from "react";
import { CityBuilderStore } from "../../stores/CityBuilderStore";
import { PreviewPicture } from "../../classes/PreviewPicture";

export default class PreviewPictureComponent extends React.Component<{ store: CityBuilderStore; }, any> {

    public render() {
        const preview: PreviewPicture = this.props.store.getPreviewBackground();

        const previewStyle = {
            backgroundImage: "url(" + preview.bgPicture + ")"
        };

        return (
            <div className={"preview"} style={previewStyle}>
            </div>
        );
    }

}