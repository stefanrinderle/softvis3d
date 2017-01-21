import {Profile} from "./Profile";

export interface PreviewPicture {
    forLayout: (l: Layout) => boolean;
    forProfile: (p: Profile) => boolean;
    bgPicture: string;
    contents: null|string|ReactElement<any>;
}