---
title: "Lecture 3: Express Demo, Tasks 1 to 5"
layout: default
---

# Lecture 3: Express Demo, Tasks 1 to 5

**Course:** Backend Development, Unit 1
**Lecture:** 3, Setting Up the Backend Environment
**Student:** Krish Pawar · B.Tech CSE · SAP ID 590017543 · UPES Dehradun

**Source:** [`task1` to `task5`](https://github.com/Krish252616/backend-development/tree/main/Theory/Lecture-03/express-demo) · **Shared views:** [`views/`](https://github.com/Krish252616/backend-development/tree/main/Theory/Lecture-03/express-demo/views)

---

## 1. Aim

To build a first backend server with Node.js and Express, and grow it step by step: from one plain-text route, to several routes, to a JSON API with route parameters, to HTML responses, and finally to pages rendered from EJS templates.

## 2. What each task does

| Task | Routes | Response |
|---|---|---|
| 1 | `GET /` | Plain text: `Backend Server Running` |
| 2 | `GET /`, `GET /students`, `GET /students/1` | Plain text from three fixed routes |
| 3 | `GET /students`, `GET /students/:id` | JSON array, one student as JSON, or `404` with an error |
| 4 | `GET /`, `GET /students`, `GET /students/:id` | HTML built inside JavaScript strings |
| 5 | `GET /`, `GET /students` | HTML rendered from `views/home.ejs` and `views/students.ejs` |

All five tasks listen on port 3000, so only one can run at a time.

## 3. How to run

```bash
cd Theory/Lecture-03/express-demo
npm install
npm run task3            # or task1, task2, task4, task5
```

Then open http://localhost:3000. Press `Ctrl + C` to stop the server before starting another task.

| Step | macOS (Terminal, zsh) | Windows |
|---|---|---|
| Check Node and npm | `node -v` and `npm -v` | Same commands in PowerShell or Command Prompt |
| Install packages | `npm install` | `npm install` |
| Run a task | `npm run task3` | `npm run task3` |
| Test with curl | `curl localhost:3000/students` | PowerShell: `curl.exe localhost:3000/students` (plain `curl` is a different PowerShell command) |
| Free a busy port 3000 | `lsof -ti :3000 \| xargs kill` | `netstat -ano \| findstr :3000`, then `taskkill /PID <number> /F` |

## 4. Code walkthrough

**Task 1: the smallest Express server**

```javascript
const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Backend Server Running");
});

app.listen(3000, () => {
    console.log("Server started at http://localhost:3000");
});
```

`app.get()` connects a URL to a function. `req` holds what the client sent, `res` is used to reply. `app.listen(3000)` keeps the program running and waiting for requests.

**Task 3: route parameters and JSON**

```javascript
app.get("/students/:id", (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (student) {
        res.json(student);
    } else {
        res.status(404).json({ error: "Student not found" });
    }
});
```

`:id` matches any value in that part of the URL, and Express puts it in `req.params.id`. `res.json()` sends JSON and sets `Content-Type: application/json`.

**Task 4: HTML in a string**

```javascript
let html = "<h2>All Students</h2><ul>";
students.forEach(s => {
    html += `<li><strong>${s.name}</strong> (${s.branch})</li>`;
});
html += "</ul>";
res.send(html);
```

`res.send()` with an HTML string makes Express send `Content-Type: text/html`. It works, but the HTML is mixed into the JavaScript and quickly becomes hard to read.

**Task 5: EJS templates**

```javascript
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "..", "views"));

app.get("/students", (req, res) => {
    res.render("students", { students: students });
});
```

```html
<% students.forEach(student => { %>
    <li><strong><%= student.name %></strong> (<%= student.branch %>)</li>
<% }); %>
```

`res.render()` takes `views/students.ejs`, fills it with the data and sends the finished HTML. `<% %>` runs JavaScript, `<%= %>` prints a value.

## 5. Output

**Task 1:** `GET /`

![Task 1 home](screenshots/task1-home.png)

**Task 2:** `GET /students/1`

![Task 2 student 1](screenshots/task2-student.png)

**Task 3:** `GET /students` returns JSON

![Task 3 JSON](screenshots/task3-json.png)

**Task 3:** `GET /students/5` returns 404

![Task 3 not found](screenshots/task3-not-found.png)

The same request with `curl -i` shows the status line and headers:

```text
$ curl -i localhost:3000/students/5
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 29

{"error":"Student not found"}
```

**Task 4:** `GET /students` as HTML

![Task 4 HTML list](screenshots/task4-html-list.png)

```text
$ curl -I localhost:3000/students
Content-Type: text/html; charset=utf-8
```

**Task 5:** home page and student list rendered with EJS

![Task 5 home](screenshots/task5-home.png)

![Task 5 EJS students](screenshots/task5-ejs-students.png)

## 6. What I learned

1. An Express server is just routes plus `app.listen()`. Each route is a URL and a method connected to one function.
2. `res.send()` and `res.json()` set different `Content-Type` headers. The browser decides how to show the response from that header, not from the content itself.
3. Route parameters (`/students/:id`) let one route handle every id instead of writing `/students/1`, `/students/2` and so on.
4. Everything in `req.params` is a string. The id from the URL is `"1"`, not `1`, so `parseInt()` is needed before comparing with `===`.
5. A missing record should return `404`, not `200` with an error message, so clients can tell success from failure by the status code.
6. Building HTML inside JavaScript strings works for a few lines but gets messy fast. A template engine like EJS keeps the HTML in its own file.
7. `npm run task3` is shorter and safer than typing `node task3/server.js`, and it documents how to run each task inside `package.json`.

## 7. Problems I faced and how I fixed them

| Problem | Cause | Fix |
|---|---|---|
| Task 5 showed `Error: Failed to lookup view "home"` when I ran `node server.js` from inside the `task5` folder | Express looks for `views/` in the folder you start Node from. The shared `views/` folder is one level up, next to the task folders | Gave Express the full path: `app.set("views", path.join(__dirname, "..", "views"))`. Now Task 5 works from any folder |
| After starting a new task, the browser still showed the old task's page | The previous server was still running on port 3000 in another terminal. With Express 5, `app.listen()` passes the "port in use" error to its callback, so the new server printed "Server started" and then exited quietly | Stopped the old server with `Ctrl + C` before starting the next one. If the terminal is already closed: macOS `lsof -ti :3000 \| xargs kill`, Windows `netstat -ano \| findstr :3000` then `taskkill /PID <number> /F` |
| `curl` gave strange output on Windows PowerShell | In PowerShell, `curl` is a shortcut for `Invoke-WebRequest`, which prints a different format | Used `curl.exe` instead, or ran the command in Command Prompt |
| The student list used an M dash between name and branch | Copied from the lecture code | Changed the output to `Aarav (CSE)` in Task 4 and in `students.ejs` |

## 8. Result

All five Express tasks run and return the expected text, JSON, HTML and EJS pages. Task 3 returns the correct `404` status for a missing student, and Task 5 renders its templates no matter which folder the server is started from.
