// Lecture 6, Section 4: Query strings with req.query
//
// http://localhost:3000/welcome?user=Alice&role=admin
//
// Two changes from the lecture code, both found while testing (see report.md):
//   1. Missing values: /welcome with no query printed "Welcome undefined, your role is undefined".
//      Now a default is used.
//   2. XSS: the lecture code put the URL value straight into the HTML, so
//      ?user=<script>...</script> ran as JavaScript in the browser.
//      Now the values are escaped first, so they are shown as plain text.

const express = require('express');
const app = express();

// Turn the characters that have a meaning in HTML into safe text
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

app.get('/welcome', (req, res) => {
  const user = req.query.user || 'Guest';
  const role = req.query.role || 'visitor';
  res.send(`Welcome ${escapeHtml(user)}, your role is ${escapeHtml(role)}`);
});

// Shows everything Express read from the query string, as JSON
app.get('/query', (req, res) => {
  res.json(req.query);
});

app.listen(3000, (error) => {
  if (error) throw error;   // Express 5 reports "port already in use" here
  console.log('Server running on port 3000');
});
