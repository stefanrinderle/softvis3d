///
/// softvis3d-sonarqube-it
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

///<reference path="../typings/jasmine/jasmine.d.ts"/>
///<reference path="../typings/angular-protractor/angular-protractor.d.ts"/>

function waitFor(selector) {
    return browser.wait(function() {
        return browser.isElementPresent(selector);
    }, 10000);
}

describe("Index", () => {

    beforeEach(() => {
        browser.get("/projects");
        waitFor(by.css(".projects-list"));

        element(by.linkText("softvis3d")).click();
        waitFor(by.css(".overview"));

        element.all(by.partialLinkText("More")).get(0).click();
        element(by.partialLinkText("SoftVis3D Viewer")).click();

        waitFor(by.css(".city-builder"));
    });

    it("shoud show the main menu default", () => {
        expect(element(by.css(".city-builder")).isDisplayed()).toBe(true);
        browser.sleep(2000);
    });

    it("shoud show the District option", () => {
        element(by.id("select-district")).click();
        element(by.partialButtonText("Load Scene")).click();
        browser.sleep(2000);

        browser.actions()
            .mouseMove({x: 300, y: 300})
            .mouseDown()
            .mouseUp()
            .perform();

        browser.sleep(500);

        element(by.cssContainingText("option", "Number of authors")).click();

        browser.sleep(10000);
    });

    it("shoud show the District option with the leak period profile", () => {
        element(by.id("select-district")).click();
        element(by.cssContainingText("option", "Leak period")).click();

        element(by.partialButtonText("Load Scene")).click();
        browser.sleep(2000);

        browser.actions()
            .mouseMove({x: 300, y: 300})
            .mouseDown()
            .mouseUp()
            .perform();

        browser.sleep(500);

        element(by.cssContainingText("option", "Coverage")).click();

        browser.sleep(2000);

        // element(by.partialButtonText("Share")).getLocation().then((location) => {
        //     browser.actions()
        //         .mouseMove(location)
        //         .perform();
        //     element(by.partialButtonText("Open in new tab")).click();
        //     browser.sleep(5000);
        // });
    });

    it("shoud show the evostreet option", () => {
        element(by.id("select-evostreet")).click();
        element(by.partialButtonText("Load Scene")).click();
        browser.sleep(2000);

        browser.actions()
            .mouseMove({x: 300, y: 300})
            .mouseDown()
            .mouseMove({x: 50, y: 50})
            .mouseUp()
            .perform();

        browser.sleep(500);

        element(by.cssContainingText("option", "Coverage")).click();

        browser.sleep(2000);
    });
});