export class AppConfiguration {
    public readonly baseUrl?: string;
    public readonly projectKey: string;
    public readonly isDev: boolean;

    constructor(projectKey: string, isDev: boolean, baseUrl?: string) {
        this.baseUrl = baseUrl;
        this.projectKey = projectKey;
        this.isDev = isDev;
    }
}