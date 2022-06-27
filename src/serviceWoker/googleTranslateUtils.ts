/* eslint-disable no-var */
/* eslint-disable no-unused-expressions */

// tk "460058.567592169"
// key AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw
export const getGoogleQueryData = (page: number, rawData: string[]) => {
    const KEY = 'AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw';
    const FIXED_TK = '460058.567592169';
    const query = {
        anno: 3,
        client: 'te_lib',
        format: 'html',
        v: '1.0',
        key: KEY,
        logld: 'vTE_20220622',
        // 当前语言
        sl: 'en',
        // 目标语言
        tl: 'zh-CN',
        // 应该是页数
        tc: page,
        sr: 1,
        // tk: getTk('q=hello&q=word'),
        tk: googleTranslateUtils.Bn(rawData.join(''), FIXED_TK),
        mode: 1,
    };

    return serialize(query);
};

export const googleTranslateUtils = {
    An (a: any, b: any) {
        for (let c = 0; c < b.length - 2; c += 3) {
            let d = b.charAt(c + 2);
            d = 'a' <= d ? d.charCodeAt(0) - 87 : Number(d);
            d = '+' == b.charAt(c + 1) ? a >>> d : a << d;
            a = '+' == b.charAt(c) ? a + d & 4294967295 : a ^ d;
        }
        return a;
    },
    Bn (a: any, b: any) {
        let c = b.split('.');
        b = Number(c[0]) || 0;
        for (var d = [], e = 0, f = 0; f < a.length; f++) {
            let g = a.charCodeAt(f);
            128 > g ? d[e++] = g : (2048 > g ? d[e++] = g >> 6 | 192 : (55296 == (g & 64512) && f + 1 < a.length && 56320 == (a.charCodeAt(f + 1) & 64512) ? (g = 65536 + ((g & 1023) << 10) + (a.charCodeAt(++f) & 1023),
            d[e++] = g >> 18 | 240,
            d[e++] = g >> 12 & 63 | 128) : d[e++] = g >> 12 | 224,
            d[e++] = g >> 6 & 63 | 128),
            d[e++] = g & 63 | 128);
        }
        a = b;
        for (e = 0; e < d.length; e++)
            a += d[e],
            a = googleTranslateUtils.An(a, '+-a^+6');
        a = googleTranslateUtils.An(a, '+-3^+b+-f');
        a ^= Number(c[1]) || 0;
        0 > a && (a = (a & 2147483647) + 2147483648);
        c = a % 1E6;
        return c.toString() + '.' + (c ^ b);
    }
};

type ISerialize = (data: IOBJ) => 'a=1&b=2&c=3' | string;
export const serialize: ISerialize = (data) => {
    const arr = [];
    for (const i in data) {
        const str = data[i];
        // item && (item = `${item}`.replace(/ /g, '%20'));
        arr.push(`${i}=${str || ''}`);
    }
    return arr.join('&');
};

export const handlerAjaxData = (data: string[]) => {
    const strArr = data.reduce((totalStr, val) => {
        totalStr.push(`q=${encodeURIComponent(val)}`);
        return totalStr;
    }, [] as string[]);

    return strArr.join('&');
};

export const googleApi = async (page: number, dataStr: string, rawData: string[]) => {
    const translateUrl = 'https://translate.googleapis.com/translate_a/t';
    try {
        const res = await fetch(`${translateUrl}?${getGoogleQueryData(page, rawData)}`, {
            body: dataStr,
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
            },
        });

        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('没数据');
        }

        return data.map(ii => ii.replace(/<i(([\s\S])*?)<\/i>/g, '').replace(/<(b|\/b|a|\/a|a i=\d)>/g, ''));
    } catch (error) {
        console.error(error);
        return [...rawData];
    }
};

export const getTranslateLang = async (data: string[]) => {
    let count = 0;
    let oneTotal = 10;
    const dataArr = [];

    do {
        oneTotal = 10 + parseInt(`${Math.random() * 11}`);
        const newArr = data.slice(count, count + oneTotal);
        dataArr.push(newArr);
        count += oneTotal;
    } while (data.slice(count).length);

    const allResData = [];
    for (const index in dataArr) {
        const newData = dataArr[index];
        const newDataStr = handlerAjaxData(newData);
        const resData = await googleApi(+index + 1, newDataStr, newData);
        allResData.push(...resData);
    }

    return allResData.length ? allResData : [...data];
};
