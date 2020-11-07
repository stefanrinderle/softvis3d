import * as Sinon from "sinon";
import {container} from "../src/inversify.config";

export function createMock(constructor: any) {
    let result: any = Sinon.createStubInstance(constructor);
    bindMock(constructor.name, result);
    return result;
}

function bindMock(target: string, mock: any) {
    if (container.isBound(target)) {
        container.unbind(target);
    }
    container.bind(target).toConstantValue(mock);
}