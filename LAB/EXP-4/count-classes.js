// Experiment 4, Exercise 3: count the CSS classes used in the Bootstrap and Tailwind pages.
// Run from this folder:  node count-classes.js
const fs = require("fs");

function countClasses(file, fromMarker, toMarker) {
  let html = fs.readFileSync(file, "utf8");
  if (fromMarker) html = html.slice(html.indexOf(fromMarker), toMarker ? html.indexOf(toMarker) : undefined);
  const lists = [...html.matchAll(/class="([^"]*)"/g)].map(m => m[1].trim().split(/\s+/).filter(Boolean));
  const all = lists.flat();
  return {
    elements: lists.length,                         // elements that have a class attribute
    total: all.length,                              // every class name written
    unique: new Set(all).size,                      // different class names
    perElement: (all.length / lists.length).toFixed(1),
    longest: Math.max(...lists.map(l => l.length))  // most classes on one element
  };
}

const rows = [
  ["Bootstrap, whole page", countClasses("exp04-bootstrap.html")],
  ["Tailwind, whole page", countClasses("exp04-tailwind.html")],
  ["Bootstrap, steps/task4 (sheet)", countClasses("steps/task4-bootstrap.html")],
  ["Tailwind, steps/task8 (sheet)", countClasses("steps/task8-tailwind.html")],
  ["Bootstrap, contact form only", countClasses("exp04-bootstrap.html", 'id="contact"', "<!-- Footer -->")],
  ["Tailwind, contact form only", countClasses("exp04-tailwind.html", 'id="contact"', "<!-- Footer -->")]
];

console.table(Object.fromEntries(rows));
