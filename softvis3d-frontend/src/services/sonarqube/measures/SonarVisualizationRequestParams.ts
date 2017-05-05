export class SonarVisualizationRequestParams {

    public readonly metrics: string;

    constructor(metrics: string) {
        this.metrics = metrics;
    }

    public equals(candidate: SonarVisualizationRequestParams): boolean {
        return this.metrics === candidate.metrics;
    }

}