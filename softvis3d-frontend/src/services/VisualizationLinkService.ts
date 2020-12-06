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

import { AppConfiguration } from "../classes/AppConfiguration";
import VisualizationLinkParams from "../classes/VisualizationLinkParams";
import VisualizationLinkSerializationService from "../classes/VisualizationLinkSerializationService";
import { lazyInject } from "../inversify.config";
import CityBuilderStore from "../stores/CityBuilderStore";
import SceneStore from "../stores/SceneStore";
import { default as UrlParameterService, Parameters } from "./UrlParameterService";

export default class VisualizationLinkService {
    @lazyInject("UrlParameterService")
    private readonly urlParameterService!: UrlParameterService;
    @lazyInject("VisualizationLinkSerializationService")
    private readonly visualizationLinkSerializationService!: VisualizationLinkSerializationService;

    private config: AppConfiguration;

    constructor(config: AppConfiguration) {
        this.config = config;
    }

    public process(cityBuilderStore: CityBuilderStore, sceneStore: SceneStore, search: string) {
        const params: Parameters = this.urlParameterService.getQueryParams(search);

        const input = params.visualizationStatus;
        if (input && input !== "") {
            const visualizationLinkParams = this.visualizationLinkSerializationService.deserialize(
                input
            );

            if (visualizationLinkParams) {
                this.applyParams(cityBuilderStore, sceneStore, visualizationLinkParams);

                cityBuilderStore.show = false;
                cityBuilderStore.initiateBuildProcess = true;
            }
        }
    }

    public createVisualizationLink(
        cityBuilderStore: CityBuilderStore,
        sceneStore: SceneStore
    ): string {
        const params = this.createCurrentParams(cityBuilderStore, sceneStore);
        return this.urlParameterService.createVisualizationLinkForCurrentUrl(
            document.location.href,
            params
        );
    }

    public createPlainVisualizationLink(
        cityBuilderStore: CityBuilderStore,
        sceneStore: SceneStore
    ): string {
        let baseUrl = "";
        if (this.config.baseUrl) {
            baseUrl = this.config.baseUrl;
        }

        const baseLocation =
            baseUrl +
            "/static/softvis3d/index.html" +
            "?projectKey=" +
            this.config.projectKey +
            "&baseUrl=" +
            baseUrl;

        const params = this.createCurrentParams(cityBuilderStore, sceneStore);
        return this.urlParameterService.createVisualizationLinkForCurrentUrl(baseLocation, params);
    }

    private createCurrentParams(
        cityBuilderStore: CityBuilderStore,
        sceneStore: SceneStore
    ): Parameters {
        if (!sceneStore.cameraPosition) {
            throw new Error(
                "sceneStore.cameraPosition is undefined or null on createVisualizationLink"
            );
        }

        const visualizationLinkParams: VisualizationLinkParams = new VisualizationLinkParams(
            cityBuilderStore.options,
            sceneStore.selectedObjectId,
            sceneStore.cameraPosition
        );

        return {
            visualizationStatus: this.visualizationLinkSerializationService.serialize(
                visualizationLinkParams
            ),
        };
    }

    private applyParams(
        cityBuilderStore: CityBuilderStore,
        sceneStore: SceneStore,
        visualizationLinkParams: VisualizationLinkParams
    ) {
        cityBuilderStore.options = visualizationLinkParams.visualizationOptions;

        sceneStore.selectedObjectId = visualizationLinkParams.selectedObjectId;
        sceneStore.cameraPosition = visualizationLinkParams.cameraPosition;
    }
}
