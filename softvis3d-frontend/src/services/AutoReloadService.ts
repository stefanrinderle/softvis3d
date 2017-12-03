import { AppStatusStore } from "../stores/AppStatusStore";
import SonarQubeComponentInfoService from "./sonarqube/SonarQubeComponentInfoService";
import { isUndefined } from "util";

export default class AutoReloadService {

    // 5 minutes
    public static RELOAD_INTERVAL_MS = 5 * 60 * 1000;

    private appStatusStore: AppStatusStore;
    private componentInfoService: SonarQubeComponentInfoService;
    private timer: number | undefined;

    constructor(appStatusStore: AppStatusStore, componentInfoService: SonarQubeComponentInfoService) {
        this.appStatusStore = appStatusStore;
        this.componentInfoService = componentInfoService;
    }

    public startAutoReload(): void {
        if (this.timer) {
            window.clearInterval(this.timer);
        }

        // only start the timer if the analysisDate value is available.
        if (!isUndefined(this.appStatusStore.analysisDate)) {
            this.timer = window.setInterval(this.updateAnalysisDate.bind(this), AutoReloadService.RELOAD_INTERVAL_MS);
        }
    }

    public isActive(): boolean {
        return !isUndefined(this.timer);
    }

    public updateAnalysisDate() {
        this.componentInfoService.loadComponentInfo().then((result) => {
            if (!this.appStatusStore.analysisDate || this.appStatusStore.analysisDate.getTime() !== result.analysisDate.getTime()) {
                this.appStatusStore.analysisDate = result.analysisDate;
            }
        });
    }
}