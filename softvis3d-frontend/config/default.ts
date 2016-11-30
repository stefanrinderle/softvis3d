///
/// softvis3d-frontend
/// Copyright (C) 2016 Stefan Rinderle and Yvo Niedrich
/// stefan@rinderle.info / yvo.niedrich@gmail.com
///
/// This program is free software; you can redistribute it and/or
/// modify it under the terms of the GNU Lesser General Public
/// License as published by the Free Software Foundation; either
/// version 3 of the License, or (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
/// Lesser General Public License for more details.
///
/// You should have received a copy of the GNU Lesser General Public
/// License along with this program; if not, write to the Free Software
/// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
///

/* Config is globally available in the app, using
 * > import config from "config";
 *
 * Configuration Parameters:
 * - api: Default uri for the web api (relative or absolute)
 * - env: Runtime environment of the app
 * - project: use initialise the app with this project (for development or testing)
 * - proxy: proxy the api-uri on the webpack-dev-server (not available in production)
 */

const config: any = {
    api: "/api",
    env: "production",
    project: null,
    proxy: null,
    pathRewrite: {},
    proxyLegacy: false
};

export default config;
