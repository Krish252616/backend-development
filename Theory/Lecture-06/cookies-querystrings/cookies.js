// Lecture 6, Section 3: Cookies in Express with cookie-parser
//
// Routes from the lecture:
//   /setcookie     sets username=JohnDoe (1 hour, httpOnly)
//   /getcookie     reads it back
//   /deletecookie  removes it
// Added to test the security attributes:
//   /settoken      the lecture's example: httpOnly + secure + sameSite strict
//   /settheme      a cookie WITHOUT httpOnly, so page JavaScript can read it
//   /setsigned     a signed cookie: the user can see it but cannot change it
//   /getsigned     reads it back with req.signedCookies
//   /              a small page with links and a button that shows document.cookie

const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// The secret is used to sign cookies. A real app reads it from an environment variable.
app.use(cookieParser('myCookieSecret'));

// Home page: links to every route, and a button that runs document.cookie
app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Cookies | Lecture 6</title>
<style>
  body { font-family: system-ui, sans-serif; margin: 32px; color: #1d2330; }
  a { margin-right: 14px; }
  pre { background: #f2f4f7; padding: 10px; border-radius: 6px; }
</style></head>
<body>
  <h1>Cookies demo</h1>
  <p>
    <a href="/setcookie">/setcookie</a>
    <a href="/getcookie">/getcookie</a>
    <a href="/deletecookie">/deletecookie</a>
    <a href="/settoken">/settoken</a>
    <a href="/settheme">/settheme</a>
    <a href="/setsigned">/setsigned</a>
    <a href="/getsigned">/getsigned</a>
  </p>
  <button id="show" type="button">Show document.cookie</button>
  <pre id="out"></pre>
  <script>
    document.getElementById('show').addEventListener('click', () => {
      document.getElementById('out').textContent = 'document.cookie = "' + document.cookie + '"';
    });
  </script>
</body>
</html>`);
});

// Set a cookie
app.get('/setcookie', (req, res) => {
  res.cookie('username', 'JohnDoe', {
    maxAge: 3600000, // 1 hour
    httpOnly: true,  // not accessible by JavaScript
    secure: false    // true only if using HTTPS
  });
  res.send('Cookie has been set!');
});

// Read a cookie
app.get('/getcookie', (req, res) => {
  const user = req.cookies.username;
  if (user) {
    res.send('Welcome back, ' + user);
  } else {
    res.send('No cookie found.');
  }
});

// Delete a cookie
app.get('/deletecookie', (req, res) => {
  res.clearCookie('username');
  res.send('Cookie deleted.');
});

// The lecture's security example
app.get('/settoken', (req, res) => {
  res.cookie('token', 'abc123', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
  res.send('Token cookie has been set (httpOnly, secure, sameSite strict).');
});

// A preference cookie that page JavaScript is allowed to read (no httpOnly)
app.get('/settheme', (req, res) => {
  res.cookie('theme', 'dark', { maxAge: 3600000, sameSite: 'lax' });
  res.send('Theme cookie has been set (readable by JavaScript).');
});

// Signed cookie: the value is sent with a signature made from the secret.
// If the user edits the value, the signature no longer matches.
app.get('/setsigned', (req, res) => {
  res.cookie('user', 'JohnDoe', { maxAge: 3600000, httpOnly: true, signed: true });
  res.send('Signed cookie has been set!');
});

app.get('/getsigned', (req, res) => {
  const user = req.signedCookies.user;   // false if the signature is wrong
  if (user) {
    res.send('Welcome back, ' + user + ' (signature OK)');
  } else if (user === false) {
    res.status(400).send('Cookie was changed by the client. Signature does not match.');
  } else {
    res.send('No signed cookie found.');
  }
});

app.listen(3000, (error) => {
  if (error) throw error;   // Express 5 reports "port already in use" here
  console.log('Server running on port 3000');
});
