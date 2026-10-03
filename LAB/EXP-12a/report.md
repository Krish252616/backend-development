---
title: "Experiment 12 — Node.js, Express.js and EJS"
layout: default
---

# Experiment 12 — Node.js, Express.js and EJS

**Course:** Backend Development Lab  
**Student:** Gopal Aggarwal · B.Tech CSE · SAP ID 590018885 · UPES Dehradun  
**Date:** 1 October 2026

**Application:** [`app.js`](./app.js) · **EJS view:** [`views/index.ejs`](./views/index.ejs) · **Stylesheet:** [`public/style.css`](./public/style.css)

## Screenshots

| Page | Screenshot |
|---|---|
| Experiment 12 overview | [View screenshot](./screenshots/1.png) |
| Task directory | [View screenshot](./screenshots/2.png) |
| Task 1 — Basic Server | [View screenshot](./screenshots/3.png) |
| Task 2 — Calculator API | [View screenshot](./screenshots/4.png) |
| Task 3 — Student Management | [View screenshot](./screenshots/5.png) |
| Task 4 — EJS Timetable | [View screenshot](./screenshots/6.png) |
| Task 5 — Student Registration | [View screenshot](./screenshots/7.png) |

---

## 1. Aim

To build an Express application with routes that return student information in different formats, perform calculator operations, manage student records and render a timetable and registration form using EJS.

## 2. Objectives

After completing this experiment, I am able to:

1. Create and start a Node.js web server using Express.
2. Define GET and POST routes and return text, HTML and JSON responses.
3. Read query parameters, route parameters and submitted form data.
4. Validate inputs and return suitable HTTP status codes for invalid requests.
5. Configure EJS and pass route data into a server-rendered page.
6. Handle URL-encoded forms and JSON request bodies with Express middleware.
7. Use Nodemon to restart the server during development.

## 3. Tools and environment

| Item | Detail |
|---|---|
| Editor | Visual Studio Code |
| Runtime | Node.js |
| Package manager | npm |
| Server framework | Express.js |
| Template engine | EJS |
| Development tool | Nodemon |
| Main application | `app.js` |
| Views | `views/` |
| Stylesheet | `public/style.css` |
| Report | `README.md` |

From the `EXP-12` folder, install the project dependencies and start the application:

```bash
npm install
npm start
```

Open `http://localhost:3000` to view the task directory. Run `npm run dev` to start the server with Nodemon during development. The application uses the port in the `PORT` environment variable when it is set, and otherwise uses port `3000`.

---

## 4. Theory

### 4.1 Node.js and npm

Node.js is a JavaScript runtime used to run JavaScript outside a web browser. It provides APIs for tasks such as working with files and network connections. npm installs packages used by the application. The project's `package.json` lists Express and EJS as application dependencies and Nodemon as a development dependency; `package-lock.json` records the installed dependency versions.

### 4.2 Express routes and HTTP methods

An Express route associates an HTTP method and a path with a function that handles the request. This experiment uses `app.get()` for pages and data retrieval, and `app.post()` for form submissions. Route handlers read information from the request and send a response with methods such as `res.send()`, `res.json()` and `res.render()`.

### 4.3 Request data and middleware

Values placed in a URL query string are read with `req.query`, as in the calculator route. A value included in a path such as `/students/:id` is read from `req.params`. Form fields submitted in a POST request are available in `req.body` after body-parsing middleware has run. This application uses `express.urlencoded()` for browser forms and `express.json()` for JSON request bodies. `express.static()` serves the stylesheet from the `public` folder.

### 4.4 JSON responses and validation

The student and calculator API routes return JSON so that clients can use structured data. Before responding, the routes check required inputs and reject invalid values. A successful student creation returns status `201`; invalid input returns `400`; an unknown student returns `404`. The calculator rejects unsupported operations, non-finite values, division by zero and modulus by zero.

### 4.5 EJS templates

EJS combines HTML with template tags. `<% ... %>` runs JavaScript logic, and `<%= ... %>` inserts escaped output. Express selects EJS as its view engine and renders the shared `views/index.ejs` template with values from each task route. The timetable uses an EJS loop to display records passed from the server. The registration route renders the submitted values after validation.

### 4.6 In-memory data

The sample student list and timetable are stored in arrays in `app.js`. A new student is added to the student array while the server is running. The application does not use a database, so new records are cleared when the server restarts.

---

## 5. Implementation

### 5.1 Task directory and shared view

The `/` route displays a task directory. Each task has a separate URL from `/task/1` to `/task/5`; the route passes the relevant data to the shared EJS view. This keeps the task pages together without creating a separate template for every task. The shared page includes the site navigation and student details.

### 5.2 Basic server

The profile routes return the same name, roll number (SAP ID) and branch with three response types:

| Route | Response |
|---|---|
| `GET /api/profile/text` | Plain text |
| `GET /api/profile/html` | HTML document |
| `GET /api/profile/json` | JSON object |

The JSON response contains `name`, `rollNumber` and `branch` fields.

### 5.3 Calculator API

The calculator reads an operation and two numbers from query parameters. For example:

```text
/api/calculator?operation=add&first=12&second=4
```

The supported operations are `add`, `subtract`, `multiply`, `divide`, `modulus` and `power`. The task page also provides a form that displays the calculation result and a button that requests the JSON response.

### 5.4 Student management

`GET /students` returns the student list, and `GET /students/:id` returns one student by ID. `POST /students/add` accepts `name`, `course` and `semester` fields. Browser form submissions are redirected back to the directory after a successful addition; JSON requests receive the created record in the response.

### 5.5 Timetable and registration form

The timetable task passes rows containing day, time, subject and faculty from Express to EJS. The template iterates through the rows to create the table. The registration form sends `name`, `email`, `course` and `semester` in a POST request to `/student-registration`. The server validates these fields and renders a result containing the submitted data.

### 5.6 Main routes

| Method | Route | Purpose |
|---|---|---|
| GET | `/` | Display the task directory |
| GET | `/task/1` to `/task/5` | Display an individual task |
| GET | `/api/profile/text` | Return profile data as plain text |
| GET | `/api/profile/html` | Return profile data as HTML |
| GET | `/api/profile/json` | Return profile data as JSON |
| GET | `/api/calculator` | Calculate from query parameters and return JSON |
| GET | `/students` | Return all students as JSON |
| GET | `/students/:id` | Return one student as JSON |
| POST | `/students/add` | Add a student |
| POST | `/student-registration` | Validate and display registration data |

---

## 6. Procedure

1. Create the Node.js project and add Express, EJS and Nodemon as dependencies.
2. Configure Express to use EJS, parse form and JSON bodies, and serve static files.
3. Create the task directory route and the five task pages.
4. Add profile endpoints for text, HTML and JSON responses.
5. Implement calculator operations using query parameters and input validation.
6. Create student list, student lookup and student addition routes.
7. Pass timetable data to EJS and render the timetable with a loop.
8. Process and validate student registration data from a POST form.
9. Add a shared responsive stylesheet for the task pages.
10. Start the application with npm and open the task directory in a browser.

---

## 7. Output and observations

The completed application contains a task directory and five task pages. It returns the profile in three formats, provides a calculator API, exposes student routes, renders timetable rows with EJS and displays validated registration data. The layout adjusts to narrow screens, and the timetable can be scrolled horizontally on smaller displays.

### Observations

1. The same student information can be returned as text, HTML or JSON by using separate route handlers.
2. Query parameters are suitable for calculator inputs, while a route parameter identifies a student record.
3. POST requests carry form data in the request body, which Express middleware makes available to route handlers.
4. Validation prevents missing or invalid data from being added to the sample student list.
5. EJS can combine server-provided data with HTML to render the timetable and registration result.
6. In-memory arrays are sufficient for this demonstration, but they do not preserve new records after a server restart.

---

## 8. Viva questions with hints

### Basic concepts

**Q1. What is Node.js and why is it popular?**  
*Hint:* Event-driven, non-blocking I/O, V8 engine, JavaScript on the server.

**Q2. What is the difference between Node.js and JavaScript?**  
*Hint:* JavaScript is a language; Node.js is a runtime environment.

**Q3. What is NPM?**  
*Hint:* Node Package Manager; it manages project packages and dependencies.

**Q4. What is the difference between `npm init` and `npm init -y`?**  
*Hint:* Interactive setup compared with automatic default values.

**Q5. What is `package.json`?**  
*Hint:* Project metadata, dependencies and scripts.

**Q6. What are `dependencies` and `devDependencies`?**  
*Hint:* Packages needed by the application compared with packages used during development.

### Express.js

**Q7. What is Express.js?**  
*Hint:* A minimal web framework for Node.js.

**Q8. What is the purpose of `app.listen()`?**  
*Hint:* Starts the server on a specified port.

**Q9. What is the difference between `res.send()` and `res.json()`?**  
*Hint:* `res.send()` sends a response; `res.json()` sends JSON with the appropriate content type.

**Q10. What are route parameters and how do you access them?**  
*Hint:* A path such as `/user/:id` is read with `req.params.id`.

**Q11. What is the difference between `req.params` and `req.query`?**  
*Hint:* Values from the URL path compared with values from the query string.

**Q12. What is middleware in Express?**  
*Hint:* A function that can access the request, response and `next` function.

**Q13. What does `express.json()` do?**  
*Hint:* Parses incoming JSON request bodies.

**Q14. What does `express.urlencoded()` do?**  
*Hint:* Parses URL-encoded form data.

### HTTP methods

**Q15. What is the difference between GET and POST?**  
*Hint:* GET retrieves data; POST submits data.

**Q16. What are HTTP status codes? Give examples.**  
*Hint:* `200` OK, `201` Created, `400` Bad Request, `401` Unauthorized, `404` Not Found and `500` Server Error.

**Q17. How do you send a status code in Express?**  
*Hint:* Use a response such as `res.status(404).json({ ... })`.

### EJS templating

**Q18. What is EJS?**  
*Hint:* Embedded JavaScript templating engine.

**Q19. How do you render an EJS template?**  
*Hint:* Use `res.render('template', { data })`.

**Q20. What is the EJS syntax for embedding JavaScript?**  
*Hint:* Use `<%= %>` for escaped output and `<% %>` for logic.

**Q21. How do you loop through an array in EJS?**  
*Hint:* Use an array method such as `forEach()` inside a logic tag.

**Q22. What is the difference between `<%=` and `<%-` in EJS?**  
*Hint:* `<%=` escapes HTML; `<%-` renders unescaped HTML.

### Nodemon

**Q23. What is Nodemon?**  
*Hint:* A development tool that restarts the server when watched files change.

**Q24. What is the difference between `npm install nodemon -D` and `npm install nodemon -g`?**  
*Hint:* Local development dependency compared with a global installation.

**Q25. When should you use local versus global installation?**  
*Hint:* Local for project-specific packages; global for command-line tools.

### Advanced concepts

**Q26. What is the event loop in Node.js?**  
*Hint:* Coordinates asynchronous callbacks and operations.

**Q27. What is callback hell and how can you avoid it?**  
*Hint:* Deeply nested callbacks; use Promises or `async`/`await`.

**Q28. What are environment variables and how are they used?**  
*Hint:* Configuration values accessed through `process.env`.

**Q29. What is CORS?**  
*Hint:* Cross-Origin Resource Sharing controls which cross-origin browser requests are allowed.

**Q30. How do you handle errors in Express?**  
*Hint:* Use error-handling middleware with `err`, `req`, `res` and `next`.

---

## 9. Result

An Express application was created with profile, calculator and student routes, together with EJS pages for a timetable and student registration. The application demonstrates GET and POST requests, query and route parameters, JSON responses, form parsing and server-rendered views.

## 10. Conclusion

This experiment demonstrates how Node.js and Express can handle web requests and return different response types. Query parameters, route parameters and POST bodies each provide a way to send data to the server. EJS allows route data to be rendered into HTML pages. The task pages bring these concepts together in one small application.

## 11. References

1. Node.js — [Introduction to Node.js](https://nodejs.org/learn/getting-started/introduction-to-nodejs)
2. Express.js — [Routing](https://expressjs.com/en/guide/routing/)
3. Express.js — [Using template engines](https://expressjs.com/en/guide/using-template-engines/)
4. EJS — [Embedded JavaScript templates](https://ejs.co/)

---

[← Back to repository index](../../index.md)
