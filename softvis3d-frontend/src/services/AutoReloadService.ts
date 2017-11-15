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

        this.timer = window.setInterval(this.loadComponentInfo, AutoReloadService.RELOAD_INTERVAL_MS);
    }

    public isActive(): boolean {
        return !isUndefined(this.timer);
    }

    public loadComponentInfo() {
        this.componentInfoService.loadComponentInfo().then((result) => {
            this.appStatusStore.analysisDate = result.analysisDate;
        });
    }
}