// Experiment 07 & 08, Section 6: Interactive To-Do List
//
// Same structure as the lab sheet: a Task class, a tasks array, renderTasks(),
// addTask(), the Enter key, and ONE click listener on the <ul> (event delegation).
// Added on top of the lab code:
//   - the list is saved in localStorage, so it survives a page reload
//   - a summary line ("3 tasks, 1 done") and a message when the list is empty
//   - ids that stay unique even if two tasks are added in the same millisecond

// State
let tasks = [];

// DOM elements
const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const summary = document.getElementById("summary");
const emptyMsg = document.getElementById("empty");

const STORAGE_KEY = "exp78-tasks";

// ES6 class for Task
class Task {
    constructor(title) {
        // Date.now() alone can repeat if two tasks are made in the same millisecond
        this.id = Math.max(Date.now(), ...tasks.map(t => t.id + 1));
        this.title = title;
        this.completed = false;
    }
}

// Save and load. localStorage can be blocked (private mode), so errors are ignored.
const saveTasks = () => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.warn("Could not save tasks:", error.message);
    }
};

const loadTasks = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch (error) {
        return [];
    }
};

// Render tasks
const renderTasks = () => {
    list.innerHTML = "";

    emptyMsg.hidden = tasks.length > 0;    // show "No tasks yet." only for an empty list

    tasks.forEach(({ id, title, completed }) => {        // destructuring
        const li = document.createElement("li");
        li.dataset.id = id;                                // data-id="..."

        const span = document.createElement("span");
        span.textContent = title;                          // textContent, never innerHTML, for user text
        if (completed) span.classList.add("done");

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.textContent = "Delete";
        delBtn.classList.add("delete-btn");

        li.append(span, delBtn);
        list.appendChild(li);
    });

    const done = tasks.filter(t => t.completed).length;
    summary.textContent = `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}, ${done} done`;

    saveTasks();
};

// Add task
const addTask = () => {
    const title = input.value.trim();
    if (!title) return;                    // ignore empty or spaces-only input
    tasks = [...tasks, new Task(title)];   // spread operator
    input.value = "";
    input.focus();
    renderTasks();
};

// Event listeners
addBtn.addEventListener("click", addTask);

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addTask();
});

// Event delegation for toggle & delete
list.addEventListener("click", (event) => {
    const li = event.target.closest("li");
    if (!li) return;
    const id = Number(li.dataset.id);      // dataset values are always strings

    if (event.target.classList.contains("delete-btn")) {
        tasks = tasks.filter(t => t.id !== id);
    } else {
        tasks = tasks.map(t =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
    }
    renderTasks();
});

// Start
tasks = loadTasks();
renderTasks();
