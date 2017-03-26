function loadScript(src, f) {
    let head = document.getElementsByTagName("head")[0];
    let script = document.createElement("script");
    script.src = src;
    let done = false;
    script.onload = script.onreadystatechange = function () {
        // attach to both events for cross browser finish detection:
        if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
            done = true;
            if (typeof f === 'function') {
                f();
            }
            // cleans up a little memory:
            script.onload = script.onreadystatechange = null;
            head.removeChild(script);
        }
    };
    head.appendChild(script);
}

function loadStyle(src) {
    let head = document.getElementsByTagName("head")[0];
    let script = document.createElement("link");
    script.setAttribute("rel", "stylesheet");
    script.setAttribute("type", "text/css");
    script.setAttribute("href", src);

    script.src = src;
    let done = false;
    script.onload = script.onreadystatechange = function () {
        // attach to both events for cross browser finish detection:
        if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
            done = true;
            // cleans up a little memory:
            script.onload = script.onreadystatechange = null;
        }
    };

    head.appendChild(script);
}

window.registerExtension('softvis3d/overview_page', function (options) {
    // let's create a flag telling if the page is still displayed
    let isDisplayed = true;

    window.PROJECT_KEY = options.component.key;

    loadStyle('/static/softvis3d/style.css');

    let s = '<div id="app"></div>';
    let div = document.createElement('div');
    div.innerHTML = s;
    options.el.appendChild(div);

    loadScript('/static/softvis3d/react.min.js', function () {});
    loadScript('/static/softvis3d/react-dom.min.js', function () {});
    loadScript('/static/softvis3d/three.min.js', function () {
        loadScript('/static/softvis3d/bundle.js', function () {
            console.log('finished loading');
        });
    });

    // return a function, which is called when the page is being closed
    return function () {
        // we unset the `isDisplayed` flag to ignore to Web API calls finished after the page is closed
        isDisplayed = false;
    };
});