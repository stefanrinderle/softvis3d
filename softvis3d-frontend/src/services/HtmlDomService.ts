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

export class Offset {
    public readonly top: number;
    public readonly left: number;

    constructor(top: number, left: number) {
        this.top = top;
        this.left = left;
    }
}

export class HtmlDomService {

    public getOffsetsById(id: string): Offset {
        let node = document.getElementById(id);
        let top = 0;
        let left = 0;
        let topScroll = 0;
        let leftScroll = 0;
        if (node && node.offsetParent) {
            do {
                top += node.offsetTop;
                left += node.offsetLeft;
                topScroll += node.offsetParent ? node.offsetParent.scrollTop : 0;
                leftScroll += node.offsetParent ? node.offsetParent.scrollLeft : 0;
            } while ((node = node.offsetParent as HTMLElement));
        }

        return new Offset(top - topScroll, left - leftScroll);
    }

    public getHeightById(id: string): number {
        const element = document.getElementById(id);

        if (!element) {
            return 0;
        }

        if (window.getComputedStyle) {
            const style = window.getComputedStyle(element);
            let h = parseInt(style.height || "0", 10);
            h += parseInt(style.paddingTop || "0", 10);
            h += parseInt(style.paddingBottom || "0", 10);
            h += parseInt(style.marginTop || "0", 10);
            h += parseInt(style.marginBottom || "0", 10);
            h += parseInt(style.borderTopWidth || "0", 10);
            h += parseInt(style.borderBottomWidth || "0", 10);
            return h;
        } else {
            return element.offsetHeight;
        }
    }

    public getWidthById(id: string): number {
        const element = document.getElementById(id);

        if (!element) {
            return 0;
        }

        if (window.getComputedStyle) {
            const style = window.getComputedStyle(element);
            let w = parseInt(style.width || "0", 10);
            w += parseInt(style.paddingLeft || "0", 10);
            w += parseInt(style.paddingRight || "0", 10);
            w += parseInt(style.marginLeft || "0", 10);
            w += parseInt(style.marginRight || "0", 10);
            w += parseInt(style.borderLeftWidth || "0", 10);
            w += parseInt(style.borderRightWidth || "0", 10);
            return w;
        } else {
            return element.offsetWidth;
        }
    }

    public isDescendant(parent: HTMLElement | null, child: HTMLElement | null): boolean {
        if (!parent || !child) {
            return false;
        }

        let node = child.parentNode;
        while (node != null) {
            if (node === parent) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    }
}
