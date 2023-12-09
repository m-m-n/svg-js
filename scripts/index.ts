import { expandGlobSync } from "https://deno.land/std@0.208.0/fs/mod.ts";
import { basename } from "https://deno.land/std@0.208.0/path/mod.ts";
import { lowerCase } from "https://deno.land/x/case@2.2.0/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.43/deno-dom-wasm.ts";

const icons = await (async () => {
  let icons: Record<string, string> = {};
  for (const entry of expandGlobSync("/resources/*.svg")) {
    const iconName = lowerCase(basename(entry.path, ".svg"));
    const svg = await Deno.readTextFile(entry.path);
    const doc = new DOMParser().parseFromString(svg, "text/html");
    icons[iconName] = doc.querySelector("svg").outerHTML;
  }
  return icons;
})();

const template = `/**
 * SVGを埋め込むJavaScript
 * <div data-icon="\${icons.key}"></div> のような形で利用する
 * JavaScriptの動作としてはDOMが構築された際にdata-icon属性のある要素に対し
 * data-iconの値を取得してiconsのキーとして存在していればiconsの内容を取得した要素の子要素として設定する
 */
(() => {
  const icons = ${JSON.stringify(icons)};
  document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll("[data-icon]");
    for (const element of elements) {
      const icon = element.getAttribute("data-icon");
      if (icon in icons) {
        element.innerHTML = icons[icon];
      }
    }
  });
})();
`;

Deno.writeTextFile("/build/svg.js", template);
