// Tests for the PBL activity, using Node's built-in test runner.
// Run from this folder:  node --test
const { test, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const { library, addBook, findBook } = require("./library.js");

beforeEach(() => {
    library.length = 0;      // start every test with an empty library
});

test("addBook adds a book object to the library array", () => {
    const book = addBook("Clean Code", "Robert C. Martin");
    assert.equal(library.length, 1);
    assert.equal(book.title, "Clean Code");
    assert.equal(book.author, "Robert C. Martin");
    assert.equal(library[0], book);           // the same object is stored
});

test("addBook gives each book its own id", () => {
    const a = addBook("Book A", "Author A");
    const b = addBook("Book B", "Author B");
    assert.notEqual(a.id, b.id);
});

test("addBook trims spaces", () => {
    const book = addBook("  Refactoring  ", "  Martin Fowler ");
    assert.equal(book.title, "Refactoring");
    assert.equal(book.author, "Martin Fowler");
});

test("addBook rejects a missing title or author", () => {
    assert.throws(() => addBook("", "Someone"), /Title is required/);
    assert.throws(() => addBook("   ", "Someone"), /Title is required/);
    assert.throws(() => addBook("A Title"), /Author is required/);
    assert.equal(library.length, 0);           // nothing was added
});

test("findBook finds a book by its exact title", () => {
    addBook("Clean Code", "Robert C. Martin");
    const found = findBook("Clean Code");
    assert.equal(found.author, "Robert C. Martin");
});

test("findBook ignores case and extra spaces", () => {
    addBook("The Pragmatic Programmer", "Andrew Hunt and David Thomas");
    assert.equal(findBook("  the pragmatic PROGRAMMER ").title, "The Pragmatic Programmer");
});

test("findBook returns null when the title is not in the library", () => {
    addBook("Clean Code", "Robert C. Martin");
    assert.equal(findBook("Harry Potter"), null);
    assert.equal(findBook("Clean"), null);    // part of a title is not a match
});
