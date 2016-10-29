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
    proxy: null
};

export default config;
