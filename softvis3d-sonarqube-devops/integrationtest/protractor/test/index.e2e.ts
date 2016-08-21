///<reference path="../typings/jasmine/jasmine.d.ts"/>
///<reference path="../typings/angular-protractor/angular-protractor.d.ts"/>

function waitFor(selector) {
    return browser.wait(function() {
        return browser.isElementPresent(selector);
    }, 5000);
}

describe("Index", () => {

    beforeEach(() => {
        browser.get("/");

        element(by.linkText("softvis3d")).click();
        browser.sleep(2000);
        element.all(by.partialLinkText("More")).get(1).click();
        element.all(by.partialLinkText("SoftVis3D Viewer")).click();

        waitFor(by.buttonText("Show"));
    });

    it("shoud show the menu", () => {
        let showbutton = element(by.id("cityButtonShow"));

        expect(showbutton.isEnabled()).toBe(true);
        expect(element(by.id("file-loader")).isDisplayed()).toBe(true);
        browser.sleep(2000);
    });

    it("shoud show the default visualization", () => {
        let showbutton = element(by.id("cityButtonShow"));
        showbutton.click();

        browser.sleep(2000);

        element(by.id("extendTreeImage")).click();
    });

    it("shoud show the custom menu", () => {
        let customButton = element(by.id("navigationButtonCustom"));
        customButton.click();
    });

    it("shoud show the custom default visualization", () => {
        let customButton = element(by.id("navigationButtonCustom"));
        customButton.click();

        let showbutton = element(by.id("customButtonShow"));
        showbutton.click();

        browser.sleep(2000);
    });

    it("shoud show the custom evostreet visualization", () => {
        let custombutton = element(by.id("navigationButtonCustom"));
        custombutton.click();

        element(by.cssContainingText("option", "Evostreet")).click();

        let showbutton = element(by.id("customButtonShow"));
        showbutton.click();

        browser.sleep(2000);
    });

    it("shoud show custom visualization with colors", () => {
        let custombutton = element(by.id("navigationButtonCustom"));
        custombutton.click();

        element(by.cssContainingText("option", "Package Name")).click();

        let showbutton = element(by.id("customButtonShow"));
        showbutton.click();

        browser.sleep(2000);
    });

});
