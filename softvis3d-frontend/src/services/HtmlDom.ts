export default class HtmlDom {
    public static getOffsetsById(id: string): { top: number; left: number; } {
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
            } while (node = node.offsetParent as HTMLElement);
        }

        return {
            top: top - topScroll,
            left: left - leftScroll
        };
    }

    public static getHeightById(id: string): number {
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

    public static getWidthById(id: string): number {
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
}