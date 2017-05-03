export class SonarVisualizationRequestParams {

    public readonly projectKey: string;
    public readonly metrics: string;

    constructor(projectKey: string, metrics: string) {
        this.projectKey = projectKey;
        this.metrics = metrics;
    }

    public equals(candidate: SonarVisualizationRequestParams): boolean {
        if (candidate) {
            return this.projectKey === candidate.projectKey && this.metrics === candidate.metrics;
        } else {
            return false;
        }
    }

}