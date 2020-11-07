import {injectable} from "inversify";
import {isUndefined} from "util";
import {lazyInject} from "../inversify.config";
import {AppStatusStore} from "../stores/AppStatusStore";
import SonarQubeComponentInfoService from "./sonarqube/SonarQubeComponentInfoService";

@injectable()
export default class AutoReloadService {

    // 5 minutes
    public static RELOAD_INTERVAL_MS = 5 * 60 * 1000;

    private appStatusStore: AppStatusStore;
    @lazyInject("SonarQubeComponentInfoService")
    private readonly componentInfoService!: SonarQubeComponentInfoService;
    private timer?: number;

    constructor(appStatusStore: AppStatusStore) {
        this.appStatusStore = appStatusStore;
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