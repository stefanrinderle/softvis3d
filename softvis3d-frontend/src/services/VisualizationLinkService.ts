///
/// softvis3d-frontend
/// Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
/// stefan@rinderle.info / yvo.niedrich@gmail.com
///
/// This program is free software; you can redistribute it and/or
/// modify it under the terms of the GNU Lesser General Public
/// License as published by the Free Software Foundation; either
/// version 3 of the License, or (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
/// Lesser General Public License for more details.
///
/// You should have received a copy of the GNU Lesser General Public
/// License along with this program; if not, write to the Free Software
/// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
///

import VisualizationLinkParams from "../classes/VisualizationLinkParams";
import { lazyInject } from "../inversify.config";
import CityBuilderStore from "../stores/CityBuilderStore";
import ComponentStatusStore from "../stores/ComponentStatusStore";
import SceneStore from "../stores/SceneStore";
import VisualizationOptionStore from "../stores/VisualizationOptionStore";
import { default as UrlParameterService, Parameters } from "./UrlParameterService";
import VisualizationLinkSerializationService from "./VisualizationLinkSerializationService";

export default class VisualizationLinkService {
    @lazyInject("SceneStore")
    private readonly sceneStore!: SceneStore;
    @lazyInject("CityBuilderStore")
    private readonly cityBuilderStore!: CityBuilderStore;
    @lazyInject("VisualizationOptionStore")
    private readonly visualizationOptions!: VisualizationOptionStore;
    @lazyInject("ComponentStatusStore")
    private readonly componentStatusStore!: ComponentStatusStore;

    @lazyInject("UrlParameterService")
    private readonly urlParameterService!: UrlParameterService;
    @lazyInject("VisualizationLinkSerializationService")
    private readonly visualizationLinkSerializationService!: VisualizationLinkSerializationService;

    public process(search: string) {
        const params: Parameters = this.urlParameterService.getQueryParams(search);

        const input = params.visualizationStatus;
        if (input && input !== "") {
            const visualizationLinkParams = this.visualizationLinkSerializationService.deserialize(
                input
            );

            if (visualizationLinkParams) {
                this.applyParams(visualizationLinkParams);

                this.cityBuilderStore.show = false;
                this.cityBuilderStore.initiateBuildProcess = true;
            }
        }
    }

    public createVisualizationLink(): string {
        const params = this.createCurrentParams();
        return this.urlParameterService.createVisualizationLinkForCurrentUrl(
            document.location.href,
            params
        );
    }

    public createPlainVisualizationLink(): string {
        let baseUrl = "";
        if (this.componentStatusStore.appConfiguration.baseUrl) {
            baseUrl = this.componentStatusStore.appConfiguration.baseUrl;
        }

        const baseLocation =
            baseUrl +
            "/static/softvis3d/index.html" +
            "?projectKey=" +
            this.componentStatusStore.appConfiguration.projectKey +
            "&baseUrl=" +
            baseUrl;

        const params = this.createCurrentParams();
        return this.urlParameterService.createVisualizationLinkForCurrentUrl(baseLocation, params);
    }

    private createCurrentParams(): Parameters {
        if (!this.sceneStore.cameraPosition) {
            throw new Error(
                "sceneStore.cameraPosition is undefined or null on createVisualizationLink"
            );
        }

        const visualizationLinkParams: VisualizationLinkParams = new VisualizationLinkParams(
            this.visualizationOptions,
            this.sceneStore.selectedObjectKey,
            this.sceneStore.cameraPosition
        );

        return {
            visualizationStatus: this.visualizationLinkSerializationService.serialize(
                visualizationLinkParams
            ),
        };
    }

    private applyParams(visualizationLinkParams: VisualizationLinkParams) {
        this.visualizationOptions.profile = visualizationLinkParams.visualizationOptions.profile;
        this.visualizationOptions.layout = visualizationLinkParams.visualizationOptions.layout;
        this.visualizationOptions.metricColor =
            visualizationLinkParams.visualizationOptions.metricColor;
        this.visualizationOptions.buildingColorTheme =
            visualizationLinkParams.visualizationOptions.buildingColorTheme;
        this.visualizationOptions.colorTheme =
            visualizationLinkParams.visualizationOptions.colorTheme;
        this.visualizationOptions.fileFilter =
            visualizationLinkParams.visualizationOptions.fileFilter;

        this.sceneStore.selectedObjectKey = visualizationLinkParams.selectedObjectKey;
        this.sceneStore.cameraPosition = visualizationLinkParams.cameraPosition;
    }
}
