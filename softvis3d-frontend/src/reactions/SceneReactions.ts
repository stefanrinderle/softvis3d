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

import { reaction } from "mobx";
import VisualizationOptionStore from "../stores/VisualizationOptionStore";
import { lazyInject } from "../inversify.config";
import CityLayoutService from "../services/layout/CityLayoutService";
import CityBuilderStore from "../stores/CityBuilderStore";
import SceneStore from "../stores/SceneStore";

export default class SceneReactions {
    @lazyInject("SceneStore")
    private readonly sceneStore!: SceneStore;
    @lazyInject("CityBuilderStore")
    private readonly cityBuilderStore!: CityBuilderStore;
    @lazyInject("VisualizationOptionStore")
    private readonly visualizationOptions!: VisualizationOptionStore;
    @lazyInject("CityLayoutService")
    private readonly cityLayoutService!: CityLayoutService;

    constructor() {
        this.prepareReactions();
    }

    private prepareReactions() {
        reaction(
            () => this.visualizationOptions.metricColor,
            () => {
                if (!this.cityBuilderStore.show) {
                    this.cityLayoutService.createCity();
                }
            },
            {
                name: "Transfer the chosen color from the scene to the builder and rebuild city",
            }
        );

        reaction(
            () => this.sceneStore.projectData,
            () => {
                this.cityLayoutService.createCity();
            },
            {
                name: "Convert backend data to threeJS shapes",
            }
        );
    }
}
