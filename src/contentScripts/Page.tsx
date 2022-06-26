import {defineComponent, IframeHTMLAttributes, onMounted, ref} from 'vue';

import {chrome} from '@/utils';

import {skipDom, sendMessage, skipRawDom} from './partUtils';

const Page = defineComponent({
    setup () {

        const FIXED_BEFORE = `custom-zzzz-class-${Date.now()}`;
        const f1 = ref<HTMLIFrameElement>();
        const f2 = ref<HTMLIFrameElement>();

        // 获取当前页面 html
        const getHtmlContent = (() => {
            let htmlStr = '';
            return async () => {
                if (htmlStr) return htmlStr;

                const res = await fetch(window.location.href);

                htmlStr = await res.text();
                htmlStr = htmlStr.replaceAll('<script>', '<script nonce="rAnd0m">');
                return htmlStr;
            };
        })();

        // 加载和刷新dom
        const loadIframePage = async (type?: 1 | 2) => {
            const str = await getHtmlContent();

            switch (type) {
                case 1:
                    // f1.value?.contentDocument?.write('');
                    f1.value!.contentDocument!.documentElement.innerHTML = '';
                    f1.value!.contentDocument!.documentElement.innerHTML = str;
                    // f1.value?.contentDocument?.write(str);
                    break;
                case 2:
                    // f2.value?.contentDocument?.write('');
                    f2.value!.contentDocument!.documentElement.innerHTML = '';
                    f2.value!.contentDocument!.documentElement.innerHTML = str;
                    // f2.value?.contentDocument?.write(str);
                    break;
                default:
                    f1.value?.contentDocument?.write(str);
                    f2.value?.contentDocument?.write(str);
                    break;
            }
        };

        // 创建dom 标识
        const createDomFlag = (body?: HTMLElement) => {
            if (!body) return;

            // 创建唯一标识
            const createDomClass = (() => {
                const classNames: string[] = [];
                let i = 0;

                const fn = (dom: HTMLElement) => {
                    try {
                        const flag = `${FIXED_BEFORE}-${i++}`;
                        classNames.push(flag);

                        const oldStr = [...dom.classList].find(ii => ii.indexOf(FIXED_BEFORE) > -1);
                        oldStr && dom.classList.remove(oldStr);
                        dom.classList.add(flag);
                    } catch (error) {
                        debugger
                    }
                };

                return {
                    run: fn,
                    allClassFlag: classNames,
                }
            })();

            // 判断是否单一文本块
            const isOneTextNode = (dom: HTMLElement) => {
                return dom.childNodes.length === 1 && dom.childNodes[0].nodeName === '#text';
            }

            // 判断是否 text文本
            const isTextNode = (dom: HTMLElement) => {
                return dom.nodeName === '#text';
            }

            // text文本节点转节点
            const textToCustomSpan = (textDom: HTMLElement, parentDom: HTMLElement) => {
                const customSpan = document.createElement('custom-span');
                customSpan.appendChild(textDom.cloneNode());
                parentDom.replaceChild(customSpan, textDom);
                return customSpan;
            };

            const forDom = (list: HTMLElement[], parentDom: HTMLElement) => {

                list.forEach((dom) => {

                    if (skipDom(dom)) return;

                    // if (isOneTextNode(dom)) {
                    //     createDomClass(dom);
                    //     return;
                    // }

                    if (isTextNode(dom)) {
                        const newDom = textToCustomSpan(dom, parentDom);
                        createDomClass.run(newDom);
                        return;
                    }

                    createDomClass.run(dom);

                    if (dom.childNodes.length) {
                        forDom([...dom.childNodes] as unknown as HTMLElement[], dom);
                    }

                });
            };

            const list = body.childNodes;
            forDom([...list] as unknown as HTMLElement[], body);

            return createDomClass.allClassFlag;
        }

        // 删除谷歌翻译，带上的多余标签
        const removeDomFontNode = (body?: HTMLElement) => {
            if (!body) return;

            const replaceFontDom = (dom: HTMLElement, parentDom: HTMLElement) => {

                // if (dom.childNodes.length === 1) {
                //     parentDom.replaceChild(dom.childNodes[0].cloneNode(), dom)
                // } else
                if ([...dom.childNodes].every(ii => ii.nodeType === 3)) {
                    // 全文本的处理
                    const text = [...dom.childNodes].map(ii => ii.textContent).join('');
                    parentDom.replaceChild(document.createTextNode(text), dom)
                    // if (text) {
                    //     parentDom.replaceChild(document.createTextNode(text), dom)
                    // } else {
                    //     parentDom.replaceChild(document.createElement('span'), dom)
                    // }
                } else {
                    // 非全文本的处理
                    const domF = document.createDocumentFragment();
                    [...dom.childNodes].forEach(ii => domF.appendChild(ii));
                    parentDom.replaceChild(domF, dom)
                }
            }

            const forDom = (list: HTMLElement[], parentDom: HTMLElement) => {

                list.forEach((dom) => {

                    if (skipDom(dom)) return;

                    forDom([...dom.childNodes] as unknown as HTMLElement[], dom);

                    if (dom.nodeName === 'FONT' && dom.style.cssText === 'vertical-align: inherit;') {
                        replaceFontDom(dom, parentDom);
                    }

                });
            };

            const list = body.childNodes;
            forDom([...list] as unknown as HTMLElement[], body);
        }

        // 同步滚动事件
        const syncScroll = (() => {

            const domMap = new WeakMap<HTMLElement | Document, HTMLElement | Document>();
            const logicMap = new WeakMap<HTMLElement | Document, (curDom: HTMLElement | Document, toFaceDom: HTMLElement | Document) => void>();
            const scrollEvent = (e: Event) => {
                // e.target.nodeName;
                const dom = e.target as HTMLElement | Document;
                const fn = logicMap.get(dom);
                const faceDom = domMap.get(dom);

                if (!fn || !faceDom) return;
                fn(dom, faceDom);
            };

            return (dom1?: HTMLElement | Document | null, dom2?: HTMLElement | Document | null) => {
                if (!dom1 || !dom2) return;

                let t = 0;
                const fn = (curDom: HTMLElement | Document, toFaceDom: HTMLElement | Document) => {
                    toFaceDom.removeEventListener('scroll', scrollEvent);
                    clearTimeout(t);
                    t = setTimeout(() => {
                        toFaceDom.addEventListener('scroll', scrollEvent);
                    }, 0);

                    if (curDom.nodeName === '#document') {
                        const dom = curDom as Document;
                        const faceDom = toFaceDom as Document;

                        faceDom.documentElement.scrollTop = dom.documentElement.scrollTop;
                        faceDom.documentElement.scrollLeft = dom.documentElement.scrollLeft;

                    } else {
                        const dom = curDom as HTMLElement;
                        const faceDom = toFaceDom as HTMLElement;

                        faceDom.scrollTop = dom.scrollTop;
                        faceDom.scrollLeft = dom.scrollLeft;
                    }

                };

                domMap.set(dom1, dom2);
                domMap.set(dom2, dom1);

                logicMap.set(dom1, fn);
                logicMap.set(dom2, fn);

                // scroll-behavior: smooth;
                if (Reflect.has(dom1, 'documentElement')) {
                    // (dom1 as Document).documentElement.setAttribute('style', 'scroll-behavior: initial;');
                    // (dom2 as Document).documentElement.setAttribute('style', 'scroll-behavior: initial;');
                    (dom1 as Document).documentElement.style.scrollBehavior = 'initial';
                    (dom2 as Document).documentElement.style.scrollBehavior = 'initial';
                } else {
                    // (dom1 as HTMLElement).setAttribute('style', 'scroll-behavior: initial;');
                    // (dom2 as HTMLElement).setAttribute('style', 'scroll-behavior: initial;');
                    (dom1 as HTMLElement).style.scrollBehavior = 'initial';
                    (dom2 as HTMLElement).style.scrollBehavior = 'initial';

                }

                dom1.removeEventListener('scroll', scrollEvent);
                dom2.removeEventListener('scroll', scrollEvent);

                dom1.addEventListener('scroll', scrollEvent);
                dom2.addEventListener('scroll', scrollEvent);

            }
        })();

        // 同步选择文案
        const syncSelect = (() => {
            const winToFunMap = new WeakMap<Window, {mousedown: () => void; mousemove: () => void; mouseup: () => void}>();
            const getRange = (win: Window) => {

                let newRange

                try {
                    newRange = win.getSelection()!.getRangeAt(0);
                    if (!newRange) throw new Error('');
                } catch (error) {
                    newRange = new Range();
                }

                return newRange;
            }

            // 移除事件
            const removeEvent = (win: Window) => {

                const obj = winToFunMap.get(win);
                if (!obj) return;

                win.removeEventListener('mousedown', obj.mousedown);
                win.removeEventListener('mousemove', obj.mousemove);
                win.removeEventListener('mouseup', obj.mouseup);
            };

            // 获取指定 class
            const getAssignClass = (dom?: HTMLElement | null) => {
                if (!dom) return '';

                const classFlag = [...dom.classList].find(str => str.indexOf(FIXED_BEFORE) > -1) || '';
                return classFlag;
            }

            // 解析，
            const parse = {
                // 解析，range 数据
                rangeToData (range: Range) {
                    const {
                        startOffset,
                        startContainer,
                        endOffset,
                        endContainer,
                    } = range;

                    const start = {startOffset, startType: '', startClass: ''};
                    const end = {endOffset, startType: '', startClass: ''};


                    if (startContainer.nodeType === 3) {
                        start.startType = 'text';
                        start.startClass = getAssignClass(startContainer.parentElement);
                    } else if (startContainer.nodeType === 1) {
                        start.startType = 'node';
                        start.startClass = getAssignClass(startContainer as HTMLElement);
                    }

                    if (endContainer.nodeType === 3) {
                        end.startType = 'text';
                        end.startClass = getAssignClass(endContainer.parentElement);
                    } else if (endContainer.nodeType === 1) {
                        end.startType = 'node';
                        end.startClass = getAssignClass(endContainer as HTMLElement);
                    }

                    return {start, end};
                },
                // 解析，
                dataToRange (data: ReturnType<typeof this.rangeToData>, dom: HTMLElement) {
                    const {start, end} = data;
                    let [startDom, startOffset, endDom, ednOffset]: Array<null | Element | number | undefined> = [, start.startOffset, , end.endOffset];

                    const handle = ({startClass, startType}: Omit<typeof start, 'startOffset'>) => {

                        let childDom = null;
                        try {
                            childDom = dom.querySelector(`.${startClass}`);
                            if (startType === 'text') {
                                childDom = childDom?.childNodes[0] as Element | null;
                            }
                        } catch (error) {
                            // console.error(error);
                        }

                        return childDom;
                    }

                    startDom = handle(start);
                    endDom = handle(end);

                    return {startDom, startOffset, endDom, ednOffset};
                }
            };


            // 创建事件
            const createEvent = (win: Window, faceWin: Window) => {

                const mousedown = () => {
                    win.addEventListener('mousemove', mousemove);
                    win.addEventListener('mouseup', mouseup);
                };

                const mousemove = () => {
                    const range = getRange(win);
                    const faceRange = getRange(faceWin);

                    const data = parse.rangeToData(range);
                    const rangeData = parse.dataToRange(data, faceWin.document.body);

                    if (!rangeData.startDom || !rangeData.endDom) {
                        faceWin.getSelection()?.removeAllRanges();
                        return;
                    }
                    faceRange.setStart(rangeData.startDom, rangeData.startOffset as number);
                    faceRange.setEnd(rangeData.endDom, rangeData.ednOffset as number);
                    faceWin.getSelection()?.addRange(faceRange)
                };

                const mouseup = () => {
                    setTimeout(() => {
                        mousemove();
                    }, 16);
                    win.removeEventListener('mousemove', mousemove);
                    win.removeEventListener('mouseup', mouseup);
                };

                win.addEventListener('mousedown', mousedown);

                winToFunMap.set(win, {mousedown, mousemove, mouseup});
            };

            return (win1?: Window | null, win2?: Window | null) => {
                if (!win1 || !win2) return;

                removeEvent(win1);
                removeEvent(win2);

                createEvent(win1, win2);
                createEvent(win2, win1);
            };
        })();

        // 同步高度 和 dom的滚动
        const syncHeightAndScroll = (body?: HTMLElement, toFaceBody?: HTMLElement, classAll?: string[]) => {

            if (!body || !toFaceBody || !classAll) return;

            classAll.forEach((str) => {

                const dom = body.querySelector(`.${str}`) as HTMLElement;
                const faceDom = toFaceBody.querySelector(`.${str}`) as HTMLElement;

                if (!dom || !faceDom) return;

                const rect = dom.getBoundingClientRect();
                const faceRect = faceDom.getBoundingClientRect();
                const height = Math.max(rect.height, faceRect.height);

                dom.style.height = `${height}px`;
                faceDom.style.height = `${height}px`;

                syncScroll(dom, faceDom);
            });
        }

        // 翻译页面
        const translationPage = async (type?: 1 | 2) => {
            const iframe = type === 1 ? f1.value : f2.value;
            const body = iframe?.contentDocument?.body;
            if (!body) return;

            // 获取所有文本节点
            const handler = (list: HTMLElement[], arr: HTMLElement[]) => {
                list.forEach((dom) => {

                    if (skipDom(dom) || skipRawDom(dom)) return;

                    // if (isOneTextNode(dom)) {
                    //     createDomClass(dom);
                    //     return;
                    // }
                    if (dom.nodeType === 3) {
                        arr.push(dom);
                        return;
                    }

                    if (dom.childNodes.length) {
                        handler([...dom.childNodes] as unknown as HTMLElement[], arr);
                    }

                });
            }
            const textArr: HTMLElement[] = [];
            handler([...body.childNodes] as unknown as HTMLElement[], textArr);

            // console.log(textArr);
            const resData = await sendMessage(textArr.map(ii => ii.textContent || ''));

            // console.log(resData);
            textArr.forEach((dom, index) => {
                const newStr = resData[index];
                dom.textContent = newStr;
            });
        };

        // 同步两边高度

        onMounted(() => {
            loadIframePage();
        });

        return () => (
            <div class="page-content">
                <div class="page-iframe page-iframe1">
                    <iframe ref={f1}></iframe>
                </div>
                <div class="page-iframe page-iframe2">
                    <iframe ref={f2}></iframe>
                </div>
                <div class="fixed-btn-group">
                    <div onClick={() => window.location.reload()}>关闭拆分</div>

                    <div onClick={() => loadIframePage(1)}>iframe1 刷新</div>
                    <div onClick={() => translationPage(1)}>iframe1 翻译</div>
                    {/* <div onClick={() => createDomFlag(f1.value?.contentDocument?.body)}>iframe1 生成唯一标识</div> */}
                    {/* <div onClick={() => removeDomFontNode(1)}>iframe1 删除谷歌翻译多余标签</div> */}

                    <div onClick={() => loadIframePage(2)}>iframe2 刷新</div>
                    <div onClick={() => translationPage(2)}>iframe2 翻译</div>
                    {/* <div onClick={() => createDomFlag(f2.value?.contentDocument?.body)}>iframe2 生成唯一标识</div> */}
                    {/* <div onClick={() => removeDomFontNode(2)}>iframe2 删除谷歌翻译多余标签</div> */}

                    <div
                        onClick={() => {
                            const bodyF1 = f1.value?.contentDocument?.body;
                            const bodyF2 = f2.value?.contentDocument?.body;

                            const documentF1 = f1.value?.contentDocument;
                            const documentF2 = f2.value?.contentDocument;

                            const windowF1 = f1.value?.contentWindow;
                            const windowF2 = f2.value?.contentWindow;

                            console.time('aaa')
                            //
                            removeDomFontNode(bodyF1);
                            removeDomFontNode(bodyF2);
                            //
                            const allClassFlag = createDomFlag(bodyF1);
                            createDomFlag(bodyF2);
                            //
                            syncHeightAndScroll(bodyF1, bodyF2, allClassFlag);
                            //
                            syncScroll(documentF1, documentF2);
                            syncSelect(windowF1, windowF2);

                            console.timeEnd('aaa')
                        }}
                    >
                        同步滚动/选择/高度
                    </div>
                </div>
            </div>
        );
    },
})

export default Page;
