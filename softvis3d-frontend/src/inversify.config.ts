import "reflect-metadata";
import {Container} from "inversify";
import getDecorators from "inversify-inject-decorators";

let container = new Container();

let { lazyInject } = getDecorators(container);
export {
    container,
    lazyInject
};