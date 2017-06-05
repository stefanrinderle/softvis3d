import Profile from "./Profile";
import Layout from "./Layout";

export class PreviewPicture {

    public readonly bgPicture: string;

    private layout?: Layout;
    private profile?: Profile;

    constructor(bgPicture: string, layout?: Layout, profile?: Profile) {
        this.layout = layout;
        this.profile = profile;
        this.bgPicture = bgPicture;
    }

    public forLayout(l: Layout): boolean {
        if (this.layout) {
            return l.id === this.layout.id;
        } else {
            return false;
        }
    }

    public forProfile(p: Profile): boolean {
        if (this.profile) {
            return p.id === this.profile.id;
        } else {
            return false;
        }
    }

}