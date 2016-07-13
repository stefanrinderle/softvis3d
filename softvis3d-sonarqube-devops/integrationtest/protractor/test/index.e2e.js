/// <reference path="../typings/jasmine/jasmine.d.ts" />
/// <reference path="../typings/angular-protractor/angular-protractor.d.ts" />
/// <reference path="../typings/selenium-webdriver/selenium-webdriver.d.ts" />
describe('Index', function () {
    beforeEach(function () {
        browser.get('/');
    });
    it('should have a title', function () {
        var subject = browser.getTitle();
        var result = 'SonarQube';
        expect(subject).toEqual(result);
    });
});
//# sourceMappingURL=index.e2e.js.map