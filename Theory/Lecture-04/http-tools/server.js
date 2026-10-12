// Lecture 4: HTTP Requests, DevTools, curl, Postman and fetch
//
// The students API from Lecture 3 (Task 3), plus:
//   - POST /students, so fetch(), curl and Postman can send a body
//   - the public/ folder, so the fetch() page is served by this same server
//     (same origin, so the browser does not block the requests with CORS)

const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());                                   // read JSON request bodies
app.use(express.static(path.join(__dirname, "public")));  // serves public/index.html at /

const students = [
    { id: 1, name: "Aarav", branch: "CSE" },
    { id: 2, name: "Diya", branch: "ECE" },
    { id: 3, name: "Rohan", branch: "IT" }
];

app.get("/students", (req, res) => {
    res.json(students);
});

app.get("/students/:id", (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (student) {
        res.json(student);
    } else {
        res.status(404).json({ error: "Student not found" });
    }
});

app.post("/students", (req, res) => {
    const name = String((req.body && req.body.name) || "").trim();
    const branch = String((req.body && req.body.branch) || "").trim();

    if (!name || !branch) {
        return res.status(400).json({ error: "name and branch are required" });
    }

    // The server picks the id: one more than the largest id so far.
    const id = students.reduce((max, s) => Math.max(max, s.id), 0) + 1;
    const student = { id, name, branch };
    students.push(student);
    res.status(201).json(student);
});

app.listen(3000, (error) => {
    if (error) throw error;   // Express 5 reports "port already in use" here
    console.log("Server started at http://localhost:3000");
});
