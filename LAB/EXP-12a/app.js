const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const profile = {
  name: "Gopal Aggarwal",
  rollNumber: "590018885",
  branch: "B.Tech Computer Science Engineering"
};

const tasks = [
  {
    id: 1,
    title: "Basic Server",
    summary: "Return student details as plain text, HTML and JSON from Express routes.",
    route: "/task/1",
    concepts: "Express routes · response formats"
  },
  {
    id: 2,
    title: "Calculator API",
    summary: "Perform six arithmetic operations with values supplied as query parameters.",
    route: "/task/2",
    concepts: "Query parameters · JSON API"
  },
  {
    id: 3,
    title: "Student Management",
    summary: "List students, retrieve a student by ID and add a new student.",
    route: "/task/3",
    concepts: "GET · route parameters · POST"
  },
  {
    id: 4,
    title: "EJS Timetable",
    summary: "Render course timetable rows by passing schedule data from Express to EJS.",
    route: "/task/4",
    concepts: "EJS · server-side data"
  },
  {
    id: 5,
    title: "Student Registration",
    summary: "Process a registration form and render the submitted values on a result page.",
    route: "/task/5",
    concepts: "POST body · form handling"
  }
];

const students = [
  { id: 101, name: "Aarav Sharma", course: "Computer Science", semester: 3 },
  { id: 102, name: "Meera Kapoor", course: "Information Technology", semester: 4 },
  { id: 103, name: "Rohan Mehta", course: "Computer Science", semester: 5 }
];

let nextStudentId = 104;

const courseOptions = [
  "Computer Science",
  "Information Technology",
  "Artificial Intelligence",
  "Computer Applications"
];

const timetable = [
  { day: "Monday", time: "09:00–10:00", subject: "Backend Development", faculty: "Dr. Ananya Rao" },
  { day: "Monday", time: "10:15–11:15", subject: "Database Systems", faculty: "Prof. Karan Malhotra" },
  { day: "Tuesday", time: "11:00–12:00", subject: "Computer Networks", faculty: "Dr. Meera Nair" },
  { day: "Wednesday", time: "13:00–14:00", subject: "Web Technologies", faculty: "Prof. Dev Shah" },
  { day: "Thursday", time: "09:00–10:00", subject: "Software Engineering", faculty: "Dr. Ananya Rao" },
  { day: "Friday", time: "10:15–11:15", subject: "Backend Development Lab", faculty: "Prof. Karan Malhotra" }
];


const taskDetails = {
  1: {
    title: "Basic Server",
    heading: "Return one profile in three formats",
    summary: "Express routes can return plain text, HTML markup or a JSON object. Open each endpoint to compare the response formats."
  },
  2: {
    title: "Calculator API",
    heading: "Calculate with query parameters",
    summary: "Choose an operation and enter two values. The page renders a readable result, while the API button returns the same calculation as JSON."
  },
  3: {
    title: "Student Management",
    heading: "Read and add student records",
    summary: "The list and detail links demonstrate GET routes. Submit the form to add a record through POST /students/add."
  },
  4: {
    title: "EJS Timetable",
    heading: "Render a course timetable from route data",
    summary: "Express passes schedule records to an EJS template, which loops through them to build the timetable."
  },
  5: {
    title: "Student Registration",
    heading: "Submit a registration form",
    summary: "Enter student details and submit the form. Express validates the POST body and renders the submitted values on a result page."
  }
};

function renderTask(res, taskId, extra = {}, status = 200) {
  res.status(status).render("index", {
    title: taskDetails[taskId].title,
    taskId,
    task: taskDetails[taskId],
    profile,
    students,
    timetable,
    courseOptions,
    tasks,
    added: false,
    formError: "",
    formValues: {},
    registration: null,
    registrationValues: {},
    calculatorResult: null,
    calculatorValues: {},
    ...extra
  });
}

function calculate(query) {
  const operation = String(query.operation || "").trim().toLowerCase();
  const firstInput = query.first;
  const secondInput = query.second;
  const first = Number(firstInput);
  const second = Number(secondInput);
  const operations = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => a / b,
    modulus: (a, b) => a % b,
    power: (a, b) => a ** b
  };

  if (!Object.prototype.hasOwnProperty.call(operations, operation)) {
    return { error: "Choose a supported operation." };
  }

  if (firstInput === undefined || secondInput === undefined || String(firstInput).trim() === "" || String(secondInput).trim() === "" || !Number.isFinite(first) || !Number.isFinite(second)) {
    return { error: "Enter two valid finite numbers." };
  }

  if ((operation === "divide" || operation === "modulus") && second === 0) {
    return { error: "The second number must not be zero for division or modulus." };
  }

  const result = operations[operation](first, second);
  if (!Number.isFinite(result)) {
    return { error: "The result is outside the supported numeric range." };
  }

  return { operation, first, second, result };
}

function wantsJson(req) {
  return req.is("application/json") || (req.get("accept") || "").includes("application/json");
}

app.get("/", (req, res) => {
  res.render("index", {
    title: "Node.js, Express and EJS Lab Tasks",
    taskId: null,
    profile,
    tasks,
  });
});

app.get("/task/:taskId", (req, res, next) => {
  const taskId = Number(req.params.taskId);
  if (!Number.isInteger(taskId) || !taskDetails[taskId]) return next();

  if (taskId === 2) {
    const submitted = ["operation", "first", "second"].some(key => Object.prototype.hasOwnProperty.call(req.query, key));
    const calculatorResult = submitted ? calculate(req.query) : null;
    return renderTask(res, taskId, {
      calculatorResult,
      calculatorValues: req.query
    }, calculatorResult && calculatorResult.error ? 400 : 200);
  }

  if (taskId === 3) {
    return renderTask(res, taskId, { added: req.query.added === "1" });
  }

  return renderTask(res, taskId);
});

app.get("/api/profile/text", (req, res) => {
  res.type("text/plain").send(`${profile.name}\nRoll number: ${profile.rollNumber}\nBranch: ${profile.branch}`);
});

app.get("/api/profile/html", (req, res) => {
  res.type("html").send(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Student Profile</title></head><body><main><h1>${profile.name}</h1><dl><dt>Roll number</dt><dd>${profile.rollNumber}</dd><dt>Branch</dt><dd>${profile.branch}</dd></dl></main></body></html>`);
});

app.get("/api/profile/json", (req, res) => {
  res.json(profile);
});

app.get("/api/calculator", (req, res) => {
  const calculation = calculate(req.query);
  if (calculation.error) return res.status(400).json(calculation);
  res.json(calculation);
});

app.get("/students", (req, res) => {
  res.json(students);
});

app.get("/students/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(400).json({ error: "Student ID must be an integer." });
  const student = students.find(record => record.id === id);
  if (!student) return res.status(404).json({ error: "Student not found." });
  res.json(student);
});

app.post("/students/add", (req, res) => {
  const name = String(req.body.name || "").trim();
  const course = String(req.body.course || "").trim();
  const semester = Number(req.body.semester || 1);
  const errors = [];

  if (!name) errors.push("Enter the student's name.");
  if (!course) errors.push("Enter a course.");
  if (!Number.isInteger(semester) || semester < 1 || semester > 8) errors.push("Semester must be a whole number from 1 to 8.");

  if (errors.length) {
    if (wantsJson(req)) return res.status(400).json({ errors });
    return renderTask(res, 3, { formError: errors.join(" "), formValues: req.body }, 400);
  }

  const student = { id: nextStudentId++, name, course, semester };
  students.push(student);

  if (wantsJson(req)) return res.status(201).json(student);
  res.redirect(303, "/task/3?added=1");
});

app.post("/student-registration", (req, res) => {
  const registration = {
    name: String(req.body.name || "").trim(),
    email: String(req.body.email || "").trim(),
    course: String(req.body.course || "").trim(),
    semester: String(req.body.semester || "").trim()
  };
  const errors = [];

  if (registration.name.length < 2) errors.push("Enter a name with at least two characters.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registration.email)) errors.push("Enter a valid email address.");
  if (!courseOptions.includes(registration.course)) errors.push("Choose a course from the list.");
  if (!/^[1-8]$/.test(registration.semester)) errors.push("Choose a semester from 1 to 8.");

  if (errors.length) {
    return renderTask(res, 5, { registrationValues: registration, formError: errors.join(" ") }, 400);
  }

  renderTask(res, 5, { registration });
});

app.use("/api", (req, res) => {
  res.status(404).json({ error: "API route not found." });
});

app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

app.listen(PORT, () => {
  console.log(`Experiment 12 is running at http://localhost:${PORT}`);
});
