
export interface ISourceData {
    /** 所在位置 */
    top: number;
    /** 原文 */
    rawText: string;
    /** 翻译文本 */
    // text?: string;
    /** 翻译回调 */
    textPromise?: Promise<string[]>;
    /** 最新加入数据 */
    last: boolean;
    /** 加入的顺序 */
    index: number;
}

export interface IItemData {
    // [top: number]: Omit<IData, 'top'>[];
    top: number;
    data: Omit<ISourceData, 'top'>[];
    open: boolean;
}

