// fetch() examples from Lecture 4, Section 8, and Exercise 4.
// The page is served by the same Express server (http://localhost:3000),
// so the URLs can be relative: "/students" means http://localhost:3000/students.

const statusEl = document.getElementById("status");
const outputEl = document.getElementById("output");
const listEl = document.getElementById("student-list");

function show(label, status, data) {
  statusEl.textContent = `${label}  →  HTTP ${status}`;
  outputEl.textContent = JSON.stringify(data, null, 2);
}

// Build the list with textContent, never innerHTML, so names are shown as text.
function renderList(students) {
  listEl.replaceChildren();
  students.forEach(student => {
    const li = document.createElement("li");
    li.textContent = `${student.name} (${student.branch})`;
    listEl.appendChild(li);
  });
}

// 1. GET all students, written with .then() like the lecture
function getAllStudents() {
  fetch("/students")
    .then(response => response.json().then(data => ({ response, data })))
    .then(({ response, data }) => {
      console.log("Students:", data);
      show("GET /students", response.status, data);
      renderList(data);
    })
    .catch(error => console.error("Error:", error));
}

// 2. GET one student, checking response.ok.
// fetch() does NOT reject on 404 or 500, so the status must be checked by hand.
function getStudent(id) {
  fetch(`/students/${id}`)
    .then(async response => {
      const data = await response.json();
      if (!response.ok) {
        show(`GET /students/${id}`, response.status, data);
        throw new Error(`Student not found: ${response.status}`);
      }
      return { response, data };
    })
    .then(({ response, data }) => {
      console.log("Found:", data.name, "-", data.branch);
      show(`GET /students/${id}`, response.status, data);
    })
    .catch(error => console.error("Error:", error.message));
}

// 3. POST a new student with async/await
async function createStudent(name, branch) {
  try {
    const response = await fetch("/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, branch })
    });
    const data = await response.json();
    show("POST /students", response.status, data);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    console.log("Created student:", data);
    return data;
  } catch (error) {
    console.error("Failed to create student:", error.message);
  }
}

// 4. Exercise 4: get all students, then keep only CSE in the browser (client side)
async function getCSEStudents() {
  try {
    const response = await fetch("/students");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const students = await response.json();
    const cseStudents = students.filter(s => s.branch === "CSE");
    console.log("CSE students:", cseStudents);
    show(`Exercise 4: ${cseStudents.length} of ${students.length} students are CSE`, response.status, cseStudents);
    renderList(cseStudents);
    return cseStudents;
  } catch (error) {
    console.error("Error:", error.message);
  }
}

document.getElementById("btnAll").addEventListener("click", getAllStudents);
document.getElementById("btnOne").addEventListener("click", () => getStudent(1));
document.getElementById("btnMissing").addEventListener("click", () => getStudent(99));
document.getElementById("btnCse").addEventListener("click", getCSEStudents);
document.getElementById("addForm").addEventListener("submit", event => {
  event.preventDefault();
  createStudent(document.getElementById("name").value, document.getElementById("branch").value);
});
