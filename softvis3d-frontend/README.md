# SoftVis3D - Frontend module

# Installation
0. `npm install -g yarn`
1. `yarn install`

# Development
1. Start SonarQube-Server
   * See the [readme file](../DEV.md) within this projects root for a quick setup guide with docker
   * The Server needs to be reachable at port 9000
2. Configure Dev-Environment (`app/development.js`)
   * webpack will proxy `http://localhost/api` to point to the configured SonarQube API path
   * update `projectKey` to any available (scanned) project on the SonarQube instance
4. `yarn start` will start the dev-server on `http://localhost:8080`

# Production Build
`yarn run build` will execute all available tests before building the project, which can be found in `/app`.

# Unit tests
 * `yarn test` will run mocha.
 * `yarn test:coverage` will also generate a coverage report

# TODOS
 * If ts-node transpilation fails webpack will carry on and the build will still succeed.
 * A second set integration tests on the transpiled code should be implemented (regression tests)
 
# Code style definitions
 
* Annotations always in a single line

    ```
    @observable
    public showLoadingQueue: boolean;
    ```

* React components input props if more than 2 properties as input given
   
   * more than 1 param

        ```
        interface SideBarProps {
            sceneStore: SceneStore;
            selectedElement: TreeElement | null;
        }
        @observer
        export default class SideBar extends React.Component<SideBarProps, any> {
        ```

   * or single param

        ```
        @observer
        export default class OptionsSimple extends React.Component<{ store: CityBuilderStore; }, any> {
        ```

   * if no property is accepted, then use an empty „object“ as params

        ```
        @observer
        export default class OptionsSimple extends React.Component<{}, any> {
        ```