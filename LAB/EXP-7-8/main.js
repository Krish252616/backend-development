// Experiment 07 & 08, section 3.8: importing from math.js
// Loaded with <script type="module" src="main.js">, so `import` is allowed here.

import multiply, { PI, add } from "./math.js";

const lines = [
    `PI = ${PI}`,
    `add(2, 3) = ${add(2, 3)}`,
    `multiply(4, 5) = ${multiply(4, 5)}`,
    `typeof PI inside the module: ${typeof PI}`,
    `PI on window (global): ${typeof window.PI}`
];

lines.forEach(line => console.log("[3.8 Modules]", line));
document.getElementById("module-out").textContent = lines.join("\n");
