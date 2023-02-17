/*
 * SoftVis3D Sonar plugin
 * Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
 * stefan@rinderle.info / yvo.niedrich@gmail.com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
 */
// Promise polyfill: https://github.com/taylorhakes/promise-polyfill
if (typeof(Promise) === "undefined") {
    !function(e){function n(){}function t(e,n){return function(){e.apply(n,arguments)}}function o(e){if("object"!=typeof this)throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=void 0,this._deferreds=[],s(e,this)}function i(e,n){for(;3===e._state;)e=e._value;return 0===e._state?void e._deferreds.push(n):(e._handled=!0,void o._immediateFn(function(){var t=1===e._state?n.onFulfilled:n.onRejected;if(null===t)return void(1===e._state?r:u)(n.promise,e._value);var o;try{o=t(e._value)}catch(i){return void u(n.promise,i)}r(n.promise,o)}))}function r(e,n){try{if(n===e)throw new TypeError("A promise cannot be resolved with itself.");if(n&&("object"==typeof n||"function"==typeof n)){var i=n.then;if(n instanceof o)return e._state=3,e._value=n,void f(e);if("function"==typeof i)return void s(t(i,n),e)}e._state=1,e._value=n,f(e)}catch(r){u(e,r)}}function u(e,n){e._state=2,e._value=n,f(e)}function f(e){2===e._state&&0===e._deferreds.length&&o._immediateFn(function(){e._handled||o._unhandledRejectionFn(e._value)});for(var n=0,t=e._deferreds.length;n<t;n++)i(e,e._deferreds[n]);e._deferreds=null}function c(e,n,t){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof n?n:null,this.promise=t}function s(e,n){var t=!1;try{e(function(e){t||(t=!0,r(n,e))},function(e){t||(t=!0,u(n,e))})}catch(o){if(t)return;t=!0,u(n,o)}}var a=setTimeout;o.prototype["catch"]=function(e){return this.then(null,e)},o.prototype.then=function(e,t){var o=new this.constructor(n);return i(this,new c(e,t,o)),o},o.all=function(e){var n=Array.prototype.slice.call(e);return new o(function(e,t){function o(r,u){try{if(u&&("object"==typeof u||"function"==typeof u)){var f=u.then;if("function"==typeof f)return void f.call(u,function(e){o(r,e)},t)}n[r]=u,0===--i&&e(n)}catch(c){t(c)}}if(0===n.length)return e([]);for(var i=n.length,r=0;r<n.length;r++)o(r,n[r])})},o.resolve=function(e){return e&&"object"==typeof e&&e.constructor===o?e:new o(function(n){n(e)})},o.reject=function(e){return new o(function(n,t){t(e)})},o.race=function(e){return new o(function(n,t){for(var o=0,i=e.length;o<i;o++)e[o].then(n,t)})},o._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){a(e,0)},o._unhandledRejectionFn=function(e){"undefined"!=typeof console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)},o._setImmediateFn=function(e){o._immediateFn=e},o._setUnhandledRejectionFn=function(e){o._unhandledRejectionFn=e},"undefined"!=typeof module&&module.exports?module.exports=o:e.Promise||(e.Promise=o)}(this);
}

(function (entryPoint, baseUrl) {
    function createEntryPoint(target, name) {
        var div = document.createElement("div");
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
                if (typeof f === "function") {
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
                if (typeof f === "function") {
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

        return new Promise(function(resolve) {
            var fn = function() {
                if (++completed === limit) {
                    resolve();
                }
            };

            for (var i = 0; i < files.length; i++) {
                loader = files[i].match(/css$/i) ? loadStyle : loadScript;
                loader(files[i], fn);
            }
        });
    }

    /* ###################################### *
     * ########## START SOFTVIS3D ########### *
     * ###################################### */

    window.registerExtension("softvis3d/overview_page", function (options) {
        createEntryPoint(options.el, entryPoint);

        var softvis3d;
        load(
            baseUrl + "/static/softvis3d/style.css",
            baseUrl + "/static/softvis3d/react.production.min.js",
            baseUrl + "/static/softvis3d/react-dom.production.min.js",
        ).then(function() {
            load(baseUrl + "/static/softvis3d/bundle.js").then(function() {
                softvis3d = new window.softvis3d.app({
                    baseUrl: baseUrl,
                    projectKey: options.component.key,
                    isDev: false
                });

                softvis3d.run(entryPoint);
            });
        });

        // return a function, which is called when the page is being closed
        return function () {
            softvis3d.stop(entryPoint);
        };
    });
})("app", window.baseUrl);
