---
title: "Experiment 07 and 08: ES6, DOM Manipulation and Event Handling"
layout: default
---

# Experiment 07 and 08: ES6, DOM Manipulation and Event Handling

**Course:** Backend Development Lab  
**Student:** Krish Pawar · B.Tech CSE · SAP ID 590017543 · UPES Dehradun  
**Date:** 14 October 2026

**Live pages:** [To-Do app](./index.html) · [Part A: ES6 features](./es6.html) · [Part B and C: DOM and events](./dom-events.html)  
**Source:** [`app.js`](https://github.com/Krish252616/backend-development/blob/main/LAB/EXP-7-8/app.js) · [`es6.js`](https://github.com/Krish252616/backend-development/blob/main/LAB/EXP-7-8/es6.js) · [`math.js`](https://github.com/Krish252616/backend-development/blob/main/LAB/EXP-7-8/math.js) · [`main.js`](https://github.com/Krish252616/backend-development/blob/main/LAB/EXP-7-8/main.js) · [`dom-events.js`](https://github.com/Krish252616/backend-development/blob/main/LAB/EXP-7-8/dom-events.js)

---

## 1. Aim

To understand and apply **ES6 (ECMAScript 2015)** features in JavaScript, to manipulate the **DOM (Document Object Model)**, and to handle **events**, and then to combine all three in an interactive To-Do list.

## 2. Objectives

After this experiment I am able to:

1. Write modern JavaScript with `let`/`const`, arrow functions, template literals, destructuring, spread/rest, default parameters, classes, modules, promises and async/await.
2. Select, create, change, move and remove elements in the DOM.
3. Attach event handlers in the three ways and explain why `addEventListener` is preferred.
4. Explain bubbling and capturing, and use `stopPropagation()`, `preventDefault()` and event delegation.
5. Build a working To-Do app that uses all of the above.

## 3. Tools and environment

| Item | Detail |
|---|---|
| Editor | Visual Studio Code with the Live Server extension |
| Browser | Google Chrome (DevTools Console and Elements tabs) |
| Language | HTML5, CSS3, JavaScript (ES6+), no libraries |
| Hosting | GitHub Pages (the three pages run live from this repository) |

## 4. Files

| File | What it contains |
|---|---|
| `index.html`, `app.js` | Section 6 of the lab sheet: the To-Do app |
| `es6.html`, `es6.js` | Part A, sections 3.1 to 3.10. Each card shows the code that ran and its output |
| `math.js`, `main.js` | Section 3.8: an ES6 module and the file that imports it (`<script type="module">`) |
| `dom-events.html`, `dom-events.js` | Part B (sections 4.2 to 4.8) and Part C (sections 5.2 to 5.9), one card per section |
| `style.css` | Shared styles for the three pages |

## 5. Procedure

1. Created the folder `LAB/EXP-7-8/` and the files above.
2. Wrote each ES6 example from the lab sheet inside its own function in `es6.js` (see Problem 1 in section 9), with a `log()` helper that prints to the page and to the console.
3. Wrote one demo card for every DOM and event section, each with buttons that run the real code and print the result.
4. Built the To-Do app from section 6 and added saving in `localStorage`, a summary line and an empty-list message.
5. Opened the pages through **Live Server** (not by double-clicking, see Problem 2), clicked through every button and checked the Console for errors.
6. Pushed to GitHub. GitHub Pages serves the pages over HTTPS, so they work live.

**How to run**

| Step | macOS | Windows |
|---|---|---|
| Open with Live Server | Right-click `index.html` in VS Code, **Open with Live Server** | Same |
| Or start a server from the terminal | `cd LAB/EXP-7-8` then `python3 -m http.server 8000` | `cd LAB\EXP-7-8` then `python -m http.server 8000` (or `py -m http.server 8000`) |
| Then open | http://localhost:8000 | Same |
| Open the Console | `Cmd + Option + J` | `Ctrl + Shift + J` or `F12` |
| Hard reload | `Cmd + Shift + R` | `Ctrl + Shift + R` or `Ctrl + F5` |

## 6. Theory and implementation

### 6.1 Part A: ES6

| Feature | One-line idea | Seen in |
|---|---|---|
| `let` / `const` | Block scoped. `const` cannot be reassigned. `var` is function scoped | 3.1 |
| Arrow functions | Short syntax. No own `this`, it comes from the surrounding code | 3.2 |
| Template literals | Backticks, `${expression}` inside, multi-line strings | 3.3 |
| Destructuring | Pull values out of arrays and objects into variables | 3.4, `renderTasks()` |
| Spread / rest `...` | Spread expands an array or object. Rest collects the remaining values | 3.5, `addTask()` |
| Default parameters | Used when the argument is `undefined` | 3.6 |
| Classes | `class`, `constructor`, `extends`, `super`, `static` | 3.7, `class Task` |
| Modules | `export` in one file, `import` in another, needs `type="module"` | 3.8 |
| Promises, async/await | Work that finishes later. `await` waits without blocking the page | 3.9 |
| Object literal shorthand | `{ name, age }`, methods without `function`, `[key]` names | 3.10 |

### 6.2 Part B: DOM

The browser turns the HTML into a tree of nodes. JavaScript reads and changes that tree, and the page updates without a reload.

| Job | Methods used |
|---|---|
| Select | `getElementById`, `getElementsByClassName`, `getElementsByTagName`, `querySelector`, `querySelectorAll` |
| Change content | `textContent`, `innerText`, `innerHTML` |
| Change attributes | `getAttribute`, `setAttribute`, `removeAttribute`, `hasAttribute`, `.href` |
| Change style | `element.style.fontSize`, `classList.add / remove / toggle / contains` |
| Create and insert | `createElement`, `append`, `prepend`, `after`, `appendChild` |
| Remove | `element.remove()` |
| Move around | `parentElement`, `children`, `firstElementChild`, `lastElementChild`, `nextElementSibling`, `previousElementSibling` |

### 6.3 Part C: Events

An event is something that happens in the page (a click, a key, a form submit). `addEventListener(type, handler)` runs the handler each time, and passes an **event object** with details such as `type`, `target`, `clientX`, `key` and `timeStamp`.

A click travels in three phases: **capture** (from the document down to the clicked element), **target**, and **bubble** (back up). That is why a listener on a parent also hears clicks on its children, which is what **event delegation** uses.

### 6.4 The To-Do app (`app.js`)

```javascript
class Task {
    constructor(title) {
        this.id = Math.max(Date.now(), ...tasks.map(t => t.id + 1));
        this.title = title;
        this.completed = false;
    }
}

const addTask = () => {
    const title = input.value.trim();
    if (!title) return;                    // ignore empty or spaces-only input
    tasks = [...tasks, new Task(title)];   // spread operator
    input.value = "";
    renderTasks();
};

// ONE listener on the <ul> handles every Delete button and every task click
list.addEventListener("click", (event) => {
    const li = event.target.closest("li");
    if (!li) return;
    const id = Number(li.dataset.id);      // dataset values are always strings

    if (event.target.classList.contains("delete-btn")) {
        tasks = tasks.filter(t => t.id !== id);
    } else {
        tasks = tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
    }
    renderTasks();
});
```

`renderTasks()` clears the list and rebuilds it from the `tasks` array with `createElement`, `textContent`, `classList` and `dataset`, then saves the array with `localStorage.setItem("exp78-tasks", JSON.stringify(tasks))`.

**Changes from the lab sheet's code, and why**

| Change | Reason |
|---|---|
| Tasks are saved in `localStorage` and loaded on start | Without it the list is lost on every reload |
| The id is `Math.max(Date.now(), last id + 1)` instead of only `Date.now()` | Two tasks added in the same millisecond would get the same id, and then one click would toggle or delete both. Tested: with only `Date.now()`, 3 tasks added in one script run got the same id and one click toggled all 3. With the fix all 3 ids were different |
| A summary line (`3 tasks, 1 done`) and a "No tasks yet." message | Feedback for the user. The summary uses a template literal and `filter` |
| `input.focus()` after adding | The user can type the next task straight away |

Concepts used in the app: `const`/`let`, arrow functions, template literals, destructuring, spread, a class, DOM selection, `createElement`, `classList`, `dataset`, `closest`, `addEventListener`, the `keydown` event and event delegation.

## 7. Output

### 7.1 To-Do app

Empty list on first visit:

![Empty to-do list](screenshots/todo-empty.png)

Four tasks added (two with the Add button, two with Enter). An input of only spaces was ignored. The task typed as `<b>Push the code to GitHub</b>` is shown as plain text, not bold, because the app uses `textContent`:

![Tasks added](screenshots/todo-added.png)

The first task clicked (marked done, line-through) and "Practice DOM questions" deleted:

![Toggle and delete](screenshots/todo-toggle-delete.png)

After reloading the page the same 3 tasks, with the same one done, are still there (loaded from `localStorage`):

![After reload](screenshots/todo-after-reload.png)

### 7.2 Part A: ES6 features

Each screenshot shows the code that ran (taken from the function itself) and its output.

![3.1 let and const](screenshots/es6-3-1.png)

![3.2 Arrow functions](screenshots/es6-3-2.png)

![3.3 Template literals](screenshots/es6-3-3.png)

![3.4 Destructuring](screenshots/es6-3-4.png)

![3.5 Spread and rest](screenshots/es6-3-5.png)

![3.6 Default parameters](screenshots/es6-3-6.png)

![3.7 Classes](screenshots/es6-3-7.png)

![3.8 Modules](screenshots/es6-3-8.png)

![3.9 Promises and async/await](screenshots/es6-3-9.png)

![3.10 Enhanced object literals](screenshots/es6-3-10.png)

The same output in the Chrome DevTools Console. The order is worth noticing: everything from `es6.js` prints first, then the module `main.js` (module scripts run after the page has been read), and the promise results come last, about 1000 ms later:

![DevTools Console](screenshots/es6-devtools-console.png)

### 7.3 Part B: DOM manipulation

**4.2 Selecting.** After one more `.text` paragraph was added, the `HTMLCollection` from `getElementsByClassName` grew to 3 on its own, but the `NodeList` saved earlier from `querySelectorAll` still said 2:

![Selecting elements](screenshots/dom-4-2-selecting.png)

**4.3 Content.** `textContent` includes the hidden span, `innerText` does not:

![textContent vs innerText](screenshots/dom-4-3-content.png)

With `innerHTML` the string `<em>Italic Heading</em>` became a real `<em>` element (with `textContent` the tags would be shown as text):

![innerHTML](screenshots/dom-4-3-innerhtml.png)

**4.4 Attributes.** `getAttribute("href")` gives `es6.html` as written, while `.href` gives the full URL. Then `setAttribute` changed `href` and added `target="_blank"`:

![Attributes](screenshots/dom-4-4-attributes.png)

**4.5 Styles.** Inline styles set with camelCase names (`fontSize`, `marginTop`), and `classList.toggle("highlight")` returned `true` because the class was added:

![Styles](screenshots/dom-4-5-styles.png)

**4.6 and 4.7 Create, insert, move, remove.** `append`, `prepend` and `after` added new items. `appendChild` on an item that was already in the list **moved** it to the end instead of copying it:

![Create and remove](screenshots/dom-4-6-create-remove.png)

**4.8 Traversing** from the `.item` element:

![Traversing](screenshots/dom-4-8-traversing.png)

### 7.4 Part C: Event handling

**5.2 Three ways.** The `onclick` property was set twice and only the second handler ran. `addEventListener` was called twice and both handlers ran:

![Three ways to attach](screenshots/events-5-2-three-ways.png)

**5.3 and 5.4 Mouse events and the event object.** A double-click fired `click`, `click`, then `dblclick`:

![Mouse events](screenshots/events-5-3-mouse.png)

**5.5 Keyboard.** Typing `H`, `i`, then `Shift + A` and `Ctrl + C`. `key` is the character, `code` is the physical key, and `shiftKey` / `ctrlKey` show the modifier:

![Keyboard events](screenshots/events-5-5-keyboard.png)

**5.6 Form.** The `input` event updates the preview on every keystroke:

![Input event](screenshots/events-5-6-input.png)

On submit, `preventDefault()` stopped the page reload (the URL stayed the same) and the value was read in JavaScript:

![Submit event](screenshots/events-5-6-form.png)

**5.7 and 5.8 Bubbling, capturing, stopPropagation, preventDefault.** Click 1: outer (capture), inner, outer (bubble). Click 2 with `stopPropagation()`: the bubble step did not happen. The link to example.com was not followed because of `preventDefault()`:

![Bubbling](screenshots/events-5-7-bubbling.png)

**5.9 Event delegation.** One listener on the `<ul>`. "Task 4 (added later)" was created after the listener and clicking it still worked:

![Delegation](screenshots/events-5-9-delegation.png)

## 8. Observations (what I learned)

1. `const` is the default choice. It stops reassignment, but a `const` array or object can still be changed inside (`tasks.push` would work), which is why the app replaces the array instead (`tasks = [...tasks, task]`).
2. `typeof blockVar` outside its block gives `undefined`, while `funcVar` declared with `var` inside the same `if` block is still visible. `let` respects blocks, `var` does not.
3. In strict mode, `this` inside a normal callback function is `undefined`. Inside an arrow function it is the object around it (`this.count` was `5`). This is the main practical reason to use arrows in callbacks.
4. A default parameter is used only for `undefined`. Passing `null` printed `Hello, null!`.
5. `getElementsByClassName` gives a **live** list and `querySelectorAll` gives a **static** snapshot. Both look like arrays but only a `NodeList` has `forEach`.
6. `textContent` treats everything as text, `innerHTML` parses tags. User input must go through `textContent`, otherwise typed HTML (or a script) becomes part of the page. The To-Do app proved this with the `<b>` test.
7. An element can exist in only one place in the DOM. `appendChild` on an existing element moves it.
8. `addEventListener` allows many handlers. The `onclick` property keeps only the last one, and an `onclick` attribute mixes JavaScript into the HTML.
9. One click is seen by the parent too (bubbling). Event delegation uses this, so one listener covers items that are added later and fewer listeners are needed.
10. A double-click also fires two `click` events. Code that handles both must expect that.
11. `dataset` values are always strings, so the id had to be converted with `Number()` before comparing with `===`.

## 9. Problems faced and how I fixed them

| # | Problem | Cause | Fix |
|---|---|---|---|
| 1 | Putting all the ES6 snippets from the lab sheet in one file failed with `SyntaxError: Identifier 'add' has already been declared` and nothing ran | Section 3.2 has `function add` and then `const add`, and `name`/`age` are declared again in 3.3, 3.4 and 3.10. A `const` or `let` name cannot be declared twice in the same scope, and a SyntaxError stops the whole file | Put each section inside its own function, so each has its own scope |
| 2 | Opening `es6.html` by double-clicking the file: the 3.8 module card stayed on "Module did not load", and the Console showed `Access to script at 'file:///.../main.js' from origin 'null' has been blocked by CORS policy` | Browsers do not load `type="module"` scripts from `file://` addresses. The other scripts still worked | Open the page through a server: VS Code Live Server, `python3 -m http.server` (macOS) / `python -m http.server` (Windows), or GitHub Pages |
| 3 | With the lab sheet's `app.js`, adding three tasks from one script run gave all three the same id (`1791961430546`). One click marked all 3 done, and one Delete removed all 3 | `Date.now()` returns the same number for tasks created in the same millisecond, and toggle and delete find tasks by id | The id is now one more than the largest existing id whenever `Date.now()` is not bigger. Same test after the fix: 3 different ids |
| 4 | Comparing `li.dataset.id === t.id` never matches, so clicks would do nothing | `dataset.id` is the string `"1791961236730"`, the task id is a number, and `===` does not convert types | Kept the lab sheet's `Number(li.dataset.id)` |
| 5 | Pressing the Submit button reloaded the page and the output vanished | A form's default action is to send the data and load a new page | `event.preventDefault()` in the `submit` handler |
| 6 | All tasks disappeared after a reload | The array lives only in memory | Saved it in `localStorage` (inside `try...catch`, because storage can be blocked in private mode) |
| 7 | A script placed in `<head>` stops with `Cannot read properties of null` | `getElementById` runs before the elements exist | All `<script>` tags are at the end of `<body>`. `DOMContentLoaded` (or `defer`) is the other option |
| 8 | Keyboard shortcuts in the lab sheet did not match on Mac | The Console shortcut is `Cmd + Option + J` on macOS and `Ctrl + Shift + J` on Windows. In the keyboard demo `Ctrl + C` sets `ctrlKey`, but on a Mac the copy shortcut uses `Cmd`, which sets `metaKey` instead | Wrote both shortcuts in the page and in section 5 |

Problem 2, `es6.html` opened from `file://`. The other cards worked, only the module card could not load:

![Module blocked on file://](screenshots/es6-3-8-file-protocol-error.png)

## 10. Viva questions

**Q1. Difference between `var`, `let` and `const`?**
`var` is function scoped and can be redeclared. `let` is block scoped and can be reassigned. `const` is block scoped and cannot be reassigned (but an object or array behind it can still be changed).

**Q2. What is different about `this` in an arrow function?**
An arrow function has no `this` of its own. It uses `this` from the code it was written in, which makes it useful for callbacks inside methods.

**Q3. Spread vs rest?**
Both use `...`. Spread expands an array or object into separate values (`[...a, ...b]`). Rest collects several values into one array (`function sum(...numbers)`).

**Q4. What does `await` do?**
It pauses the `async` function until the promise settles and gives back its value. The rest of the page keeps running. Errors from a rejected promise are caught with `try...catch`.

**Q5. Why does `type="module"` need a server?**
Module scripts are loaded with CORS rules. A `file://` page has the origin `null`, so the browser blocks it. Over `http://` or `https://` it works.

**Q6. `textContent` vs `innerHTML` vs `innerText`?**
`textContent` gets or sets plain text (all of it, hidden or not). `innerHTML` reads and writes HTML, so tags are parsed. `innerText` gives only the text that is visible, following CSS.

**Q7. `querySelector` vs `getElementById`?**
`getElementById` finds one element by id. `querySelector` takes any CSS selector and returns the first match. `querySelectorAll` returns all matches as a static NodeList.

**Q8. What is event bubbling?**
After an event reaches its target it travels back up through every parent element, so their listeners run too, from the inside out.

**Q9. `stopPropagation()` vs `preventDefault()`?**
`stopPropagation()` stops the event from moving to other elements. `preventDefault()` stops the browser's own action, such as following a link or submitting a form.

**Q10. What is event delegation and why use it?**
One listener on a parent handles events from its children by checking `event.target`. It works for children added later and uses fewer listeners.

**Q11. Why `addEventListener` instead of `onclick`?**
It allows several handlers for the same event, can listen in the capture phase, and can be removed with `removeEventListener`. The `onclick` property holds only one handler.

**Q12. What is `dataset`?**
It reads and writes `data-*` attributes. `li.dataset.id = 5` creates `data-id="5"`. Values are always strings.

## 11. Result

ES6 features, DOM manipulation and event handling were implemented and tested in three live pages. Every example from the lab sheet ran with its output shown on the page and in the Console. The To-Do app adds, completes and deletes tasks with a single delegated listener, keeps the list after a reload, and shows user input as plain text.

## 12. Conclusion

ES6 made the code shorter and clearer (arrow functions, template literals, destructuring, spread, classes). The DOM API was enough to build and change the whole page from JavaScript, and events with delegation made it interactive with very little code. Testing also showed two things the lab sheet does not say directly: its snippets cannot be pasted into one file as they are, and module scripts do not work from `file://`. These same ideas are what frameworks like React build on.

## 13. References

1. MDN Web Docs: *JavaScript Guide*. <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide>
2. MDN Web Docs: *Introduction to the DOM*. <https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction>
3. MDN Web Docs: *EventTarget: addEventListener() method*. <https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener>
4. MDN Web Docs: *JavaScript modules*. <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules>
