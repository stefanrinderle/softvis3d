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
import UrlParameterService, {Parameters} from "../../src/services/UrlParameterService";

describe("UrlParameterService", () => {

    it("Extracts the parameters properly", () => {
        let result: Parameters = UrlParameterService.getQueryParams("?test=123&test3=bla&metricWidth=13");

        expect(result.test).to.contain("123");
        expect(result.test3).to.contain("bla");
        expect(result.metricWidth).to.contain("13");
    });

    it("Extracts the parameters properly on single property", () => {
        let result: Parameters = UrlParameterService.getQueryParams("?test=123");

        expect(result.test).to.contain("123");
    });

    it("Visualization link based on already existing params", () => {
        let href: string = "http://localhost:9000/plugins/resource/rinderle%3AklamottenwetterWeb?page=SoftVis3D";

        let params: Parameters = {
            test1: "test1Value",
            test2: "test2Value"
        };
        let result = UrlParameterService.createVisualizationLinkForCurrentUrl(href, params);

        expect(result).to.be.eq("http://localhost:9000/plugins/resource/rinderle%3AklamottenwetterWeb" +
            "?page=SoftVis3D&test1=test1Value&test2=test2Value");
    });

    it("Visualization link based on local dev env", () => {
        let href: string = "http://localhost:8080";

        let params: Parameters = {
            test1: "test1Value",
            test2: "test2Value"
        };
        let result = UrlParameterService.createVisualizationLinkForCurrentUrl(href, params);

        expect(result).to.be.eq("http://localhost:8080?test1=test1Value&test2=test2Value");
    });

    it("Visualization link should override properties", () => {
        let href: string = "http://localhost:8080?test1=YYY&test2=XXX";

        let params: Parameters = {
            test1: "test1Value",
            test2: "test2Value"
        };
        let result = UrlParameterService.createVisualizationLinkForCurrentUrl(href, params);

        expect(result).to.be.eq("http://localhost:8080?test1=test1Value&test2=test2Value");
    });
});
