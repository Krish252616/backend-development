const express = require("express");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
// views/ sits one level up (shared by the tasks), so give Express its full path.
// Without this, Express looks in ./views of the folder you run node from.
app.set("views", path.join(__dirname, "..", "views"));

const students = [
    { id: 1, name: "Aarav", branch: "CSE" },
    { id: 2, name: "Diya", branch: "ECE" },
    { id: 3, name: "Rohan", branch: "IT" }
];

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/students", (req, res) => {
    res.render("students", { students: students });
});

app.listen(3000, () => {
    console.log("Server started at http://localhost:3000");
});