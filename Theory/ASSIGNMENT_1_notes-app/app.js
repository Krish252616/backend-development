// =====================================================================
// Notes App using localStorage
// Backend Development, L07 (localStorage, sessionStorage and JSON)
// Assignment 01, Task 12
// =====================================================================

// ---------- Storage keys ----------
const NOTES_KEY = "notes";   // array of note objects (our "database")
const THEME_KEY = "theme";   // saved preference: "light" or "dark"

// ---------- DOM references ----------
const form = document.getElementById("noteForm");
const noteInput = document.getElementById("noteInput");
const categorySelect = document.getElementById("categorySelect");
const formError = document.getElementById("formError");
const notesList = document.getElementById("notesList");
const searchInput = document.getElementById("searchInput");
const filterCategory = document.getElementById("filterCategory");
const filterStatus = document.getElementById("filterStatus");
const exportBtn = document.getElementById("exportBtn");
const importInput = document.getElementById("importInput");
const clearBtn = document.getElementById("clearBtn");
const themeToggle = document.getElementById("themeToggle");
const stats = document.getElementById("stats");

// Id of the note currently being edited (null when not editing)
let editingId = null;

// =====================================================================
// Step 2: Helper functions (read and write localStorage)
// =====================================================================

// Read all notes. localStorage stores only strings, so JSON.parse is needed.
// If the key is missing (null) or the data is corrupt, return an empty array
// instead of crashing (Common Mistake 3 in the tutorial).
function getNotes() {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) return [];
    try {
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.error("Could not parse saved notes:", e.message);
        return [];
    }
}

// Save all notes. Objects must be converted to a string with JSON.stringify,
// otherwise localStorage stores "[object Object]" (Common Mistake 1).
function saveNotes(notes) {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

// Create a unique id. Date.now() alone can repeat if two notes are
// added in the same millisecond, so we bump it until it is unused.
function createId(notes) {
    let id = Date.now();
    while (notes.some(n => n.id === id)) id++;
    return id;
}

// =====================================================================
// Step 3: CRUD operations
// =====================================================================

// CREATE
function addNote(text, category) {
    const cleanText = text.trim();
    if (!cleanText) {
        showError("Note cannot be empty.");
        return false;
    }
    const notes = getNotes();
    notes.unshift({
        id: createId(notes),
        text: cleanText,
        category: category || "General",
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: null
    });
    saveNotes(notes);
    renderNotes();
    return true;
}

// READ is done by getNotes()

// UPDATE (text)
function updateNote(id, newText) {
    const cleanText = newText.trim();
    if (!cleanText) {
        alert("Note cannot be empty. Delete it instead if you no longer need it.");
        return false;
    }
    const notes = getNotes();
    const note = notes.find(n => n.id === id);
    if (!note) return false;
    note.text = cleanText;
    note.updatedAt = new Date().toISOString();
    saveNotes(notes);
    return true;
}

// UPDATE (completed / incomplete)
function toggleComplete(id) {
    const notes = getNotes();
    const note = notes.find(n => n.id === id);
    if (!note) return;
    note.completed = !note.completed;
    note.updatedAt = new Date().toISOString();
    saveNotes(notes);
    renderNotes();
}

// DELETE
function deleteNote(id) {
    const notes = getNotes().filter(n => n.id !== id);
    saveNotes(notes);
    if (editingId === id) editingId = null;
    renderNotes();
}

// =====================================================================
// Step 4: Render to DOM
// Elements are built with createElement + textContent instead of
// innerHTML, so text typed by the user can never run as HTML or script.
// =====================================================================

function formatDate(iso) {
    return new Date(iso).toLocaleString(undefined, {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    });
}

function getVisibleNotes(notes) {
    const query = searchInput.value.trim().toLowerCase();
    const category = filterCategory.value;
    const status = filterStatus.value;

    return notes.filter(n => {
        if (query && !n.text.toLowerCase().includes(query)) return false;
        if (category !== "All" && n.category !== category) return false;
        if (status === "active" && n.completed) return false;
        if (status === "completed" && !n.completed) return false;
        return true;
    });
}

function isFiltered() {
    return searchInput.value.trim() !== "" ||
        filterCategory.value !== "All" ||
        filterStatus.value !== "all";
}

function makeButton(label, action, extraClass) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-small" + (extraClass ? " " + extraClass : "");
    btn.textContent = label;
    btn.dataset.action = action;
    return btn;
}

function renderNotes() {
    const notes = getNotes();
    const visible = getVisibleNotes(notes);
    const canDrag = !isFiltered();

    notesList.replaceChildren();

    const done = notes.filter(n => n.completed).length;
    stats.textContent = notes.length === 0
        ? ""
        : `${notes.length} note(s), ${done} completed. Showing ${visible.length}.` +
          (canDrag ? " Drag the handle to reorder." : " Clear search and filters to reorder.");

    if (visible.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent = notes.length === 0
            ? "No notes yet. Add your first note above."
            : "No notes match your search or filters.";
        notesList.appendChild(empty);
        return;
    }

    visible.forEach(note => {
        const card = document.createElement("article");
        card.className = "note-card" + (note.completed ? " completed" : "");
        card.dataset.id = note.id;
        card.draggable = canDrag && editingId === null;

        if (canDrag) {
            const handle = document.createElement("span");
            handle.className = "drag-handle";
            handle.textContent = "::";
            handle.title = "Drag to reorder";
            card.appendChild(handle);
        }

        const check = document.createElement("input");
        check.type = "checkbox";
        check.className = "note-check";
        check.checked = note.completed;
        check.dataset.action = "toggle";
        check.setAttribute("aria-label", "Mark as completed");
        card.appendChild(check);

        const body = document.createElement("div");
        body.className = "note-body";

        if (editingId === note.id) {
            const area = document.createElement("textarea");
            area.className = "edit-area";
            area.rows = 3;
            area.value = note.text;
            area.dataset.role = "edit";
            body.appendChild(area);
        } else {
            const text = document.createElement("p");
            text.className = "note-text";
            text.textContent = note.text;
            body.appendChild(text);
        }

        const meta = document.createElement("div");
        meta.className = "note-meta";
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = note.category || "General";
        const created = document.createElement("span");
        created.textContent = "Created " + formatDate(note.createdAt);
        meta.append(tag, created);
        if (note.updatedAt) {
            const updated = document.createElement("span");
            updated.textContent = "Updated " + formatDate(note.updatedAt);
            meta.appendChild(updated);
        }
        body.appendChild(meta);
        card.appendChild(body);

        const actions = document.createElement("div");
        actions.className = "note-actions";
        if (editingId === note.id) {
            actions.append(
                makeButton("Save", "save", "btn-primary"),
                makeButton("Cancel", "cancel")
            );
        } else {
            actions.append(
                makeButton("Edit", "edit"),
                makeButton("Delete", "delete", "btn-danger")
            );
        }
        card.appendChild(actions);

        notesList.appendChild(card);
    });

    // Focus the edit box when editing starts
    const editArea = notesList.querySelector('[data-role="edit"]');
    if (editArea) {
        editArea.focus();
        editArea.setSelectionRange(editArea.value.length, editArea.value.length);
    }
}

// =====================================================================
// Events
// =====================================================================

function showError(message) {
    formError.textContent = message;
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (addNote(noteInput.value, categorySelect.value)) {
        noteInput.value = "";
        showError("");
        noteInput.focus();
    }
});

// Ctrl/Cmd + Enter adds the note from the textarea
noteInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) form.requestSubmit();
});
noteInput.addEventListener("input", () => showError(""));

// One listener for every button inside the list (event delegation)
notesList.addEventListener("click", (e) => {
    const target = e.target.closest("[data-action]");
    if (!target) return;
    const card = target.closest(".note-card");
    const id = Number(card.dataset.id);

    switch (target.dataset.action) {
        case "toggle":
            toggleComplete(id);
            break;
        case "edit":
            editingId = id;
            renderNotes();
            break;
        case "cancel":
            editingId = null;
            renderNotes();
            break;
        case "save": {
            const area = card.querySelector('[data-role="edit"]');
            if (updateNote(id, area.value)) {
                editingId = null;
                renderNotes();
            }
            break;
        }
        case "delete":
            if (confirm("Delete this note?")) deleteNote(id);
            break;
    }
});

// Keyboard shortcuts while editing: Ctrl/Cmd + Enter saves, Escape cancels
notesList.addEventListener("keydown", (e) => {
    if (e.target.dataset.role !== "edit") return;
    const card = e.target.closest(".note-card");
    if (e.key === "Escape") {
        editingId = null;
        renderNotes();
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        card.querySelector('[data-action="save"]').click();
    }
});

// Search and filters re-render the list
searchInput.addEventListener("input", renderNotes);
filterCategory.addEventListener("change", renderNotes);
filterStatus.addEventListener("change", renderNotes);

// Clear all notes
clearBtn.addEventListener("click", () => {
    if (getNotes().length === 0) return;
    if (confirm("Delete ALL notes? This cannot be undone.")) {
        localStorage.removeItem(NOTES_KEY);
        editingId = null;
        renderNotes();
    }
});

// =====================================================================
// Stretch goal: Export / Import notes as a JSON file
// =====================================================================

exportBtn.addEventListener("click", () => {
    const json = JSON.stringify(getNotes(), null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `notes-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
});

// Check every imported item so a bad file cannot break the app
function isValidNote(n) {
    return n && typeof n === "object" &&
        typeof n.id === "number" &&
        typeof n.text === "string" && n.text.trim() !== "" &&
        typeof n.createdAt === "string";
}

importInput.addEventListener("change", async () => {
    const file = importInput.files[0];
    importInput.value = "";
    if (!file) return;

    try {
        const data = JSON.parse(await file.text());
        if (!Array.isArray(data)) throw new Error("File must contain an array of notes.");

        const valid = data.filter(isValidNote).map(n => ({
            id: n.id,
            text: n.text.trim(),
            category: typeof n.category === "string" ? n.category : "General",
            completed: Boolean(n.completed),
            createdAt: n.createdAt,
            updatedAt: typeof n.updatedAt === "string" ? n.updatedAt : null
        }));

        // Merge: imported notes with an id that already exists are skipped
        const notes = getNotes();
        const existingIds = new Set(notes.map(n => n.id));
        const fresh = valid.filter(n => !existingIds.has(n.id));
        saveNotes([...fresh, ...notes]);
        renderNotes();

        const skipped = data.length - fresh.length;
        alert(`Imported ${fresh.length} note(s).` + (skipped ? ` Skipped ${skipped} (invalid or duplicate).` : ""));
    } catch (err) {
        alert("Import failed: " + err.message);
    }
});

// =====================================================================
// Stretch goal: Dark / Light mode (saved preference)
// =====================================================================

function applyTheme(theme) {
    document.body.classList.toggle("dark", theme === "dark");
    themeToggle.textContent = theme === "dark" ? "Light mode" : "Dark mode";
}

themeToggle.addEventListener("click", () => {
    const next = document.body.classList.contains("dark") ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
});

// =====================================================================
// Stretch goal: Drag to reorder (only when no search/filter is active,
// so the saved order always matches what the user sees)
// =====================================================================

let draggedId = null;

notesList.addEventListener("dragstart", (e) => {
    const card = e.target.closest(".note-card");
    if (!card) return;
    draggedId = Number(card.dataset.id);
    card.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(draggedId));
});

notesList.addEventListener("dragover", (e) => {
    const card = e.target.closest(".note-card");
    if (!card || draggedId === null) return;
    e.preventDefault();
    notesList.querySelectorAll(".drag-over").forEach(c => c.classList.remove("drag-over"));
    if (Number(card.dataset.id) !== draggedId) card.classList.add("drag-over");
});

notesList.addEventListener("drop", (e) => {
    e.preventDefault();
    const card = e.target.closest(".note-card");
    if (!card || draggedId === null) return;
    const targetId = Number(card.dataset.id);
    if (targetId !== draggedId) {
        const notes = getNotes();
        const from = notes.findIndex(n => n.id === draggedId);
        const movingDown = from < notes.findIndex(n => n.id === targetId);
        const [moved] = notes.splice(from, 1);
        const to = notes.findIndex(n => n.id === targetId);
        // Moving down: place after the target. Moving up: place before it.
        notes.splice(movingDown ? to + 1 : to, 0, moved);
        saveNotes(notes);
    }
    draggedId = null;
    renderNotes();
});

notesList.addEventListener("dragend", () => {
    draggedId = null;
    notesList.querySelectorAll(".dragging, .drag-over")
        .forEach(c => c.classList.remove("dragging", "drag-over"));
});

// =====================================================================
// Sync between tabs: localStorage is shared across tabs of the same
// origin. The "storage" event fires in OTHER tabs when data changes.
// =====================================================================

window.addEventListener("storage", (e) => {
    if (e.key === NOTES_KEY || e.key === null) renderNotes();
    if (e.key === THEME_KEY) applyTheme(e.newValue || "light");
});

// =====================================================================
// Start: load saved theme and notes on page load
// =====================================================================

window.onload = () => {
    applyTheme(localStorage.getItem(THEME_KEY) || "light");
    renderNotes();
};
