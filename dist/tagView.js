import { _ as _sfc_main$1, a as _imports_0 } from "./HelloWorld.js";
import { d as defineComponent, o as openBlock, c as createElementBlock, a as createVNode, F as Fragment, b as createBaseVNode, e as createApp } from "./vendor.js";
const _hoisted_1 = /* @__PURE__ */ createBaseVNode("img", {
  alt: "Vue logo",
  src: _imports_0
}, null, -1);
const _hoisted_2 = /* @__PURE__ */ createBaseVNode("div", null, "tagView", -1);
var _sfc_main = defineComponent({
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        _hoisted_1,
        createVNode(_sfc_main$1, { msg: "Hello Vue 3 + TypeScript + Vite" }),
        _hoisted_2
      ], 64);
    };
  }
});
var App_vue_vue_type_style_index_0_lang = "\n#app {\n        font-family: Avenir, Helvetica, Arial, sans-serif;\n        -webkit-font-smoothing: antialiased;\n        -moz-osx-font-smoothing: grayscale;\n        text-align: center;\n        color: #2c3e50;\n        margin-top: 60px;\n}\n";
console.log(123123);
createApp(_sfc_main).mount("#app");
//# sourceMappingURL=tagView.js.map
