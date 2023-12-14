import { expandGlobSync } from "https://deno.land/std@0.208.0/fs/mod.ts";
import { basename } from "https://deno.land/std@0.208.0/path/mod.ts";
import { lowerCase } from "https://deno.land/x/case@2.2.0/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.43/deno-dom-wasm.ts";
import * as dejs from "https://deno.land/x/dejs@0.10.3/mod.ts";

const icons = await (async () => {
  let icons: Record<string, string> = {};
  for (const entry of expandGlobSync("/resources/*.svg")) {
    const iconName = lowerCase(basename(entry.path, ".svg"));
    const svg = await Deno.readTextFile(entry.path);
    const doc = new DOMParser().parseFromString(svg, "text/html");
    icons[iconName] = doc.querySelector("svg").
      outerHTML.
      split("\n").
      map(line => line.trim()).
      filter(line => line !== "").
      join("");
  }
  return icons;
})();

Deno.writeTextFile("/build/svg.js", await dejs.renderFileToString("/scripts/template.ejs", {
  icons: JSON.stringify(icons),
}));
