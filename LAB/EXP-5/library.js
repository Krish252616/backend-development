// Experiment 5, PBL activity: a library of books kept in an array of objects.
//
//   addBook(title, author)  adds a book object to the array and returns it
//   findBook(title)         returns the book with that title, or null
//
// Run the demo:   node library.js
// Run the tests:  node --test

// 1. The array that holds every book
const library = [];

let nextId = 1;

// 2. Add a book object to the array
function addBook(title, author) {
    if (typeof title !== "string" || title.trim() === "") {
        throw new Error("Title is required");
    }
    if (typeof author !== "string" || author.trim() === "") {
        throw new Error("Author is required");
    }

    const book = {
        id: nextId++,
        title: title.trim(),
        author: author.trim()
    };
    library.push(book);
    return book;
}

// 3. Find a book by its title.
// Case and extra spaces are ignored, so "  the hobbit " finds "The Hobbit".
function findBook(title) {
    const wanted = String(title).trim().toLowerCase();
    const book = library.find(b => b.title.toLowerCase() === wanted);
    return book || null;      // null, not undefined, makes "not found" clear
}

module.exports = { library, addBook, findBook };

// 4. Demo, only when this file is run directly (not when the tests import it)
if (require.main === module) {
    console.log("--- Adding books ---");
    console.log(addBook("Clean Code", "Robert C. Martin"));
    console.log(addBook("The Pragmatic Programmer", "Andrew Hunt and David Thomas"));
    console.log(addBook("You Don't Know JS", "Kyle Simpson"));

    console.log("\n--- Library ---");
    console.table(library);

    console.log("\n--- Finding books ---");
    console.log('findBook("Clean Code"):', findBook("Clean Code"));
    console.log('findBook("  you don\'t know js "):', findBook("  you don't know js "));
    console.log('findBook("Harry Potter"):', findBook("Harry Potter"));

    console.log("\n--- Invalid input ---");
    try {
        addBook("", "No Title");
    } catch (error) {
        console.log("addBook(\"\", \"No Title\") ->", error.message);
    }
}
