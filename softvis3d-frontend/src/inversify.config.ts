import "reflect-metadata";
import {Container} from "inversify";
import getDecorators from "inversify-inject-decorators";
import {AppStatusStore} from "./stores/AppStatusStore";

let container = new Container();

container.bind<AppStatusStore>("AppStatusStore").to(AppStatusStore);

let { lazyInject } = getDecorators(container);
export {
    container,
    lazyInject
};