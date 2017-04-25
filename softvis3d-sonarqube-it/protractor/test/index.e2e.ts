///<reference path="../typings/jasmine/jasmine.d.ts"/>
///<reference path="../typings/angular-protractor/angular-protractor.d.ts"/>

function waitFor(selector) {
    return browser.wait(function() {
        return browser.isElementPresent(selector);
    }, 10000);
}

function checkConsoleErrors() {
    browser.manage().logs().get('browser').then((browserLog) => {
        if (browserLog.length) {
            browserLog.forEach((log) => {
                let error = log.level.value > 900;
                if (error) {
                    console.error('ERROR: ', JSON.stringify(browserLog));
                }
            });
        }
    });
}

describe("Index", () => {

    beforeEach(() => {
        browser.get("/projects");
        waitFor(by.css(".projects-list"));

        element(by.linkText("softvis3d")).click();
        waitFor(by.css(".overview"));

        element.all(by.partialLinkText("More")).get(0).click();

    });

    // afterEach(() => {
    //     checkConsoleErrors();
    // });

    // it("shoud show default page 1", () => {
    //
    // });

    it("shoud show default page 2", () => {
        checkConsoleErrors();

        element(by.partialLinkText("SoftVis3D Viewer")).click();

        checkConsoleErrors();

        browser.sleep(3000);

        checkConsoleErrors();
    });

    // it("shoud show default page 3", () => {
    //     browser.get("/project/extension/softvis3d/overview_page?id=de.rinderle.softvis3d%3Asoftvis3d");
    //
    //     checkConsoleErrors();
    // });

    // it("shoud show the main menu default", () => {
    //     expect(element(by.css(".city-builder")).isDisplayed()).toBe(true);
    //     browser.sleep(2000);
    // });
    //
    // it("shoud show the District option", () => {
    //     element(by.id("select-district")).click();
    //     element(by.partialButtonText("Load Scene")).click();
    //     browser.sleep(2000);
    //
    //     browser.actions()
    //         .mouseMove({x: 300, y: 300})
    //         .mouseDown()
    //         .mouseUp()
    //         .perform();
    //
    //     browser.sleep(500);
    //
    //     element(by.cssContainingText("option", "Package Name")).click();
    //
    //     browser.sleep(2000);
    // });
    //
    // it("shoud show the District option with the leak period profile", () => {
    //     element(by.id("select-district")).click();
    //     element(by.cssContainingText("option", "Leak period")).click();
    //
    //     element(by.partialButtonText("Load Scene")).click();
    //     browser.sleep(2000);
    //
    //     browser.actions()
    //         .mouseMove({x: 300, y: 300})
    //         .mouseDown()
    //         .mouseUp()
    //         .perform();
    //
    //     browser.sleep(500);
    //
    //     element(by.cssContainingText("option", "Package Name")).click();
    //
    //     browser.sleep(2000);
    // });
    //
    // it("shoud show the evostreet option", () => {
    //     element(by.id("select-evostreet")).click();
    //     element(by.partialButtonText("Load Scene")).click();
    //     browser.sleep(2000);
    //
    //     browser.actions()
    //         .mouseMove({x: 300, y: 300})
    //         .mouseDown()
    //         .mouseMove({x: 50, y: 50})
    //         .mouseUp()
    //         .perform();
    //
    //     browser.sleep(500);
    //
    //     element(by.cssContainingText("option", "Coverage")).click();
    //
    //     browser.sleep(2000);
    // });
});