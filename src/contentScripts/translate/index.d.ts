
export interface IData {
    top: number;
    rawText: string;
    text?: string;
}

export interface IData2 {
    // [top: number]: Omit<IData, 'top'>[];
    top: number;
    data: Omit<IData, 'top'>[];
}

