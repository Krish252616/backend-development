// Lecture 3, Lab Exercise 3
// Task 3 (students JSON API) plus GET /students/branch/:branch,
// which returns every student of one branch.

const express = require("express");
const app = express();

const students = [
    { id: 1, name: "Aarav", branch: "CSE" },
    { id: 2, name: "Diya", branch: "ECE" },
    { id: 3, name: "Rohan", branch: "IT" }
];

app.get("/", (req, res) => {
    res.send("Student Management API");
});

app.get("/students", (req, res) => {
    res.json(students);
});

// filter() is used instead of find(), because one branch can have
// many students. toUpperCase() makes /branch/cse and /branch/CSE the same.
app.get("/students/branch/:branch", (req, res) => {
    const branch = req.params.branch.toUpperCase();
    const result = students.filter(s => s.branch.toUpperCase() === branch);
    if (result.length > 0) {
        res.json(result);
    } else {
        res.status(404).json({ error: "No students found in this branch" });
    }
});

app.get("/students/:id", (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (student) {
        res.json(student);
    } else {
        res.status(404).json({ error: "Student not found" });
    }
});

app.listen(3000, (error) => {
    // Express 5 passes "port already in use" errors here, so show them
    // instead of printing a success message for a server that never started.
    if (error) throw error;
    console.log("Server started at http://localhost:3000");
});
