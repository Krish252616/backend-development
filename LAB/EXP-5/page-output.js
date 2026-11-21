// Prints the output of script.js and script2.js on the page as well, so it can be read
// without DevTools (for example on GitHub Pages).
//
// The real scripts are loaded normally with <script src>, so the console output and its
// line numbers are exactly theirs. This file fetches the same source a second time and runs
// it with a stand-in console that writes into the page instead.
(function () {
  const format = (value) => {
    if (typeof value === "string") return value;
    try { return JSON.stringify(value); } catch (e) { return String(value); }
  };

  async function show(file, outId) {
    const out = document.getElementById(outId);
    try {
      const response = await fetch(file);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const source = await response.text();
      const pageConsole = { log: (...args) => { out.textContent += args.map(format).join(" ") + "\n"; } };
      new Function("console", source)(pageConsole);
    } catch (error) {
      out.textContent = `Could not load ${file} (${error.message}). Open this page through a web server ` +
        "(GitHub Pages or VS Code Live Server). The console output above is not affected.";
    }
  }

  show("script.js", "out-script1");
  show("script2.js", "out-script2");
})();
