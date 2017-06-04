import "reflect-metadata";
import {Container} from "inversify";
import getDecorators from "inversify-inject-decorators";
import LayoutProcessor from "./services/layout/LayoutProcessor";

let container = new Container();

container.bind<LayoutProcessor>("LayoutProcessor").toConstantValue(new LayoutProcessor());

let { lazyInject } = getDecorators(container);
export {
    container,
    lazyInject
};