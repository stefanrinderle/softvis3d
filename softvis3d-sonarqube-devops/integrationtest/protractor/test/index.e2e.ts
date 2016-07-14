///<reference path="../typings/jasmine/jasmine.d.ts"/>
///<reference path="../typings/angular-protractor/angular-protractor.d.ts"/>

function waitFor(selector) {
    return browser.wait(function() {
        return browser.isElementPresent(selector);
    }, 5000);
}

describe('Index', () => {

    beforeEach(() => {
        browser.get('/sonar');

        element(by.linkText('softvis3d')).click();
        browser.sleep(2000);
        element.all(by.partialLinkText('More')).get(1).click();
        element.all(by.partialLinkText('SoftVis3D Viewer')).click();

        waitFor(by.buttonText('Show'));
    });

    it('shoud show the menu', () => {

        var showbutton = element(by.buttonText('Show'));

        expect(showbutton.isEnabled()).toBe(true);
        expect(element(by.id('file-loader')).isDisplayed()).toBe(true);
        browser.sleep(2000);
    });

    it('shoud show the visualization', () => {

        var showbutton = element(by.buttonText('Show'));
        showbutton.click();

        expect(element(by.id('file-loader')).isDisplayed()).toBe(false);
        browser.sleep(2000);
    });

});
