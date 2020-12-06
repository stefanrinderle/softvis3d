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

import {observable} from "mobx";
import {noMetric} from "../constants/Metrics";
import Metric from "./Metric";
import Scale from "./Scale";

export default class Profile implements SelectOptionValue {
    public readonly id: string;
    public readonly label: string;
    public readonly description: string;
    @observable
    public heightMetric: Metric;
    @observable
    public footprintMetric: Metric;
    @observable
    public scale: Scale;

    constructor(id: string, label: string, description: string, heightMetric: Metric, footprintMetric: Metric, scale: Scale) {
        this.id = id;
        this.label = label;
        this.description = description;
        this.heightMetric = heightMetric;
        this.footprintMetric = footprintMetric;
        this.scale = scale;
    }

    public updateConfiguration(footprintMetric: Metric, heightMetric: Metric, scale: Scale): void {
        this.heightMetric = heightMetric;
        this.footprintMetric = footprintMetric;
        this.scale = scale;
    }

    public clone(): Profile {
        return new ProfileBuilder(this.id, this.label)
            .withConfiguration(this.footprintMetric, this.heightMetric, this.scale)
            .withDescription(this.description)
            .build();
    }
}

export class ProfileBuilder {

    public id: string;
    public name: string;
    public heightMetric: Metric;
    public footprintMetric: Metric;
    public scale: Scale;
    public description: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;

        this.heightMetric = noMetric;
        this.footprintMetric = noMetric;
        this.scale = new Scale("none", "None", "");
        this.description = "";
    }

    public withConfiguration(footprintMetric: Metric, heightMetric: Metric, scale: Scale): ProfileBuilder {
        this.heightMetric = heightMetric;
        this.footprintMetric = footprintMetric;
        this.scale = scale;
        return this;
    }

    public withDescription(description: string): ProfileBuilder {
        this.description = description;
        return this;
    }

    public build(): Profile {
        return new Profile(this.id, this.name, this.description, this.heightMetric, this.footprintMetric, this.scale);
    }

}