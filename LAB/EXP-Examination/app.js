// Simple CMS: Express + EJS + MongoDB (native driver)

const express = require("express");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017";
const DB_NAME = "cms_lab";
const COLLECTION_NAME = "posts";
const PORT = process.env.PORT || 3000;

// Limits for the create-post form
const LIMITS = { title: 150, author: 60, content: 20000 };

// One client for the whole app. It is created once and reused by every
// request, so no request opens its own connection.
const client = new MongoClient(MONGO_URL);
let postsCollection;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Parse data submitted through HTML forms.
app.use(express.urlencoded({ extended: true }));

// Serve CSS from /public.
app.use(express.static(path.join(__dirname, "public")));

// ---------------------------------------------------------------------------
// Helpers available inside every template
// ---------------------------------------------------------------------------

function isDate(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

app.locals.formatDate = (value) =>
  isDate(value)
    ? value.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "";

app.locals.formatDateTime = (value) =>
  isDate(value)
    ? value.toLocaleString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

app.locals.isoDate = (value) => (isDate(value) ? value.toISOString() : "");

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

// Form values arrive as strings, but a crafted request can send anything,
// so anything that is not a string is treated as empty.
function readField(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validatePost(body) {
  const values = {
    title: readField(body.title),
    content: readField(body.content),
    author: readField(body.author),
  };
  const errors = {};

  if (!values.title) errors.title = "Enter a title.";
  else if (values.title.length > LIMITS.title)
    errors.title = `Title can be at most ${LIMITS.title} characters.`;

  if (!values.content) errors.content = "Enter the post content.";
  else if (values.content.length > LIMITS.content)
    errors.content = `Content can be at most ${LIMITS.content} characters.`;

  if (!values.author) errors.author = "Enter the author name.";
  else if (values.author.length > LIMITS.author)
    errors.author = `Author name can be at most ${LIMITS.author} characters.`;

  return { values, errors };
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// GET / and GET /posts : list of posts
// Only title, author and createdAt are fetched. The full content is left out
// on purpose and is loaded only on the single-post page.
app.get(["/", "/posts"], async (req, res) => {
  const posts = await postsCollection
    .find({}, { projection: { title: 1, author: 1, createdAt: 1 } })
    .sort({ createdAt: -1 })
    .toArray();

  res.render("posts", { posts });
});

// GET /posts/new : create-post form
// This route must stay above /posts/:id, otherwise "new" would be read as an id.
app.get("/posts/new", (req, res) => {
  res.render("new-post", { values: { title: "", content: "", author: "" }, errors: {} });
});

// POST /posts : create a post
app.post("/posts", async (req, res) => {
  const { values, errors } = validatePost(req.body || {});

  if (Object.keys(errors).length > 0) {
    // Show the form again with the messages and what the user already typed.
    return res.status(400).render("new-post", { values, errors });
  }

  await postsCollection.insertOne({
    title: values.title,
    content: values.content,
    author: values.author,
    // The date comes from the server. The form has no date field.
    createdAt: new Date(),
  });

  // 303 sends the browser to a fresh GET, so refreshing the list page
  // does not submit the form a second time.
  res.redirect(303, "/posts");
});

// GET /posts/:id : one complete post
app.get("/posts/:id", async (req, res) => {
  const { id } = req.params;

  // An ObjectId is exactly 24 hex characters. Anything else cannot match a post.
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(404).render("error", {
      status: 404,
      message: "That post link is not valid.",
    });
  }

  const post = await postsCollection.findOne({ _id: new ObjectId(id) });

  if (!post) {
    return res.status(404).render("error", {
      status: 404,
      message: "That post does not exist. It may have been removed.",
    });
  }

  res.render("post", { post });
});

// Anything else
app.use((req, res) => {
  res.status(404).render("error", { status: 404, message: "Page not found." });
});

// Errors thrown in the routes above (for example a database failure) land here.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render("error", {
    status: 500,
    message: "Something went wrong on the server. Try again.",
  });
});

// ---------------------------------------------------------------------------
// Start: connect to MongoDB first, then begin accepting requests
// ---------------------------------------------------------------------------

async function start() {
  await client.connect();
  postsCollection = client.db(DB_NAME).collection(COLLECTION_NAME);
  await postsCollection.createIndex({ createdAt: -1 });
  console.log(`Connected to MongoDB (${DB_NAME}.${COLLECTION_NAME})`);

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Could not start the server:", err.message);
  console.error("Check that MongoDB is running and MONGO_URL is correct.");
  process.exit(1);
});

process.on("SIGINT", async () => {
  await client.close();
  process.exit(0);
});
