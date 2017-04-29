(function (entryPoint, baseUrl) {
    function createEntryPoint(target, name) {
        var div = document.createElement('div');
        div.setAttribute("id", name);
        target.appendChild(div);
    }


    function loadScript(src, f) {
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.src = src;
        var done = false;
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

    function loadStyle(src, f) {
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("link");
        script.setAttribute("rel", "stylesheet");
        script.setAttribute("type", "text/css");
        script.setAttribute("href", src);

        script.src = src;
        var done = false;
        script.onload = script.onreadystatechange = function () {
            // attach to both events for cross browser finish detection:
            if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
                done = true;
                if (typeof f === 'function') {
                    f();
                }
                // cleans up a little memory:
                script.onload = script.onreadystatechange = null;
            }
        };

        head.appendChild(script);
    }

    function load() {
        var completed = 0;
        var limit = arguments.length;
        var files = arguments;

        // TODO: Promise polyfill
        return new Promise(function(resolve) {
            var fn = function() {
                if (++completed === limit) {
                    resolve();
                }
            }

            for (var i = 0; i < files.length; i++) {
                loader = files[i].match(/css$/i) ? loadStyle : loadScript;
                loader(files[i], fn);
            }
        });
    }

    /* ###################################### *
     * ########## START SOFTVIS3D ########### *
     * ###################################### */

    window.registerExtension('softvis3d/overview_page', function (options) {
        createEntryPoint(options.el, entryPoint);
        return load(
            baseUrl + '/static/softvis3d/style.css',
            baseUrl + '/static/softvis3d/react.min.js',
            baseUrl + '/static/softvis3d/react-dom.min.js',
            baseUrl + '/static/softvis3d/three.min.js'
        ).then(function() {
            return load(baseUrl + '/static/softvis3d/bundle.js');
        }).then(function() {
            var softvis3d = new window.softvis3d.app({
                api: baseUrl + '/api',
                projectKey: options.component.key,
                isDev: false
            });

            softvis3d.run(entryPoint);
        });
    });
})("app", window.baseUrl);
