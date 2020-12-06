///
/// softvis3d-frontend
/// Copyright (C) 2020 Stefan Rinderle and Yvo Niedrich
/// stefan@rinderle.info / yvo.niedrich@gmail.com
///
/// This program is free software; you can redistribute it and/or
/// modify it under the terms of the GNU Lesser General Public
/// License as published by the Free Software Foundation; either
/// version 3 of the License, or (at your option) any later version.
///
/// This program is distributed in the hope that it will be useful,
/// but WITHOUT ANY WARRANTY; without even the implied warranty of
/// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
/// Lesser General Public License for more details.
///
/// You should have received a copy of the GNU Lesser General Public
/// License along with this program; if not, write to the Free Software
/// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02
///

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
