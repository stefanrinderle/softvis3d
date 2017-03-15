window.registerExtension('softvis3dplugin/project_page', function (options) {
    options.el.textContent = 'This is my page!';

    console.log("HERE");

    return function () {
        options.el.textContent = '';
    };
});