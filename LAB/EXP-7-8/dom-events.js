// Experiment 07 & 08, Part B (DOM manipulation) and Part C (event handling)
// Each section of the lab sheet has one card in dom-events.html.

"use strict";

const $ = (id) => document.getElementById(id);

// Write lines into a card's output box, and to the console
const print = (outId, ...lines) => {
    $(outId).textContent = lines.join("\n");
    console.log(`[${outId}]`, ...lines);
};

// Append one line, keeping the last `max` lines (for event logs)
const append = (outId, line, max = 8) => {
    const out = $(outId);
    const lines = out.textContent ? out.textContent.split("\n") : [];
    lines.push(line);
    out.textContent = lines.slice(-max).join("\n");
    console.log(`[${outId}]`, line);
};

/* =====================================================================
   PART B: DOM MANIPULATION
   ===================================================================== */

// ---- 4.2 Selecting elements -------------------------------------------
// getElementsByClassName returns a LIVE HTMLCollection (it updates itself).
// querySelectorAll returns a STATIC NodeList (a snapshot).
const liveParas = document.getElementsByClassName("text");
let staticParas = document.querySelectorAll(".text");

$("btnSelect").addEventListener("click", () => {
    const container = document.getElementById("container");
    const byTag = container.getElementsByTagName("p");
    const firstPara = document.querySelector(".text");
    staticParas = document.querySelectorAll(".text");

    const texts = [];
    staticParas.forEach(p => texts.push(p.textContent));

    print("out-4-2",
        `getElementById("container")          -> <${container.tagName.toLowerCase()} id="${container.id}">`,
        `getElementsByClassName("text")       -> ${liveParas.constructor.name}, length ${liveParas.length}`,
        `getElementsByTagName("p")            -> ${byTag.constructor.name}, length ${byTag.length}`,
        `querySelector(".text")               -> "${firstPara.textContent}" (first match only)`,
        `querySelectorAll(".text")            -> ${staticParas.constructor.name}, length ${staticParas.length}`,
        `querySelectorAll(".text").forEach    -> ${texts.join(", ")}`
    );
});

$("btnAddPara").addEventListener("click", () => {
    const p = document.createElement("p");
    p.className = "text";
    p.textContent = `Paragraph ${liveParas.length + 1} (added)`;
    $("container").appendChild(p);

    print("out-4-2",
        `Added one more .text paragraph.`,
        `HTMLCollection from getElementsByClassName: length ${liveParas.length}   (live, updated itself)`,
        `NodeList saved earlier from querySelectorAll: length ${staticParas.length}   (static snapshot, not updated)`,
        `Click "Run the selectors" to take a new snapshot.`
    );
});

// ---- 4.3 Modifying content ---------------------------------------------
const heading = $("contentHeading");
const originalHeading = heading.innerHTML;

$("btnReadText").addEventListener("click", () => {
    heading.innerHTML = originalHeading;
    print("out-4-3",
        `textContent: "${heading.textContent}"`,
        `innerText:   "${heading.innerText}"`,
        `textContent includes the hidden span. innerText only gives what is visible on screen.`
    );
});

$("btnSetText").addEventListener("click", () => {
    heading.textContent = "<em>Italic Heading</em>";
    print("out-4-3",
        `heading.textContent = "<em>Italic Heading</em>"`,
        `The tags are shown as plain text. Child elements now: ${heading.children.length}`
    );
});

$("btnSetHTML").addEventListener("click", () => {
    heading.innerHTML = "<em>Italic Heading</em>";
    print("out-4-3",
        `heading.innerHTML = "<em>Italic Heading</em>"`,
        `The browser parsed the tags and made a real <${heading.firstElementChild.tagName.toLowerCase()}> element. Child elements now: ${heading.children.length}`,
        `This is why innerHTML must never be used with text typed by a user (XSS).`
    );
});

// ---- 4.4 Modifying attributes ------------------------------------------
const link = $("demoLink");

$("btnGetAttr").addEventListener("click", () => {
    print("out-4-4",
        `link.getAttribute("href") -> "${link.getAttribute("href")}"   (exactly what is written in the HTML)`,
        `link.href                 -> "${link.href}"   (the full URL the browser will open)`,
        `link.getAttribute("target") -> ${JSON.stringify(link.getAttribute("target"))}`
    );
});

$("btnSetAttr").addEventListener("click", () => {
    link.setAttribute("href", "https://example.com");
    link.setAttribute("target", "_blank");
    link.textContent = "A link to example.com (opens in a new tab)";
    print("out-4-4",
        `setAttribute("href", "https://example.com")`,
        `setAttribute("target", "_blank")`,
        `Now: ${link.outerHTML}`
    );
});

$("btnRemoveAttr").addEventListener("click", () => {
    link.removeAttribute("target");
    print("out-4-4",
        `removeAttribute("target")`,
        `Now: ${link.outerHTML}`,
        `hasAttribute("target") -> ${link.hasAttribute("target")}`
    );
});

// ---- 4.5 Modifying styles ----------------------------------------------
const box = $("styleBox");

const describeBox = () =>
    `class="${box.className}"   style="${box.getAttribute("style") || ""}"   ` +
    `contains("highlight") -> ${box.classList.contains("highlight")}`;

$("btnInline").addEventListener("click", () => {
    box.style.fontSize = "20px";       // CSS font-size, written in camelCase
    box.style.marginTop = "10px";      // CSS margin-top
    print("out-4-5", `box.style.fontSize = "20px"; box.style.marginTop = "10px";`, describeBox());
});

$("btnToggle").addEventListener("click", () => {
    const added = box.classList.toggle("highlight");
    print("out-4-5", `classList.toggle("highlight") returned ${added} (${added ? "added" : "removed"})`, describeBox());
});

$("btnRound").addEventListener("click", () => {
    const added = box.classList.toggle("rounded");
    print("out-4-5", `classList.toggle("rounded") returned ${added}`, describeBox());
});

$("btnResetStyle").addEventListener("click", () => {
    box.removeAttribute("style");
    box.className = "box";
    print("out-4-5", "Reset: removed the style attribute and extra classes.", describeBox());
});

// ---- 4.6 and 4.7 Creating, adding and removing elements ----------------
const buildList = $("buildList");
let created = 0;

const makeItem = (where) => {
    created += 1;
    const li = document.createElement("li");
    li.textContent = `New item ${created} (${where})`;
    return li;
};

const listState = () =>
    `Items now (${buildList.children.length}): ` +
    [...buildList.children].map(li => li.textContent).join(" | ");

$("btnAppend").addEventListener("click", () => {
    buildList.append(makeItem("append"));
    print("out-4-6", `buildList.append(li)`, listState());
});

$("btnPrepend").addEventListener("click", () => {
    buildList.prepend(makeItem("prepend"));
    print("out-4-6", `buildList.prepend(li)`, listState());
});

$("btnAfter").addEventListener("click", () => {
    const first = buildList.firstElementChild;
    if (!first) return print("out-4-6", "The list is empty.");
    first.after(makeItem("after first"));
    print("out-4-6", `firstElementChild.after(li)`, listState());
});

$("btnMoveFirst").addEventListener("click", () => {
    const first = buildList.firstElementChild;
    if (!first) return print("out-4-6", "The list is empty.");
    buildList.appendChild(first);
    print("out-4-6",
        `buildList.appendChild(firstElementChild)`,
        `An element can only be in one place, so appending an existing element MOVES it to the end. No copy is made.`,
        listState());
});

$("btnRemoveLast").addEventListener("click", () => {
    const last = buildList.lastElementChild;
    if (!last) return print("out-4-6", "Nothing left to remove.");
    last.remove();
    print("out-4-6", `lastElementChild.remove()  removed "${last.textContent}"`, listState());
});

// ---- 4.8 Traversing the DOM --------------------------------------------
$("btnTraverse").addEventListener("click", () => {
    const item = document.querySelector(".item");
    const name = (el) => (el ? `<${el.tagName.toLowerCase()}${el.id ? ` id="${el.id}"` : ""}> "${el.textContent.trim().split("\n")[0]}"` : "null");
    const parent = item.parentElement;
    print("out-4-8",
        `item                         -> ${name(item)}`,
        `item.parentElement           -> <${parent.tagName.toLowerCase()} id="${parent.id}">`,
        `parent.children.length       -> ${parent.children.length}`,
        `parent.firstElementChild     -> ${name(parent.firstElementChild)}`,
        `parent.lastElementChild      -> ${name(parent.lastElementChild)}`,
        `item.previousElementSibling  -> ${name(item.previousElementSibling)}`,
        `item.nextElementSibling      -> ${name(item.nextElementSibling)}`,
        `parent.lastElementChild.nextElementSibling -> ${name(parent.lastElementChild.nextElementSibling)}`
    );
});

/* =====================================================================
   PART C: EVENT HANDLING
   ===================================================================== */

// ---- 5.2 Three ways to attach a handler ---------------------------------
// Method 1 is the onclick="..." attribute in dom-events.html.

// Method 2: the onclick PROPERTY. Only one handler fits, so the second replaces the first.
const btnProp = $("btnProp");
btnProp.onclick = () => append("out-5-2", "Method 2, first onclick handler");
btnProp.onclick = () => append("out-5-2", "Method 2, second onclick handler (the first one was replaced)");

// Method 3: addEventListener. Both handlers stay and run in order.
const btnListener = $("btnListener");
btnListener.addEventListener("click", () => append("out-5-2", "Method 3, listener 1"));
btnListener.addEventListener("click", () => append("out-5-2", "Method 3, listener 2 (both ran)"));

// ---- 5.3 and 5.4 Mouse events and the event object ----------------------
const moveArea = $("moveArea");
["click", "dblclick", "mouseover", "mouseout"].forEach(type => {
    moveArea.addEventListener(type, (event) => {
        append("out-5-3",
            `${event.type.padEnd(9)} target=<${event.target.tagName.toLowerCase()} id="${event.target.id}">  ` +
            `clientX=${event.clientX} clientY=${event.clientY}  timeStamp=${Math.round(event.timeStamp)} ms`);
    });
});

// ---- 5.5 Keyboard events -------------------------------------------------
$("keyInput").addEventListener("keydown", (event) => {
    append("out-5-5",
        `keydown  key="${event.key}"  code="${event.code}"  ctrlKey=${event.ctrlKey}  shiftKey=${event.shiftKey}`, 6);
});

// ---- 5.6 Form events ------------------------------------------------------
const form = $("myForm");
const username = $("username");

form.addEventListener("submit", (event) => {
    event.preventDefault();                          // no page reload
    const value = username.value.trim();
    append("out-5-6", `submit -> preventDefault() called, page did not reload. Submitted: "${value}"`, 4);
    form.reset();
    $("livePreview").textContent = "Live value: (empty)";
});

username.addEventListener("input", (event) => {
    $("livePreview").textContent = `Live value: ${event.target.value || "(empty)"}`;
});

// ---- 5.7 and 5.8 Bubbling, capturing, stopPropagation, preventDefault ----
const outer = $("outer");
const inner = $("inner");
let clickNo = 0;

// The third argument `true` means "listen in the capture phase" (root -> target)
outer.addEventListener("click", () => {
    clickNo += 1;
    append("out-5-7", `Click ${clickNo}: 1. Outer (capture phase, on the way down)`, 9);
}, true);

inner.addEventListener("click", (event) => {
    append("out-5-7", `Click ${clickNo}: 2. Inner clicked (target)`, 9);
    if ($("stopCheck").checked) {
        event.stopPropagation();
        append("out-5-7", `Click ${clickNo}:    stopPropagation() called, the bubble phase stops here`, 9);
    }
});

outer.addEventListener("click", () => {
    append("out-5-7", `Click ${clickNo}: 3. Outer clicked (bubble phase, on the way up)`, 9);
});

$("blockedLink").addEventListener("click", (event) => {
    event.preventDefault();                          // the browser does not open the link
    append("out-5-7", `Link clicked but not followed (preventDefault). defaultPrevented=${event.defaultPrevented}`, 9);
});

// ---- 5.9 Event delegation -------------------------------------------------
const taskList = $("taskList");

taskList.addEventListener("click", (event) => {
    if (event.target.tagName === "LI") {
        event.target.classList.toggle("done");
        append("out-5-9", `Clicked: ${event.target.textContent}  (done=${event.target.classList.contains("done")})`, 6);
    }
});

$("btnAddDelegate").addEventListener("click", () => {
    const li = document.createElement("li");
    li.textContent = `Task ${taskList.children.length + 1} (added later)`;
    taskList.appendChild(li);
    append("out-5-9", `Added "${li.textContent}". No new listener was attached, but clicking it works.`, 6);
});
