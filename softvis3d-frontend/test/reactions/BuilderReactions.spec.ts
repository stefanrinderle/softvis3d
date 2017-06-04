///
/// softvis3d-frontend
/// Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
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
import {expect} from "chai";
import {CityBuilderStore} from "../../src/stores/CityBuilderStore";
import BuilderReactions from "../../src/reactions/BuilderReactions";
import * as Sinon from "sinon";
import SonarQubeMeasuresService from "../../src/services/sonarqube/measures/SonarQubeMeasuresService";
import {bindMock} from "../Helper";

describe("BuilderReactions", () => {

    it("should initiate build process", () => {
        let testCityBuilderStore = new CityBuilderStore();
        const testSonarService = Sinon.createStubInstance(SonarQubeMeasuresService) as any;
        bindMock("SonarQubeMeasuresService", testSonarService);

        const reactionRegister =
            new BuilderReactions(testCityBuilderStore);

        expect(testSonarService.loadMeasuresInitial.notCalled).to.be.true;

        testCityBuilderStore.initiateBuildProcess = true;

        expect(reactionRegister).not.to.be.null;
        expect(testCityBuilderStore.initiateBuildProcess).to.be.false;
        expect(testSonarService.loadMeasuresInitial.calledOnce).to.be.true;
    });

});