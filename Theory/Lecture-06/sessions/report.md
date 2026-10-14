---
title: "Lecture 6: Sessions with express-session"
layout: default
---

# Lecture 6: Sessions with express-session

**Course:** Backend Development, Unit 1
**Lecture:** 6, Managing Server-side Session, Cookie and State Management
**Student:** Krish Pawar · B.Tech CSE · SAP ID 590017543 · UPES Dehradun

**Source:** [`app.js`](https://github.com/Krish252616/backend-development/blob/main/Theory/Lecture-06/sessions/app.js)

The cookies and query strings part of this lecture is in a separate report: [Lecture 6: Cookies and Query Strings](../cookies-querystrings/report.md).

---

## 1. Aim

HTTP is stateless, so a server forgets the user after every request. The aim is to use `express-session` to remember a logged-in user across requests, and to study where the session data and the session ID are stored.

## 2. Routes

| Route | What it does |
|---|---|
| `GET /login` | Saves `username = "JohnDoe"` in the session |
| `GET /profile` | Shows `Welcome JohnDoe` if the session has a username, otherwise `Please log in first.` |
| `GET /logout` | Destroys the session |

## 3. How to run

```bash
cd Theory/Lecture-06/sessions
npm install
npm start          # or: npm run dev  (restarts on file changes with nodemon)
```

Open the routes in this order: http://localhost:3000/profile, then `/login`, `/profile`, `/logout`, `/profile`.

| Step | macOS (Terminal, zsh) | Windows |
|---|---|---|
| Install and run | `npm install` then `npm start` | Same |
| See the cookie | Chrome: `Cmd + Option + I` > Application > Cookies | Chrome: `F12` or `Ctrl + Shift + I` > Application > Cookies |
| Keep the session with curl | `curl -c jar.txt -b jar.txt localhost:3000/login` | Command Prompt: same command. PowerShell: use `curl.exe` |
| Free port 3000 | `lsof -ti :3000 \| xargs kill` | `netstat -ano \| findstr :3000`, then `taskkill /PID <number> /F` |

## 4. Code walkthrough

```javascript
app.use(session({
  secret: 'mySecretKey',       // signs the session ID cookie
  resave: false,               // do not save again if nothing changed
  saveUninitialized: true,     // save new sessions even if empty
  cookie: { maxAge: 60000 }    // cookie lives for 60000 ms = 1 minute
}));
```

| Operation | Code |
|---|---|
| Store a value | `req.session.username = 'JohnDoe'` |
| Read it on a later request | `req.session.username` |
| End the session | `req.session.destroy(callback)` |

How it works:

1. On `/login`, the server creates a session and stores `username` **on the server** (in memory).
2. It sends the browser only a **session ID**, inside a cookie named `connect.sid`.
3. The browser sends that cookie back with every request to the same site.
4. On `/profile`, the server reads the ID, finds the matching session and gets `username`.

## 5. Output

**1. `/profile` before logging in**

![Profile before login](screenshots/1-profile-before-login.png)

**2. `/login`**

![Login](screenshots/2-login.png)

**3. `/profile` after logging in**

![Profile after login](screenshots/3-profile-after-login.png)

**4. `/logout`**

![Logout](screenshots/4-logout.png)

**5. `/profile` after logging out**

![Profile after logout](screenshots/5-profile-after-logout.png)

**The cookie the server sends** (seen with `curl -i`):

```text
$ curl -i -c jar.txt -b jar.txt localhost:3000/login
HTTP/1.1 200 OK
Set-Cookie: connect.sid=s%3ATIYfKEmJFIJd3hQ1aZARwYmzE8rm476_...; Path=/; Expires=Sun, 11 Oct 2026 18:23:09 GMT; HttpOnly
Session started for JohnDoe

$ curl -c jar.txt -b jar.txt localhost:3000/profile
Welcome JohnDoe
```

The cookie holds only the signed session ID (`s%3A...`), not `JohnDoe`. It is `HttpOnly` by default and expires one minute after it was set.

## 6. What I learned

1. The username is stored on the server. The browser only keeps an ID that points to it. This is why sessions are safer than putting user data directly in a cookie.
2. The browser sends cookies automatically. With curl, I had to save and resend them myself with `-c jar.txt -b jar.txt`, otherwise every request looked like a new visitor.
3. `secret` signs the session ID. If someone edits the cookie value, the signature no longer matches, so the server ignores it and treats the visitor as new.
4. The express-session cookie is `HttpOnly` by default, so JavaScript in the page (`document.cookie`) cannot read it. This protects it from XSS.
5. `maxAge: 60000` is in milliseconds, so the login lasts only one minute.
6. Express apps here use plain `GET` for login and logout to keep the demo simple. A real login would use `POST` and check a password.

## 7. Problems I faced and how I fixed them

| Problem | Cause | Fix or explanation |
|---|---|---|
| After restarting the server, `/profile` said `Please log in first.` even though the browser still had the cookie | By default express-session keeps sessions in memory (MemoryStore). A restart deletes all of them, so the old session ID matches nothing | Expected for a demo. A real app stores sessions in Redis or a database |
| After a minute, I was logged out without clicking logout | `cookie: { maxAge: 60000 }` makes the cookie expire after 1 minute | Increase `maxAge` (for example `1000 * 60 * 30` for 30 minutes) |
| After `/logout`, the browser still showed a `connect.sid` cookie in DevTools | `req.session.destroy()` deletes the session on the server but does not remove the cookie. Because `saveUninitialized: true`, the next visit also creates a new empty session and cookie | The user is still logged out, because the server has no `username` for that ID. To also remove the cookie, add `res.clearCookie('connect.sid')` in the logout route |
| Every curl request said `Please log in first.` | curl does not store cookies unless asked | Added `-c jar.txt -b jar.txt` so curl saves and sends the cookie |
| `npm start` did not exist at first | `package.json` only had a `dev` script | Added `"start": "node app.js"` |

## 8. Result

The server remembers the user between requests through a server-side session and a signed, HttpOnly `connect.sid` cookie. Login, profile and logout behave as expected, and the tests showed the two main limits of the default setup: sessions are lost on restart and expire after one minute.
