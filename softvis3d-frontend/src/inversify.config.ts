import {Container} from "inversify";
import getDecorators from "inversify-inject-decorators";
import "reflect-metadata";
import LayoutProcessor from "./services/layout/LayoutProcessor";

let container = new Container();

bindToInjection(LayoutProcessor);

let { lazyInject } = getDecorators(container);
export {
    container,
    lazyInject
};

export function bindToInjection(constructor: any): any {
    const instance = new constructor();
    container.bind<typeof constructor>(constructor.name).toConstantValue(instance);
    return instance;
}