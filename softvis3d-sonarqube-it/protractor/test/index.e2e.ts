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