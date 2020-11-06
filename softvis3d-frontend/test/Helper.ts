import {container} from "../src/inversify.config";

export function bindMock(target: string, mock: any) {
    if (container.isBound(target)) {
        container.unbind(target);
    }
    container.bind(target).toConstantValue(mock);
}