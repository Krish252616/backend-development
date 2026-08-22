---
title: "Experiment 1 — Create a web page with all possible elements of HTML5"
layout: default
---

# Experiment 1 — Create a web page with all possible elements of HTML5

**Course:** Backend Development Lab
**Course Outcome Mapped:** CO2 — Create and build web pages and applications
**Student:** Krish Pawar · B.Tech CSE · UPES Dehradun
**Date:** 22 August 2026

**Live output:** [`index.html`](./index.html) · **Source:** [`index.html`](./index.html)

---

## 1. Aim

To design and build a single, standards-compliant HTML5 document that demonstrates every major
category of the HTML5 element vocabulary — semantic sectioning, text-level semantics, grouping
content, tabular data, forms and native validation, embedded multimedia, graphics, interactive
elements, and scripted access to the Document Object Model.

## 2. Objectives

After completing this experiment, I am able to:

1. Create a well-structured HTML5 web page using appropriate semantic elements.
2. Differentiate between HTML4 and HTML5 structural elements.
3. Apply the various HTML5 form input types and validation attributes.
4. Implement multimedia elements (`<audio>`, `<video>`) in web pages.
5. Explain the Document Object Model (DOM) structure of a rendered page.
6. Create accessible and SEO-friendly web pages using semantic HTML.

## 3. Tools and environment

| Item | Detail |
|---|---|
| Editor | Visual Studio Code |
| Runtime | Google Chrome 128 / Safari 18 |
| Preview | VS Code **Go Live** (Live Server extension) |
| Validation | [W3C Markup Validation Service](https://validator.w3.org/) |
| Version control | Git + GitHub Pages |
| Language | HTML5, CSS3, vanilla JavaScript (ES6) |

---

## 4. Theory

### 4.1 What HTML5 changed

HTML5 became a W3C Recommendation in October 2014 and is now maintained as a *living standard* by
the WHATWG. Its three headline shifts were:

1. **Meaning over markup.** HTML4 layouts were built from generic `<div>` containers distinguished
   only by `id` or `class` names — strings that mean something to the developer and nothing to a
   machine. HTML5 introduced elements whose *names* declare their role, so a browser, a search
   crawler and a screen reader all agree on what a region is without reading any CSS.
2. **Native capability instead of plug-ins.** Audio, video, vector graphics, raster drawing surfaces,
   offline storage and geolocation moved into the browser itself, removing the dependence on Flash,
   Silverlight and Java applets.
3. **Simplification.** The doctype collapsed from a long DTD reference to `<!DOCTYPE html>`, and the
   character-set declaration to `<meta charset="UTF-8">`.

### 4.2 The seven element families used in this experiment

| # | Family | Representative elements |
|---|---|---|
| 1 | Document metadata | `<head>`, `<meta>`, `<title>`, `<link>`, `<style>`, `<base>` |
| 2 | Sectioning | `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<address>` |
| 3 | Grouping content | `<p>`, `<hr>`, `<pre>`, `<blockquote>`, `<ul>`, `<ol>`, `<li>`, `<dl>`, `<dt>`, `<dd>`, `<figure>`, `<figcaption>`, `<div>` |
| 4 | Text-level semantics | `<a>`, `<em>`, `<strong>`, `<small>`, `<s>`, `<cite>`, `<q>`, `<dfn>`, `<abbr>`, `<time>`, `<code>`, `<var>`, `<samp>`, `<kbd>`, `<sub>`, `<sup>`, `<i>`, `<b>`, `<u>`, `<mark>`, `<ruby>`, `<rt>`, `<rp>`, `<bdi>`, `<bdo>`, `<span>`, `<br>`, `<wbr>`, `<ins>`, `<del>` |
| 5 | Embedded content | `<img>`, `<picture>`, `<source>`, `<iframe>`, `<video>`, `<audio>`, `<track>`, `<map>`, `<area>`, `<canvas>`, `<svg>` |
| 6 | Tabular data | `<table>`, `<caption>`, `<colgroup>`, `<col>`, `<thead>`, `<tbody>`, `<tfoot>`, `<tr>`, `<th>`, `<td>` |
| 7 | Forms & interactive | `<form>`, `<fieldset>`, `<legend>`, `<label>`, `<input>`, `<datalist>`, `<select>`, `<optgroup>`, `<option>`, `<textarea>`, `<button>`, `<output>`, `<progress>`, `<meter>`, `<details>`, `<summary>`, `<dialog>`, `<template>`, `<script>`, `<noscript>` |

---

## 5. Objective 2 — HTML4 vs HTML5 structural elements

| Purpose | HTML4 approach | HTML5 element | Why it matters |
|---|---|---|---|
| Page banner | `<div id="header">` | `<header>` | Exposed as a `banner` landmark to assistive technology |
| Primary navigation | `<div id="nav">` | `<nav>` | Screen readers offer "skip to navigation" |
| Main content | `<div id="content">` | `<main>` | One per page; powers "skip to main content" |
| Thematic chunk | `<div class="section">` | `<section>` | Contributes to the document outline |
| Standalone unit | `<div class="post">` | `<article>` | Syndication and search engines identify it as a unit |
| Sidebar | `<div id="sidebar">` | `<aside>` | Marks content as tangential, so it can be de-prioritised |
| Page foot | `<div id="footer">` | `<footer>` | Exposed as a `contentinfo` landmark |
| Image + caption | `<div>` + `<p class="caption">` | `<figure>` + `<figcaption>` | Caption is programmatically bound to the image |
| Dates | Plain text | `<time datetime="...">` | Machine-readable; feeds rich search results |
| Media playback | Flash / Silverlight object | `<audio>`, `<video>` | No plug-in, works on mobile, keyboard accessible |
| Drawing | Java applet | `<canvas>`, inline `<svg>` | Scriptable, GPU-accelerated, part of the page |
| Accordion | `<div>` + JavaScript | `<details>` + `<summary>` | Behaviour is native and accessible by default |
| Modal | `<div>` + a modal library | `<dialog>` | Browser handles backdrop, focus trap and `Esc` |
| Field validation | JavaScript on submit | `required`, `pattern`, `type="email"` | Runs before any script loads |

**Other syntax differences**

| | HTML4 | HTML5 |
|---|---|---|
| Doctype | `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" ...>` | `<!DOCTYPE html>` |
| Charset | `<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">` | `<meta charset="UTF-8">` |
| Script tag | `<script type="text/javascript">` | `<script>` |
| Parsing | Based on SGML DTD | Defined parsing algorithm, error recovery specified |

---

## 6. Objective 3 — Form input types and attributes used

### 6.1 Input types demonstrated

| Type | Field in the page | What the browser adds |
|---|---|---|
| `text` | Full name | Baseline field |
| `email` | Email address | Format check + `@` key on mobile keypads |
| `password` | Password | Masked characters |
| `tel` | Phone | Numeric keypad on mobile |
| `url` | Portfolio URL | Scheme validation |
| `search` | Search this page | Clear ("×") affordance |
| `number` | Semester | Spinner, `min`/`max` enforcement |
| `range` | Confidence slider | Slider widget, bound to `<output>` |
| `date` | Date of birth | Native date picker |
| `time` | Lab slot | Clock picker |
| `datetime-local` | Submission timestamp | Combined date + time picker |
| `month` | Month of intake | Month/year picker |
| `week` | Academic week | ISO week picker |
| `color` | Accent colour | OS colour picker |
| `file` | Attach report | File chooser, filtered by `accept` |
| `checkbox` | Topics covered | Zero-or-more selection |
| `radio` | Experience level | Exactly-one selection per `name` |
| `hidden` | `experiment_id` | Submitted but never rendered |
| `submit` / `reset` | Buttons | Triggers validation / clears the form |

### 6.2 Validation and helper attributes

`required`, `minlength`, `maxlength`, `min`, `max`, `step`, `pattern`, `title`, `placeholder`,
`accept`, `multiple`, `autocomplete`, `list`, `readonly`, `disabled`, `selected`, `checked`.

The password field is a good example of `pattern` doing work that used to need JavaScript:

```html
<input type="password" id="password" name="password"
       pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
       title="At least 8 characters, with one uppercase, one lowercase and one digit">
```

The `title` is not decoration here — it is the message the browser shows when the pattern fails.

### 6.3 Related form elements

- `<datalist>` — attaches a suggestion list to a free-text input, so the user may pick a suggestion
  *or* type their own value. A `<select>` allows neither.
- `<output>` — a live result region; here it mirrors the range slider's value.
- `<progress>` — how far along a known task is.
- `<meter>` — a scalar measurement inside a known range, with `low`, `high` and `optimum`
  thresholds that colour the bar. *Progress is a journey; meter is a gauge.*

---

## 7. Objective 4 — Multimedia implementation

```html
<video controls width="640" preload="metadata" muted playsinline>
  <source src="mov_bbb.mp4" type="video/mp4">
  <source src="mov_bbb.ogg" type="video/ogg">
  <track kind="captions" srclang="en" label="English captions">
  Your browser does not support the video element.
</video>
```

Three layers of graceful degradation are at work:

1. The browser walks the `<source>` children top to bottom and plays the **first** format it can
   decode. Codec support still varies, so shipping MP4 (H.264) plus WebM/Ogg covers effectively
   every device.
2. `<track kind="captions">` supplies a WebVTT caption file. Captions are the single most important
   accessibility feature of video.
3. The text node inside `<video>` is the fallback for any browser that does not know the element at
   all — it renders only in that case.

Key attributes: `controls`, `autoplay`, `muted`, `loop`, `poster`, `preload`, `playsinline`.
Note that browsers block `autoplay` **unless** the video is also `muted` — a deliberate policy
change made after auto-playing audio became a usability problem.

---

## 8. Objective 5 — The Document Object Model

When the browser parses the HTML file, it builds an in-memory tree of **nodes**. Every element,
attribute, text run and comment becomes a node. JavaScript manipulates that tree; the `.html` file
on disk is never modified.

```
document
└── html (lang="en")
    ├── head
    │   ├── meta (charset)
    │   ├── title  →  "HTML5 Element Specimen — Experiment 1"
    │   └── style
    └── body
        └── div.sheet
            ├── header.masthead
            │   ├── h1
            │   └── nav → ol → li → a  (×9)
            ├── main
            │   ├── section#structure
            │   ├── section#text
            │   ├── ... (7 more)
            │   └── section#dom
            └── footer
                └── address
```

**Terminology used in the page's script**

| Term | Meaning here |
|---|---|
| Root node | `document` |
| Parent / child | `main` is the parent of each `section` |
| Sibling | `section#text` is the next sibling of `section#structure` |
| Element node | `<h1>` |
| Text node | The characters inside `<h1>` |
| Attribute | `id="structure"` on the section |

**Demonstrated in the page:**

```javascript
// 1. Read the tree
const all = document.getElementsByTagName('*');   // every element node

// 2. Select a single node
const skill = document.getElementById('skill');

// 3. Respond to an event, then write back to the tree
skill.addEventListener('input', () => {
  skillOut.textContent = skill.value;
});

// 4. Create new nodes from an inert <template>
const node = tpl.content.cloneNode(true);
list.appendChild(node);
```

The `<template>` demonstration makes the disk-versus-DOM distinction concrete: the list items
generated by **Stamp rows** appear in DevTools' Elements panel but **not** in *View Source*, because
View Source shows the original file while DevTools shows the live DOM.

---

## 9. Objective 6 — Accessibility and SEO

### 9.1 Accessibility measures applied

| Measure | Implementation |
|---|---|
| Language declared | `<html lang="en">` — tells screen readers which voice to use |
| Landmark regions | `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>` |
| Logical heading order | One `<h1>`, then `h2 → h6` with no skipped levels |
| Labelled controls | Every input has a `<label for="…">` matching its `id` |
| Grouped controls | Radio and checkbox groups wrapped in `<fieldset>` + `<legend>` |
| Alternative text | Every `<img>` has a meaningful `alt`; `<svg>` uses `role="img"` + `aria-label` |
| Captions | `<track kind="captions">` on the video |
| Frame title | `title` attribute on the `<iframe>` |
| Live region | `aria-live="polite"` on the DOM output panel |
| Visible focus | A `:focus-visible` outline is never removed |
| Reduced motion | `@media (prefers-reduced-motion: reduce)` disables smooth scrolling |
| Responsive | `<meta name="viewport">` plus fluid layout down to 320 px |

### 9.2 SEO measures applied

- A descriptive, keyword-bearing `<title>`.
- `<meta name="description">` — the snippet a search engine shows under the result.
- `<meta name="keywords">`, `<meta name="author">`, `<meta name="robots">`.
- `<link rel="canonical">` to prevent duplicate-content penalties.
- Open Graph tags (`og:title`, `og:description`, `og:type`) for social previews.
- Semantic sectioning, which lets crawlers identify the primary content region and often produces
  sitelinks in results.
- `<time datetime="2026-08-22">` for machine-readable dates.
- Native lazy loading (`loading="lazy"`) and explicit `width`/`height` on images to prevent layout
  shift — both are ranking signals under Google's Core Web Vitals.

---

## 10. Procedure

1. Created the folder `LAB/EXP-1/` inside the course repository.
2. Wrote the HTML5 skeleton: doctype, `<html lang>`, `<head>` with metadata, `<body>`.
3. Laid out the semantic frame — header, nav, main, nine sections, footer.
4. Populated each section with the elements belonging to its family (Section 4.2 above).
5. Built the form with all 19 input types plus `<datalist>`, `<output>`, `<progress>` and `<meter>`.
6. Embedded audio, video with captions, a `<picture>` element, an image map and an `<iframe>`.
7. Added a `<canvas>` bar chart and an inline `<svg>` diagram.
8. Wrote the JavaScript for the DOM counter, the `<template>` cloning and the canvas rendering.
9. Styled the page with an internal stylesheet, keeping every colour and size in CSS custom
   properties.
10. Previewed with **Go Live**, then validated the markup at `validator.w3.org` and fixed all errors.
11. Committed and pushed to GitHub; enabled GitHub Pages for the live deployment.

---

## 11. Output

Opening `index.html` renders a nine-section reference sheet. Observable behaviour:

- The nav links jump smoothly to each section.
- Submitting the form with an empty **Full name** produces the browser's own error bubble; entering
  `abc` in the email field produces a format error — no JavaScript is involved in either.
- Dragging the confidence slider updates the `<output>` value live.
- The audio and video players expose native controls; the video's caption track is listed in the
  player menu.
- Resizing the window past 720 px and 420 px swaps the `<picture>` source.
- The canvas chart paints on load; the SVG diagram stays sharp at any zoom level.
- **Open dialog** shows a native modal that closes on <kbd>Esc</kbd>.
- **Count elements** reports the live totals; **Stamp rows** injects four list items that exist only
  in the DOM.

**Validation result:** *Document checking completed. No errors or warnings to show.*

---

## 12. Observations

1. Choosing the right element is a *content* decision, not a styling one. `<section>` and `<div>`
   look identical on screen and are completely different to a screen reader.
2. HTML5 replaces a surprising amount of JavaScript. Validation, accordions, modals, sliders and
   media playback are all native now.
3. `<article>` vs `<section>` is settled by one test: would the content still make sense if you
   lifted it out of the page? If yes, it is an article.
4. `<b>`/`<i>` are not deprecated — they were *redefined*. `<b>` is stylistic bold with no added
   importance, `<strong>` is importance; `<i>` is an alternate voice, `<em>` is stress emphasis.
5. Native form validation is a convenience, not a security control. It runs on the client and can be
   bypassed, so server-side validation is still mandatory.
6. `<canvas>` produces pixels with no internal DOM, so its accessible name has to come from fallback
   content. Inline `<svg>` keeps every shape in the DOM, so it is the better choice whenever the
   graphic carries meaning.

---

## 13. Viva questions

**Q1. Why is `<!DOCTYPE html>` required?**
It switches the browser into standards mode. Omit it and the browser falls back to quirks mode,
where box-model and layout behaviour follow legacy IE rules.

**Q2. Difference between `<section>` and `<div>`?**
`<section>` is a semantic thematic grouping that contributes to the document outline; `<div>` carries
no meaning and exists purely as a styling or scripting hook.

**Q3. Can a page have more than one `<h1>`?**
It is technically valid but discouraged. One `<h1>` per page keeps the outline unambiguous for
screen readers and crawlers.

**Q4. Difference between `<progress>` and `<meter>`?**
`<progress>` shows completion of a task over time. `<meter>` shows a static scalar measurement
within a known range — disk usage, a score, a temperature.

**Q5. Why does `<video>` need multiple `<source>` elements?**
Codec support differs across browsers. The browser plays the first source it can decode, so shipping
MP4 alongside WebM or Ogg maximises coverage.

**Q6. What is the DOM?**
The tree-structured, in-memory representation of a parsed HTML document, exposed to JavaScript as an
API for reading and modifying the page.

**Q7. `<datalist>` vs `<select>`?**
`<select>` restricts the user to the listed options. `<datalist>` merely suggests them; the user can
still type a value that is not on the list.

**Q8. What does `<template>` do?**
It holds markup that is parsed but not rendered. Scripts clone its contents to generate repeated UI
at runtime.

**Q9. Which HTML5 features improve SEO?**
Semantic sectioning, a descriptive title and meta description, `<time datetime>`, `alt` text, a
canonical link, Open Graph tags, and performance attributes such as `loading="lazy"`.

**Q10. Difference between `id` and `class`?**
`id` is unique within a document and is the target of fragment links and `getElementById()`;
`class` is reusable across many elements.

---

## 14. Conclusion

A single HTML5 document was designed, built, validated and deployed that exercises all seven element
families of the specification. The experiment demonstrated that HTML5's semantic elements replace
HTML4's generic `<div>` scaffolding with markup that is meaningful to browsers, crawlers and
assistive technology alike; that native form validation and multimedia elements remove entire
categories of JavaScript that HTML4 required; and that the DOM is a live tree distinct from the
source file. All six stated objectives were met, and the page passes W3C validation with zero errors
or warnings.

---

## 15. References

1. WHATWG — *HTML Living Standard*. <https://html.spec.whatwg.org/>
2. MDN Web Docs — *HTML elements reference*. <https://developer.mozilla.org/en-US/docs/Web/HTML/Element>
3. W3C — *HTML5 Recommendation*, 28 October 2014. <https://www.w3.org/TR/html5/>
4. W3C — *Web Content Accessibility Guidelines (WCAG) 2.2*. <https://www.w3.org/TR/WCAG22/>
5. W3C Markup Validation Service. <https://validator.w3.org/>

---

[← Back to repository index](../../readme.md)