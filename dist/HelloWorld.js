import { p as pushScopeId, f as popScopeId, d as defineComponent, r as ref, o as openBlock, c as createElementBlock, b as createBaseVNode, t as toDisplayString, F as Fragment, g as createTextVNode } from "./vendor.js";
const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
};
p();
var _imports_0 = "/logo.png";
pushScopeId("data-v-469af010");
const _hoisted_1 = /* @__PURE__ */ createBaseVNode("p", null, [
  /* @__PURE__ */ createTextVNode(" Recommended IDE setup: "),
  /* @__PURE__ */ createBaseVNode("a", {
    href: "https://code.visualstudio.com/",
    target: "_blank"
  }, "VSCode"),
  /* @__PURE__ */ createTextVNode(" + "),
  /* @__PURE__ */ createBaseVNode("a", {
    href: "https://github.com/johnsoncodehk/volar",
    target: "_blank"
  }, "Volar")
], -1);
const _hoisted_2 = /* @__PURE__ */ createBaseVNode("p", null, [
  /* @__PURE__ */ createTextVNode("See "),
  /* @__PURE__ */ createBaseVNode("code", null, "README.md"),
  /* @__PURE__ */ createTextVNode(" for more information.")
], -1);
const _hoisted_3 = /* @__PURE__ */ createBaseVNode("p", null, [
  /* @__PURE__ */ createBaseVNode("a", {
    href: "https://vitejs.dev/guide/features.html",
    target: "_blank"
  }, " Vite Docs "),
  /* @__PURE__ */ createTextVNode(" | "),
  /* @__PURE__ */ createBaseVNode("a", {
    href: "https://v3.vuejs.org/",
    target: "_blank"
  }, "Vue 3 Docs")
], -1);
const _hoisted_4 = /* @__PURE__ */ createBaseVNode("p", null, [
  /* @__PURE__ */ createTextVNode(" Edit "),
  /* @__PURE__ */ createBaseVNode("code", null, "components/HelloWorld.vue"),
  /* @__PURE__ */ createTextVNode(" to test hot module replacement. ")
], -1);
popScopeId();
var _sfc_main = defineComponent({
  props: {
    msg: { type: String, required: true }
  },
  setup(__props) {
    const count = ref(0);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("h1", null, toDisplayString(__props.msg), 1),
        _hoisted_1,
        _hoisted_2,
        _hoisted_3,
        createBaseVNode("button", {
          type: "button",
          onClick: _cache[0] || (_cache[0] = ($event) => count.value++)
        }, "count is: " + toDisplayString(count.value), 1),
        _hoisted_4
      ], 64);
    };
  }
});
var HelloWorld_vue_vue_type_style_index_0_scoped_true_lang = "\na[data-v-469af010] {\n  color: #42b983;\n}\nlabel[data-v-469af010] {\n  margin: 0 0.5em;\n  font-weight: bold;\n}\ncode[data-v-469af010] {\n  background-color: #eee;\n  padding: 2px 4px;\n  border-radius: 4px;\n  color: #304455;\n}\n";
_sfc_main.__scopeId = "data-v-469af010";
export { _sfc_main as _, _imports_0 as a };
//# sourceMappingURL=HelloWorld.js.map
