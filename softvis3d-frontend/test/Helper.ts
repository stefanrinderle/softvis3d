import {container} from "../src/inversify.config";

export function bindMock(target: string, mock: any) {
    container.unbind(target);
    container.bind(target).toConstantValue(mock);
}