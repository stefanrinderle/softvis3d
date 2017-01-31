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
        return element ? element.offsetHeight : 0;
    }

    public static getWidthById(id: string): number {
        const element = document.getElementById(id);
        return element ? element.offsetWidth : 0;
    }
}