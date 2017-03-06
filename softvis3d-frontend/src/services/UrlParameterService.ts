export interface Parameters {
    [id: string]: string;
}

export default class UrlParameterService {

    /**
     * public for unit tests
     */
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

    /**
     * public for unit tests
     */
    public static createVisualizationLinkForCurrentUrl(href: string, params: Parameters): string {
        let urlContainsParams: boolean = href.indexOf("?") >= 0;

        return href + this.createUrlParameterList(params, urlContainsParams);
    }

    private static createUrlParameterList(parameters: Parameters, urlContainsParams: boolean): string {
        let result: string;

        if (urlContainsParams) {
            result = "&";
        } else {
            result = "?";
        }

        for (let key in parameters) {
            if (parameters[key]) {
                result += key + "=" + parameters[key] + "&";
            }
        }

        return result.substr(0, result.length - 1);
    }

}