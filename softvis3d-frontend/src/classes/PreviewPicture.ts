import Profile from "./Profile";
import Layout from "./Layout";

export interface PreviewPicture {
    forLayout: (l: Layout) => boolean;
    forProfile: (p: Profile) => boolean;
    bgPicture: string;
}