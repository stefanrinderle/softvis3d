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
import { lazyInject } from "../inversify.config";
import CityLayoutService from "../services/layout/CityLayoutService";
import CityBuilderStore from "../stores/CityBuilderStore";
import SceneStore from "../stores/SceneStore";

export default class SceneReactions {
    private readonly sceneStore: SceneStore;

    @lazyInject("CityBuilderStore")
    private readonly cityBuilderStore!: CityBuilderStore;
    @lazyInject("CityLayoutService")
    private readonly cityLayoutService!: CityLayoutService;

    constructor(scene: SceneStore) {
        this.sceneStore = scene;
        this.prepareReactions();
    }

    private prepareReactions() {
        reaction(
            () => this.cityBuilderStore.options.metricColor,
            () => {
                if (!this.cityBuilderStore.show) {
                    this.cityLayoutService.createCity(this.sceneStore);
                }
            },
            {
                name: "Transfer the chosen color from the scene to the builder and rebuild city",
            }
        );

        reaction(
            () => this.sceneStore.projectData,
            () => {
                this.cityLayoutService.createCity(this.sceneStore);
            },
            {
                name: "Convert backend data to threeJS shapes",
            }
        );
    }
}
