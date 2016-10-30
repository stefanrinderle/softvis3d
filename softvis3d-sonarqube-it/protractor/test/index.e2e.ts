///<reference path="../typings/jasmine/jasmine.d.ts"/>
///<reference path="../typings/angular-protractor/angular-protractor.d.ts"/>

function waitFor(selector) {
    return browser.wait(function() {
        return browser.isElementPresent(selector);
    }, 10000);
}

describe("Index", () => {

    beforeEach(() => {
        browser.get("/");

        element(by.linkText("softvis3d")).click();
        browser.sleep(3000);
        element.all(by.partialLinkText("More")).get(1).click();
        element.all(by.partialLinkText("SoftVis3D Viewer")).click();

        waitFor(by.css(".city-builder"));
    });

    it("shoud show the main menu default", () => {
        expect(element(by.css(".city-builder")).isDisplayed()).toBe(true);
        browser.sleep(2000);
    });

    it("shoud show the evostreet option", () => {
        element(by.cssContainingText(".option", "Evostreet")).click();
        browser.sleep(2000);
    });

    it("shoud show the District option", () => {
        element(by.cssContainingText(".option", "District")).click();
        browser.sleep(2000);
    });

});
