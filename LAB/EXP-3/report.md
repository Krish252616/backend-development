---
title: "Experiment 3: Create a Responsive Web Page with HTML and CSS"
layout: default
---

# Experiment 3: Create a Responsive Web Page with HTML and CSS

**Course:** Backend Development Lab  
**Student:** Krish Pawar · B.Tech CSE · SAP ID 590017543 · UPES Dehradun  
**Date:** 21 November 2026

**Live page:** [Final responsive page](./index.html) · Step by step: [Task 1](./tasks/task1.html) · [Task 2](./tasks/task2.html) · [Task 3](./tasks/task3.html) · [Task 4](./tasks/task4.html) · [Task 5](./tasks/task5.html)  
**Source:** [`LAB/EXP-3` on GitHub](https://github.com/Krish252616/backend-development/tree/main/LAB/EXP-3)

---

## 1. Aim

To build a responsive web page from scratch with HTML5, CSS3, Flexbox, CSS Grid and media queries, without any framework, so that the same page works on a 1440px desktop and a 320px phone.

## 2. Objectives

1. Use the viewport meta tag and see what happens without it.
2. Lay out cards in a row with Flexbox, then with CSS Grid.
3. Change the layout at breakpoints with `max-width` and `min-width` media queries.
4. Make a navigation bar that adapts to small screens.
5. Keep the footer at the bottom of the window on short pages.
6. Complete the three exercises: a 4-column desktop layout, a responsive image and dark mode.

## 3. Tools and environment

| Item | Detail |
|---|---|
| Editor | Visual Studio Code with Live Server |
| Browser | Google Chrome, DevTools device toolbar for phone and tablet sizes |
| Language | HTML5 and CSS3 only. No JavaScript, no framework |
| Hosting | GitHub Pages |

## 4. Theory

### 4.1 Responsive design

A responsive page changes its layout to fit the screen, instead of shipping a separate mobile site. Three tools make it work: a flexible layout (Flexbox or Grid), relative sizes (`fr`, `%`, `rem`), and media queries that change the layout at chosen widths (breakpoints).

### 4.2 The viewport meta tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Without it, a phone browser pretends the screen is about 980px wide (to show old desktop sites), draws the page at that width and shrinks it. Media queries then see 980px, so a `max-width: 768px` rule never runs. Section 7.1 shows this on an emulated phone.

### 4.3 Flexbox vs Grid

| | Flexbox | Grid |
|---|---|---|
| Direction | One: a row or a column | Two: rows and columns together |
| Used here for | The navigation bar (logo left, links right), the page column (nav, header, content, footer) | The card area |
| Key properties | `display: flex`, `flex-direction`, `justify-content`, `align-items`, `gap`, `flex: 1` | `display: grid`, `grid-template-columns`, `gap`, `align-content` |

### 4.4 Media queries

```css
@media (max-width: 768px) { /* runs when the viewport is 768px or narrower */ }
@media (min-width: 1025px) { /* runs when the viewport is 1025px or wider */ }
```

| Approach | Base CSS is written for | Media queries use | Example |
|---|---|---|---|
| Desktop-first | Large screens | `max-width`, to simplify for smaller screens | This experiment (768px and 480px) |
| Mobile-first | Small screens | `min-width`, to add columns for larger screens | Exercise 1 (1025px), Bootstrap and Tailwind |

> **Note on the lab sheet.** The "Common Media Query Patterns" list calls `max-width` "mobile-first" and `min-width` "desktop-first". It is the other way round, as the sheet's own Viva answer 3 says: mobile-first means base styles for phones plus `min-width` queries.

Breakpoints used in the final page:

| Viewport width | Columns | Rule |
|---|---|---|
| 1025px and wider | 4 | `@media (min-width: 1025px)` (Exercise 1) |
| 769px to 1024px | 3 | base rule `repeat(3, 1fr)` |
| 481px to 768px | 2 | `@media (max-width: 768px)` |
| 480px or less | 1 | `@media (max-width: 480px)` |

### 4.5 Footer at the bottom

```css
body { min-height: 100vh; display: flex; flex-direction: column; }
.container { flex: 1; }
```

The body is at least as tall as the window, and the content area takes all the space that is left, so the footer sits at the bottom even when there is little content. The sheet calls this a "sticky footer". It is not `position: sticky`: the footer does not follow the scroll, it is only pushed to the bottom.

## 5. Files

| File | What it is |
|---|---|
| `tasks/task1.html` to `tasks/task5.html` | The five steps from the lab sheet, each saved as its own page so every stage can be opened |
| `index.html` | The final page: Task 5 with the grid fix (section 8.1) and Exercises 1, 2 and 3 |
| `images/breakpoints.svg` | The image for Exercise 2, drawn by me as an SVG (1200 x 600): the layout at each breakpoint |

## 6. Procedure

1. Wrote Task 1 to Task 5 as separate files, each one building on the last, exactly as the sheet gives them.
2. Opened each one in Chrome and checked it at 1440, 1280, 1024, 900, 800, 768, 700, 600, 480, 375 and 320px wide (DevTools device toolbar), measuring the number of card columns, the card heights and whether the page scrolled sideways.
3. Found that Task 5's cards were far too tall on desktop and fixed it (section 8.1).
4. Built the final `index.html` with the three exercises.
5. Tested dark mode by switching the system theme, and tested the page with and without the viewport tag on an emulated phone.

**How to run**

| Step | macOS | Windows |
|---|---|---|
| Open the page | Double-click `index.html`, or `open index.html` | Double-click `index.html`, or `start index.html` |
| Phone and tablet sizes | Chrome DevTools (`Cmd + Option + I`), then `Cmd + Shift + M` | Chrome DevTools (`F12`), then `Ctrl + Shift + M` |
| Test dark mode (Exercise 3) | System Settings, Appearance, Dark | Settings, Personalization, Colors, Choose your mode: Dark |
| Test dark mode without changing the system | DevTools, `Cmd + Shift + P`, type "dark", choose **Emulate CSS prefers-color-scheme: dark** | Same with `Ctrl + Shift + P` |

No server is needed: the page is plain HTML and CSS.

## 7. Output

### 7.1 Task 1: skeleton with the viewport tag

![Task 1](screenshots/task1-desktop.png)

The same page from Task 3 on an emulated 375px phone. With the viewport tag (left) the page is 375px wide and the cards stack. Without it (right) Chrome reported `window.innerWidth` = **981px**, the `max-width: 768px` query did not run, and the three cards are squeezed into one tiny row:

| With the viewport tag | Without the viewport tag |
|---|---|
| ![With viewport](screenshots/phone-with-viewport.png) | ![Without viewport](screenshots/phone-without-viewport.png) |

### 7.2 Task 2: Flexbox row

![Task 2 desktop](screenshots/task2-desktop.png)

On a 375px phone Task 2 has no media query yet, so the three cards stay in one row and each becomes very narrow and tall (336px). At 320px the page started to scroll sideways:

![Task 2 phone](screenshots/task2-phone.png)

### 7.3 Task 3: cards stack at 768px

![Task 3 desktop](screenshots/task3-desktop.png)

![Task 3 phone](screenshots/task3-phone.png)

### 7.4 Task 4: responsive navigation bar

![Task 4 desktop](screenshots/task4-desktop.png)

At 480px or less the navigation bar stacks (logo above links) and the links wrap and center:

![Task 4 phone](screenshots/task4-phone.png)

### 7.5 Task 5: Grid, footer, two breakpoints

![Task 5 desktop](screenshots/task5-desktop.png)

The cards above are 455px tall although their text needs about 130px. This is the problem fixed in section 8.1.

Tablet (700px), 2 columns:

![Task 5 tablet](screenshots/task5-tablet.png)

Phone (375px), 1 column:

![Task 5 phone](screenshots/task5-phone.png)

### 7.6 Final page (Task 5 + fix + exercises)

1440px, **4 columns** (Exercise 1). The image in Card 1 scales to its card (Exercise 2):

![Final 1440](screenshots/final-1440.png)

900px, 3 columns (the fourth card goes to a new row):

![Final 900](screenshots/final-900.png)

700px, 2 columns:

![Final 700](screenshots/final-700.png)

375px, 1 column:

![Final 375](screenshots/final-375.png)

Measured on the final page:

| Viewport | Columns | Image width | Sideways scroll |
|---|---|---|---|
| 1440px | 4 | 295px | No |
| 1280px | 4 | 255px | No |
| 900px | 3 | 233px | No |
| 768px | 2 | 314px | No |
| 700px | 2 | 280px | No |
| 480px | 1 | 400px | No |
| 375px | 1 | 295px | No |
| 320px | 1 | 240px | No |

**Exercise 2 without `max-width`.** The same 375px page with `max-width: 100%` turned off: the image is drawn at its own width of 1200px and the page becomes 1260px wide:

![Image without max-width](screenshots/image-without-max-width.png)

**Exercise 3, dark mode** (system set to dark), desktop and phone:

![Dark desktop](screenshots/final-dark-1280.png)

![Dark phone](screenshots/final-dark-375.png)

## 8. Problems in the lab sheet, and the fixes

### 8.1 Task 5: cards stretched to fill the whole page

**Measured:** at 1280 x 720 each card was **455px** tall, and at 1440 x 900 **635px**, while their text needs about 129px.

**Cause:** for the footer, `.container` has `flex: 1`, so it grows to fill the window. A grid's default `align-content` is `normal`, which behaves like `stretch`: the single row of cards is stretched to the full height of the container.

**Fix:** one line in the final page:

```css
.container {
  ...
  flex: 1;
  align-content: start;   /* rows only as tall as their content */
}
```

The container still fills the page, so the footer stays at the bottom, but the cards are back to 129px.

| Before | After |
|---|---|
| ![Before](screenshots/task5-desktop.png) | ![After](screenshots/task5-desktop-fixed.png) |

### 8.2 Exercise 3 as written leaves white cards on a dark page

The exercise changes only `body` (`background-color: #1a1a1a; color: #e0e0e0`). The cards have their own `background-color: white` and text colors `#333` and `#666`, so they do not change:

![Dark mode on body only](screenshots/dark-body-only.png)

**Fix:** the dark mode query also sets the card background (`#262626`), the heading color (`#e0e0e0`) and the paragraph color (`#b5b5b5`), as in section 7.6.

### 8.3 Other notes

| Item | Note |
|---|---|
| Task 4 text says "hide its links on mobile" | The code does not hide the links. At 480px and below it stacks the bar and wraps the links. They stay visible, which is better for a 4-link menu |
| "Max-width (mobile-first)" in the theory | `max-width` is the desktop-first pattern. See the note in section 4.4 |
| "Sticky footer" | Done with Flexbox (`flex: 1`), not `position: sticky`. See section 4.5 |
| Favicon | Added a small inline SVG favicon to every page, so Chrome does not request `/favicon.ico` and log a 404 |
| Card 3 text in Task 5 | The long dash in "pure CSS, no framework needed" was replaced by a comma |

## 9. Observations (what I learned)

1. The viewport tag decides whether media queries work on a phone at all. Without it the phone reported 981px, so no phone rule ran.
2. `max-width: 768px` includes 768px itself. So at exactly 768px the page already shows 2 columns, and 3 columns start at 769px.
3. Breakpoints should not overlap and should not leave gaps: `max-width: 768px` and `min-width: 769px`, `max-width: 1024px` and `min-width: 1025px`.
4. Flexbox with `flex: 1` shares a row but never wraps by itself, which is why Task 2's cards became 336px tall columns on a phone. Grid with a media query changes the number of columns cleanly.
5. `flex: 1` on a container that holds a grid makes the grid taller than its content. `align-content: start` keeps the rows at their natural height.
6. `max-width: 100%; height: auto;` is enough for responsive images. Giving the `<img>` its real `width` and `height` attributes is still useful: the browser reserves the right space before the image loads.
7. Dark mode with `prefers-color-scheme` follows the operating system, but every element that sets its own colors must be changed too.
8. `box-sizing: border-box` kept every card inside its column: width includes padding, so `1fr` columns never overflowed.

## 10. Problems and Windows vs macOS differences

| # | Problem | Cause | Fix |
|---|---|---|---|
| 1 | Cards 455 to 635px tall on desktop in Task 5 | Grid rows stretched to fill a `flex: 1` container | `align-content: start` (section 8.1) |
| 2 | Dark mode left white cards | Exercise changes only `body` | Dark colors for the cards too (section 8.2) |
| 3 | Task 2 squeezed and then scrolled sideways on phones | No media query yet in Task 2 | Fixed in Task 3 by the sheet itself (`flex-direction: column` at 768px) |
| 4 | Testing dark mode | Needs the system theme, which is set in different places on macOS and Windows | Used the system setting on each, or DevTools' **Emulate CSS prefers-color-scheme** (section 6) |
| 5 | Font differs between systems | `font-family: Arial, sans-serif`. Arial is on both macOS and Windows, so the page looks the same, but on Linux or Android it falls back to another sans-serif font | No change needed. The layout does not depend on the exact font |
| 6 | The 4th card sits alone on a row between 769 and 1024px | 4 cards in 3 columns | Expected for Exercise 1. At 1025px and wider all 4 fit in one row |

## 11. Viva questions

1. **Why is the viewport meta tag necessary?** Without it a phone browser lays the page out at about 980px and shrinks it, so text is tiny and media queries for small screens never match. Measured here: 981px without the tag, 375px with it.
2. **`max-width` vs `min-width` media queries?** `max-width: 768px` applies at 768px and below. `min-width: 769px` applies at 769px and above.
3. **What is mobile-first?** Base CSS for small screens, then `min-width` queries add columns for wider screens. The base stays simple and phones download and apply less CSS.
4. **Flexbox vs Grid?** Flexbox lays out in one direction, Grid in rows and columns together. This page uses Flexbox for the navigation bar and page column, and Grid for the cards.
5. **How does `box-sizing: border-box` help?** Width includes padding and border, so a card with padding still fits exactly in its grid column.
6. **What does `fr` mean?** A fraction of the free space in a grid. `repeat(3, 1fr)` makes three equal columns.
7. **What does `flex: 1` do here?** It lets the content area grow to fill the height left between header and footer, which keeps the footer at the bottom.
8. **Why did the cards become very tall in Task 5?** The grid filled the `flex: 1` container and stretched its only row. `align-content: start` fixes it.
9. **How do you make an image responsive?** `max-width: 100%; height: auto;` so it shrinks with its container and keeps its shape.
10. **What does `prefers-color-scheme` do?** It matches the user's system theme (light or dark), so the page can switch colors without JavaScript.
11. **Why should breakpoints be based on content and not on specific phones?** Devices come in every size. A breakpoint belongs where the layout starts to look cramped, which is what the measurements in section 7.6 were used to check.
12. **What is `@media print` for?** Styles only for printing, for example hiding the navigation bar and footer and using black text on white.

## 12. Result

A responsive page was built in five steps with HTML5 and CSS3 only. The final page shows 4, 3, 2 and 1 columns at the planned breakpoints, has no sideways scroll from 1440px down to 320px, scales its image, keeps the footer at the bottom and switches to dark mode with the system. Testing found that the sheet's Task 5 stretched the cards to 455 to 635px, which was fixed with `align-content: start`, and that Exercise 3 as written left white cards, which was also fixed.

## 13. Conclusion

Responsive design comes from three pieces working together: the viewport tag so the phone reports its real width, a flexible layout (Flexbox for one direction, Grid for two), and media queries at the widths where the layout needs to change. Measuring the page at many widths, instead of only looking at a desktop and a phone, is what found the tall-card problem. The next experiment builds the same kind of page with Bootstrap and Tailwind, which provide these breakpoints and grids ready-made.

## 14. References

1. MDN Web Docs: *Responsive design*. <https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Responsive_Design>
2. MDN Web Docs: *Using media queries*. <https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries>
3. MDN Web Docs: *Viewport meta tag*. <https://developer.mozilla.org/en-US/docs/Web/HTML/Viewport_meta_tag>
4. MDN Web Docs: *align-content*. <https://developer.mozilla.org/en-US/docs/Web/CSS/align-content>
5. MDN Web Docs: *prefers-color-scheme*. <https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme>
