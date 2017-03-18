function loadScript(src, f) {
    let head = document.getElementsByTagName("head")[0];
    let script = document.createElement("script");
    script.src = src;
    let done = false;
    script.onload = script.onreadystatechange = function() {
        // attach to both events for cross browser finish detection:
        if ( !done && (!this.readyState ||
                this.readyState == "loaded" || this.readyState == "complete") ) {
            done = true;
            if (typeof f == 'function') f();
            // cleans up a little memory:
            script.onload = script.onreadystatechange = null;
            head.removeChild(script);
        }
    };
    head.appendChild(script);
}

function loadStype(src, element, f) {
    let script = document.createElement("link");
    script.setAttribute("rel", "stylesheet");
    script.setAttribute("type", "text/css");
    script.setAttribute("href", src);
    let done = false;
    script.onload = script.onreadystatechange = function() {
        // attach to both events for cross browser finish detection:
        if ( !done && (!this.readyState ||
                this.readyState == "loaded" || this.readyState == "complete") ) {
            done = true;
            if (typeof f == 'function') f();
            // cleans up a little memory:
            script.onload = script.onreadystatechange = null;
            element.removeChild(script);
        }
    };
    element.appendChild(script);
}

window.registerExtension('softvis3d/overview_page', function (options) {
    // let's create a flag telling if the page is still displayed
    let isDisplayed = true;

    let PROJECT_KEY = options.component.key;

    console.log(PROJECT_KEY);

    // // then do a Web API call to the /api/issues/search to get the number of issues
    // // we pass `resolved: false` to request only unresolved issues
    // // and `componentKeys: options.component.key` to request issues of the given project
    // window.SonarRequest.getJSON('/api/issues/search', {
    //     resolved: false,
    //     componentKeys: options.component.key
    // }).then(function (response) {
    //
    //     // once the request is done, and the page is still displayed (not closed already)
    //     if (isDisplayed) {
    //
    //         // let's create an `h2` tag and place the text inside
    //         let header = document.createElement('h2');
    //         header.textContent = 'The project has ' + response.total + ' issues';
    //
    //         // append just created element to the container
    //         options.el.appendChild(header);
    //     }
    // });

    loadStype('/static/softvis3d/style.css', options.el, function () {
        let s = '<div id="app"></div>';
        let div = document.createElement('div');
        div.innerHTML = s;
        options.el.appendChild(div);

        loadScript('/static/softvis3d/react.min.js', function () {
            loadScript('/static/softvis3d/react-dom.min.js', function () {
                loadScript('/static/softvis3d/three.min.js', function () {
                    loadScript('/static/softvis3d/resources/orbit-controls.js', function () {
                        loadScript('/static/softvis3d/bundle.js', function () {
                            console.log('finished loading');
                        });
                    });
                });
            });
        });
    });

    // return a function, which is called when the page is being closed
    return function () {
        // we unset the `isDisplayed` flag to ignore to Web API calls finished after the page is closed
        isDisplayed = false;
    };
});