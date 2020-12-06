export interface Parameters {
    [id: string]: string;
}

export default class UrlParameterService {

    public getQueryParams(qs: string): Parameters {
        qs = qs.split("+").join(" ");

        const params: Parameters = {};
        let tokens: RegExpExecArray | null;
        const re = /[?&]?([^=]+)=([^&]*)/g;

        while ((tokens = re.exec(qs))) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params;
    }

    public createVisualizationLinkForCurrentUrl(href: string, params: Parameters): string {
        const paramsStartPosition: number = href.indexOf("?");

        const hrefParamsPart: string = href.substr(paramsStartPosition, href.length);
        const hrefParams: Parameters = this.getQueryParams(hrefParamsPart);

        if (paramsStartPosition >= 0) {
            href = href.substr(0, href.indexOf("?"));
        }

        return href + this.createUrlParameterList(hrefParams, params);
    }

    private createUrlParameterList(existingParameters: Parameters, parameters: Parameters): string {
        parameters = Object.assign(existingParameters, parameters);

        let result = "?";
        for (const key in parameters) {
            if (parameters[key]) {
                result += key + "=" + parameters[key] + "&";
            }
        }

        return result.substr(0, result.length - 1);
    }

}