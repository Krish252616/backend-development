---
title: "Experiment 2: Create a web page with all types of Cascading Style Sheets"
layout: default
---

# Experiment 2: Create a web page with all types of Cascading Style Sheets

**Course:** Backend Development Lab  
**Course Outcome Mapped:** CO2 (Create and build web pages and applications)  
**Student:** Krish Pawar · B.Tech CSE · SAP ID 590017543 · UPES Dehradun  
**Date:** 14 October 2026

**Live pages:** [All Experiment 2 pages](./index.html)  
**Source:** [`LAB/EXP-2` on GitHub](https://github.com/Krish252616/backend-development/tree/main/LAB/EXP-2)

---

## 1. Aim

To style web pages with all three types of CSS (inline, internal and external), and to use selectors, the box model, Flexbox, Grid, media queries, transitions and animations.

## 2. Objectives and where each one is met

| # | Objective | Where it is done |
|---|---|---|
| 1 | Understand inline, internal and external CSS | Parts A, B, C and Practice Task 1 |
| 2 | Apply CSS with different selector types | Part D and Practice Task 2 |
| 3 | Responsive design | Media queries in every page, Practice Task 3 |
| 4 | Class vs ID vs element selectors | Part D sections 1 to 3, Task 2 specificity contest |
| 5 | Box model | `box-sizing: border-box`, padding, border and margin in every page |
| 6 | Flexbox and Grid | Part E and Practice Task 3 |
| 7 | Specificity and inheritance | Practice Tasks 1 and 2, checked in Chrome DevTools |
| 8 | Animations and transitions | Part F and Practice Task 4 |

## 3. Tools and environment

| Item | Detail |
|---|---|
| Editor | Visual Studio Code with the Live Server extension |
| Browser | Google Chrome (DevTools Elements, Styles and Console panels) |
| Language | HTML5 and CSS3, no framework. A few lines of JavaScript only to print test results and to switch the theme |
| Hosting | GitHub Pages |

## 4. Theory

### 4.1 Three types of CSS

| Type | Where the rules are | Applies to | Example |
|---|---|---|---|
| Inline | `style="..."` attribute of one element | That element only | `<h1 style="color: red;">` |
| Internal | `<style>` block in the `<head>` | That page only | `<style> h1 { color: green; } </style>` |
| External | A separate `.css` file, linked with `<link>` | Every page that links it | `<link rel="stylesheet" href="styles.css">` |

### 4.2 How the browser picks the winning rule (the cascade)

When two rules set the same property on the same element, the browser checks, in this order:

1. **Importance:** a declaration with `!important` beats normal declarations, even an inline style.
2. **Inline style:** a `style="..."` attribute beats any normal rule from a stylesheet.
3. **Specificity** of the selector, counted as (IDs, classes/attributes/pseudo-classes, elements/pseudo-elements). For example `#header .nav a:hover` = (1, 2, 1).
4. **Order:** if everything above is equal, the rule that comes **later** in the page wins.

Internal and external CSS are both just stylesheets. Neither one has a built-in priority over the other. What decides between them is specificity, and then which one the browser reads last. Practice Task 1 tests this (section 7.1).

> **Note on the lab sheet.** The sheet lists the cascade as "External < Internal < Inline" and calls external CSS "lowest specificity". Testing showed that an external rule wins over an internal one when it is linked after the `<style>` block, and an `!important` rule wins over an inline style. "Specificity" belongs to selectors, not to where the CSS is written.

### 4.3 Box model

Every element is a box: **content**, then **padding** (inside the border), then **border**, then **margin** (outside the border). With the default `box-sizing: content-box`, `width` is only the content, so padding and border are added on top. With `box-sizing: border-box` (used in every page here), `width` already includes padding and border, which makes layouts much easier to size.

### 4.4 Flexbox and Grid

| | Flexbox | Grid |
|---|---|---|
| Dimensions | One (a row or a column) | Two (rows and columns together) |
| Main properties | `display: flex`, `flex-direction`, `justify-content`, `align-items`, `flex-wrap`, `flex` | `display: grid`, `grid-template-columns`, `grid-template-areas`, `gap`, `grid-column`, `grid-row` |
| Good for | Navigation bars, buttons in a row, centering | Page layouts, card grids |

### 4.5 Transitions and animations

A **transition** animates a property when its value changes (for example on `:hover`). An **animation** runs by itself through the steps written in `@keyframes`, can repeat (`infinite`) and can alternate direction.

## 5. Files

| File | What it is |
|---|---|
| `index.html` | Hub page linking every page of the experiment |
| `index-external.html` + `styles.css` | Part A: external CSS |
| `index-internal.html` | Part B: internal CSS |
| `index-inline.html` | Part C: inline CSS |
| `index-selectors.html` | Part D: all selector types |
| `index-layout.html` | Part E: Flexbox and Grid |
| `index-animations.html` | Part F: transitions and animations |
| `practice/task1-css-types.html` + `practice/task1-external.css` | Task 1: all three CSS types on one page, and four "which one wins" tests |
| `practice/task2-selectors.html` | Task 2: twelve selectors and a specificity contest |
| `practice/task3-layout.html` | Task 3: Flexbox navigation bar, Grid page, responsive |
| `practice/task4-gallery.html` | Task 4: hover transitions, loading spinner, background animation |
| `practice/task5-theme.html` | Task 5: dark mode toggle with CSS custom properties |
| `practice/base.css` | Shared base styles for the hub and Tasks 2, 4 and 5 |

Parts A to F use the code from the lab sheet. Four changes were made to it after testing, listed in section 8.

## 6. Procedure

1. Created `LAB/EXP-2/` and wrote the six lab pages and `styles.css` from the sheet.
2. Opened each page with Live Server, checked it at desktop width and at phone width (375 px) in Chrome DevTools device mode, and checked the Console for errors.
3. Found and fixed four problems in the sheet's code (section 8).
4. Built the five practice tasks.
5. Used Chrome DevTools (Elements, Styles) to see which rule won and which rules were crossed out.
6. Pushed to GitHub. All pages run on GitHub Pages.

**How to run**

| Step | macOS | Windows |
|---|---|---|
| Open a page | Double-click it, or `open index.html` in Terminal | Double-click it, or `start index.html` in Command Prompt |
| With Live Server | Right-click, **Open with Live Server** | Same |
| DevTools | `Cmd + Option + I` | `F12` or `Ctrl + Shift + I` |
| Inspect one element | `Cmd + Shift + C`, then click the element | `Ctrl + Shift + C`, then click the element |
| Phone view | DevTools, `Cmd + Shift + M` | DevTools, `Ctrl + Shift + M` |
| Hard reload after changing CSS | `Cmd + Shift + R` | `Ctrl + Shift + R` or `Ctrl + F5` |

These pages have no modules and no server code, so double-clicking works. Live Server is still useful because it reloads the page on every save.

## 7. Output

### 7.1 Lab pages

**Hub page**

![Hub page](screenshots/index.png)

The hub page on a phone (375 px). The list of links becomes one column:

![Hub page on a phone](screenshots/phone-hub.png)

**Part A: external CSS** (`styles.css` linked with `<link>`)

![External CSS](screenshots/index-external.png)

**Part B: internal CSS**

![Internal CSS](screenshots/index-internal.png)

**Part C: inline CSS**

![Inline CSS](screenshots/index-inline.png)

**Part D: selectors**

![Selectors](screenshots/index-selectors.png)

**Part E: Flexbox and Grid**

![Flexbox and Grid](screenshots/index-layout.png)

**Part F: animations and transitions** (captured after the typewriter finished)

![Animations](screenshots/index-animations.png)

Hovering the "Multi Transition" box (transform, background, border radius and shadow, each with its own duration):

![Multi transition on hover](screenshots/animations-hover-multi.png)

**Phone width (375 px).** The media queries change the layouts to one column:

![External CSS on a phone](screenshots/phone-external.png)

![Layout page on a phone](screenshots/phone-layout.png)

### 7.2 Practice Task 1: all three CSS types, and which one wins

The header is styled only with inline CSS, the main content only with internal CSS, and the footer only with `task1-external.css`:

![Task 1](screenshots/task1-css-types.png)

The four tests. The page reads the color the browser really used with `getComputedStyle` and prints it:

![Which one wins](screenshots/task1-which-wins.png)

| Test | Rules that compete | Winner | Why |
|---|---|---|---|
| 1 | Internal `.order-test` green, then external `.order-test` blue | **External (blue)** | Same specificity, so the later one wins. The `<link>` comes after the `<style>` block |
| 2 | Internal `.inline-test` green, inline `style` red | **Inline (red)** | An inline style beats normal stylesheet rules |
| 3 | Inline `style` red, external `.important-test` blue `!important` | **External (blue)** | `!important` beats an inline style |
| 4 | Internal `#spec-test` green, external `.spec-test` blue (later) | **Internal (green)** | An ID (1,0,0) beats a class (0,1,0), even though the class rule comes later |

The same results in Chrome DevTools. The winning rule is shown at the top and the losing rule is crossed out:

Test 1, external wins over internal because it comes later:

![DevTools test 1](screenshots/devtools-test1-order.png)

Test 3, the inline `element.style` color is crossed out by `!important`:

![DevTools test 3](screenshots/devtools-test3-important.png)

Test 4, the ID rule wins and the later class rule is crossed out:

![DevTools test 4](screenshots/devtools-test4-specificity.png)

Console output of the test script:

![DevTools Console](screenshots/devtools-task1-console.png)

### 7.3 Practice Task 2: selector challenge

Twelve selectors, each with its own sample: universal, element, class, ID, descendant, child, adjacent sibling, general sibling, attribute (`^=` and `type`), pseudo-classes (`:nth-child`, `:hover`, `:focus`), pseudo-elements (`::first-letter`, `::before`) and `:not()` with grouping.

![Task 2](screenshots/task2-selectors.png)

`:nth-child(even)` stripes, `:hover` on the third item and `:focus` on the input:

![Pseudo-classes](screenshots/task2-pseudo-hover-focus.png)

Specificity contest: `#contest p.target` (1,1,1) wins over `.card .target` (0,2,0) and over `.target` (0,1,0), even though `.target` is written last:

![Specificity contest](screenshots/task2-specificity-contest.png)

### 7.4 Practice Task 3: website layout

Desktop: three grid columns (sidebar, content, aside), and a Flexbox navigation bar with the logo on the left and the links on the right:

![Task 3 desktop](screenshots/task3-layout.png)

Tablet (800 px): two columns, the content area takes the full first row:

![Task 3 tablet](screenshots/tablet-task3-layout.png)

Phone (375 px): one column, the navigation bar stacks:

![Task 3 phone](screenshots/phone-task3-layout.png)

### 7.5 Practice Task 4: animation gallery

![Task 4](screenshots/task4-gallery.png)

First card hovered: it moves up, gets a shadow and a blue border, and its square rotates 45 degrees:

![Task 4 hover](screenshots/task4-hover.png)

The spinner is a circle with one colored border side, rotated forever with `@keyframes spin`. The background moves slowly between two light tones (30 seconds per cycle). Both stop when the operating system's "reduce motion" setting is on.

### 7.6 Practice Task 5: theme creator

Light theme:

![Task 5 light](screenshots/task5-theme.png)

After clicking the button. Only the values of the custom properties changed, no rule was rewritten:

![Task 5 dark](screenshots/task5-dark.png)

Tested: the dark theme stayed after a reload (saved in `localStorage`), and a first visit with the system set to dark mode opened in dark.

## 8. Problems in the lab sheet's code, and the fixes

Each problem was found by running the sheet's code as it is, and checked again after the fix.

### 8.1 Part D: the adjacent sibling demo was not styled

The rule is `h2 + p`, but the demo in section 6 uses an `h3`. So "This paragraph is immediately after h3, so it gets special styling" got **no** special background (measured background: transparent). Both paragraphs only got the italic style from the `h3 ~ p` rule.

Before:

![Before: adjacent sibling](screenshots/before-adjacent-sibling.png)

Fix: added the class `adjacent-demo` to that section and the rule `.adjacent-demo h3 + p { ... }`. Now only the paragraph right after the `h3` gets the blue background:

![After: adjacent sibling](screenshots/fix-adjacent-sibling.png)

### 8.2 Part F: "Width Change" jumped instead of animating, and got smaller

`.transition-box.width:hover { width: 200px; }`. The box starts with `width: auto`, and the browser cannot animate from `auto`. Measured: 222 px before hover, already 200 px at 100 ms after hover (no animation), and 200 is smaller than 222, so the box shrank.

Before (hovered):

![Before: width](screenshots/before-width-hover.png)

Fix: the box starts at `width: 70%` and grows to `width: 100%` on hover. Both are percentages, so the browser can animate between them. Measured after the fix: 156 px, then 199 px at 150 ms, then 222 px at 750 ms.

![After: width](screenshots/fix-width-hover.png)

### 8.3 Part F: the typewriter cursor stopped far from the text

The animation went to `width: 100%`, which is the whole box (910 px), while the text is only 280 px wide. So the blinking cursor ended up at the far right.

Before:

![Before: typewriter](screenshots/before-typewriter.png)

Fix: animate to `width: 28ch` with `steps(28)`, one step per character of "CSS Animations are powerful!", in a monospace font (`ch` is the width of one character, which is exact only when every character has the same width):

![After: typewriter](screenshots/fix-typewriter.png)

### 8.4 Part E: the comparison table did not fit on a phone

At 375 px the page became 444 px wide, so the whole page scrolled sideways. The Flexbox vs Grid table has no wrapper (Part C's table has one).

Before (the right side is cut off):

![Before: table on phone](screenshots/before-phone-layout-table.png)

Fix: wrapped the table in `<div style="overflow-x: auto;">`, as in Part C. Now only the table scrolls and the page is 375 px:

![After: table on phone](screenshots/fix-phone-layout-table.png)

### 8.5 Other changes

| Change | Reason |
|---|---|
| In Part D, `a:visited` moved before `a:hover` and `a:active` | Link states should be written in the order link, visited, hover, active ("LoVe HAte"). All four rules have the same specificity, so a later `:visited` rule would override the hover color on visited links |
| Added a small `document.pdf` | Part D links to `document.pdf` to show the `[href$=".pdf"]` selector, but the file did not exist, so the link gave a 404 |
| A small SVG favicon added to every page | Without it Chrome requests `/favicon.ico`, gets a 404 and shows a red error count in DevTools |

## 9. Observations (what I learned)

1. External CSS is the best choice for a real site: one file, cached by the browser, shared by every page. Inline CSS is the hardest to maintain. Part C needed the same `padding: 10px 15px` typed into every single table cell.
2. The cascade is decided by importance, then inline vs stylesheet, then specificity, then order. "Internal beats external" is only true when the `<style>` block comes after the `<link>`.
3. Chrome DevTools' Styles panel shows the whole cascade: winning rules at the top, losing declarations crossed out, and the file and line of each rule.
4. Specificity can be counted by hand: IDs, then classes/attributes/pseudo-classes, then elements. One ID beats any number of classes.
5. `box-sizing: border-box` makes `width` mean the full visible width, so a `width: 100%` box with padding does not overflow.
6. Flexbox is for one direction (the navigation bar). Grid is for rows and columns together (the page). `grid-template-areas` with named areas made the responsive version a matter of rewriting three lines.
7. `repeat(auto-fit, minmax(200px, 1fr))` makes a card grid responsive without any media query.
8. Not every property can be animated from every value. `width: auto` and `display` cannot. `transform` and `opacity` animate most smoothly.
9. Wide tables need their own `overflow-x: auto` wrapper on phones, otherwise the whole page scrolls sideways.
10. CSS custom properties make theming simple: the dark theme only changes the values, not the rules.
11. Animations should respect `prefers-reduced-motion`, because some users get dizzy from moving content.

## 10. Problems and Windows vs macOS differences

| # | Problem | Cause | Fix |
|---|---|---|---|
| 1 | Adjacent sibling demo showed no special styling | Rule written for `h2 + p`, demo uses `h3` | Section 8.1 |
| 2 | "Width Change" box jumped and shrank | `width: auto` cannot be animated, and 200 px was smaller than the box | Section 8.2 |
| 3 | Typewriter cursor stopped at the far right | Animated to 100% of the box instead of the text width | Section 8.3 |
| 4 | Layout page scrolled sideways on a phone | Table wider than the screen, no wrapper | Section 8.4 |
| 5 | Red error count in DevTools on every page | No favicon, so Chrome's request for `/favicon.ico` got a 404 | Added an inline SVG favicon |
| 6 | Clicking a two-line inline element in DevTools' element picker selected its table cell instead | The center of a two-line `<span>` falls in the gap between the lines | Clicked on the first line of the text |
| 7 | Emoji icons in the sheet's pages (for example in Part A's benefit cards) look different on macOS, Windows and Android | Each system draws emoji with its own font | Kept them in Parts A to F as in the sheet. The practice pages use CSS shapes and text instead |
| 8 | Font in the sheet (`'Segoe UI'`) is not on a Mac | Segoe UI ships only with Windows | The font list falls back to Tahoma, Geneva, Verdana or `sans-serif`. The practice pages use `system-ui`, which picks San Francisco on macOS and Segoe UI on Windows |

## 11. Viva questions

**Basic**

1. **What are the three types of CSS?** Inline (`style` attribute), internal (`<style>` in the head) and external (a `.css` file linked with `<link>`).
2. **Difference between `class` and `id`?** A class can be used on many elements. An ID must be unique in the page. An ID selector has higher specificity (1,0,0) than a class (0,1,0).
3. **What is the box model?** Content, then padding, then border, then margin, from inside to outside.
4. **Margin vs padding?** Padding is the space inside the border and takes the element's background. Margin is the space outside the border and is always transparent.
5. **What are pseudo-classes?** Selectors for a state or position: `:hover`, `:focus`, `:first-child`, `:nth-child(odd)`.
6. **Flex vs Grid?** Flexbox lays out in one direction. Grid lays out rows and columns together.
7. **What does `!important` do?** It puts the declaration above normal declarations, even inline styles. It makes CSS hard to override later, so it should be rare.
8. **What is specificity?** A score for a selector, (IDs, classes, elements), used when two rules set the same property.
9. **`display: inline` vs `display: block`?** Inline elements sit in a line and ignore width and height. Block elements start on a new line and take the full width.
10. **What is `display: flex` used for?** It makes the element a flex container, so its children can be aligned and spaced in a row or column.

**Intermediate**

11. **What is the cascade?** The process that picks one value when several rules apply: importance, then inline, then specificity, then order.
12. **What are pseudo-elements?** They style part of an element or add content: `::first-line`, `::first-letter`, `::before`, `::after`.
13. **`flex-direction: row` vs `column`?** Row places items left to right, column places them top to bottom. It also swaps what `justify-content` and `align-items` control.
14. **What is `flex-wrap`?** It lets items move to a new line instead of shrinking when there is not enough room.
15. **`grid-template-columns` and `grid-template-rows`?** They define the number and size of columns and rows, for example `repeat(3, 1fr)`.
16. **`justify-content` vs `align-items`?** `justify-content` aligns along the main axis, `align-items` along the cross axis.
17. **How do you make a layout responsive?** Media queries, relative units (`%`, `rem`, `fr`, `vw`), `auto-fit`/`minmax`, and Flexbox wrapping.
18. **What does `box-sizing: border-box` do?** Width and height include padding and border.
19. **What are CSS custom properties?** Variables like `--bg: #fff`, used with `var(--bg)`. They can be changed per element or per theme, and the change applies everywhere they are used.
20. **Values of `position`?** `static` (default), `relative` (moved from its normal place), `absolute` (placed relative to the nearest positioned parent), `fixed` (relative to the window), `sticky` (normal until it reaches a scroll position, then fixed).

**Advanced**

21. **How is specificity calculated?** Count IDs, then classes/attributes/pseudo-classes, then elements/pseudo-elements, and compare from left to right. Inline styles beat all selectors, and `!important` beats inline styles.
22. **`display: none` vs `visibility: hidden`?** `none` removes the element from the layout. `hidden` hides it but keeps its space.
23. **`z-index` and stacking context?** `z-index` orders positioned elements front to back, but only inside the same stacking context. Properties such as `opacity` below 1 or a `transform` create a new context.
24. **What is `flex: 1`?** Short for `flex-grow: 1; flex-shrink: 1; flex-basis: 0%`, so items share the free space equally.
25. **What is `@keyframes`?** It names an animation and lists the property values at points in time (`0%`, `50%`, `100%`).
26. **`rem` vs `em`?** `rem` is relative to the root (`html`) font size. `em` is relative to the element's own font size (or the parent's, when used for `font-size`).
27. **How do you build dark mode?** Put colors in custom properties, change their values for a `[data-theme="dark"]` selector or inside `@media (prefers-color-scheme: dark)`. Task 5 does both.
28. **What is `object-fit`?** It sets how an image or video fills its box: `cover` crops to fill, `contain` fits the whole image.
29. **What is grid auto-placement?** Items without a set position are placed in the next free cell, row by row (or column by column with `grid-auto-flow: column`).
30. **What is `will-change`?** A hint that a property will change soon, so the browser can prepare (for example a separate layer for `transform`). It should be used only where needed.

## 12. Result

All three types of CSS, eleven kinds of selectors, the box model, Flexbox, Grid, media queries, transitions and animations were implemented in six lab pages and five practice tasks, all live on GitHub Pages. Testing found four problems in the sheet's code (a selector that never matched, an un-animatable width transition, a misplaced typewriter cursor and a page that overflowed on phones), and all four were fixed and checked again. The cascade tests showed with real computed values and DevTools that order, specificity, inline styles and `!important` decide the winning rule.

## 13. Conclusion

CSS controls how every page looks, and knowing the cascade is what makes it predictable. External stylesheets are the right default, internal CSS suits one-off pages, and inline CSS should be rare. Flexbox and Grid handle almost any layout, and media queries adapt it to phones. The most useful habit from this experiment was checking the browser's real result (DevTools, `getComputedStyle`, a phone-width view) instead of trusting the code, because that is how all four problems in the sheet were found.

## 14. References

1. MDN Web Docs: *Introduction to the CSS cascade*. <https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade>
2. MDN Web Docs: *Specificity*. <https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity>
3. MDN Web Docs: *CSS flexible box layout*. <https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout>
4. MDN Web Docs: *CSS grid layout*. <https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout>
5. MDN Web Docs: *Using CSS transitions*. <https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions/Using_CSS_transitions>
