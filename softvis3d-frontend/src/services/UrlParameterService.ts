export interface Parameters {
    [id: string]: string;
}

export default class UrlParameterService {

    public static getQueryParams(qs: string): Parameters {
        qs = qs.split("+").join(" ");

        let params: Parameters = {};
        let tokens: RegExpExecArray | null;
        let re: RegExp = /[?&]?([^=]+)=([^&]*)/g;

        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params;
    }

    public static createVisualizationLinkForCurrentUrl(href: string, params: Parameters): string {
        let paramsStartPosition: number = href.indexOf("?");

        let hrefParamsPart: string = href.substr(paramsStartPosition, href.length);
        let hrefParams: Parameters = this.getQueryParams(hrefParamsPart);

        if (paramsStartPosition >= 0) {
            href = href.substr(0, href.indexOf("?"));
        }

        return href + this.createUrlParameterList(hrefParams, params);
    }

    private static createUrlParameterList(existingParameters: Parameters, parameters: Parameters): string {
        parameters = Object.assign(existingParameters, parameters);

        let result: string = "?";
        for (let key in parameters) {
            if (parameters[key]) {
                result += key + "=" + parameters[key] + "&";
            }
        }

        return result.substr(0, result.length - 1);
    }

}