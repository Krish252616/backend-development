# Student Details: FastAPI Server-Side Rendering

**Lecture:** 8, Server-Side Rendering and Templating Engines
**Student:** Krish Pawar, SAP ID 590017543, B.Tech CSE Core, Batch 5

A FastAPI app that keeps a list of students on the server and uses Jinja2 to turn it into a finished HTML page. The browser receives ready HTML, not JSON. A form lets you add new students, and the server validates every field before saving.

## Run

```bash
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Open http://127.0.0.1:8000

## Routes

| Method | Path | What it does |
|---|---|---|
| GET | `/` | Student table (same as `/students`) |
| GET | `/students` | Student table |
| GET | `/students/add` | Blank form |
| POST | `/students/add` | Validates, saves, then redirects to the table |

## Structure

```
student-details/
├── main.py                 FastAPI app and routes
├── report.md               this report
├── requirements.txt
├── templates/
│   ├── base.html           shared layout (header, nav, footer)
│   ├── students.html       the table
│   └── add_student.html    the form
└── static/
    └── style.css
```

## How the rendering works

1. `Jinja2Templates(directory="templates")` tells FastAPI where the templates are.
2. A route returns `templates.TemplateResponse(request=request, name="students.html", context={"students": students})`.
3. Jinja2 fills the placeholders with the data, and FastAPI sends the result with `Content-Type: text/html`.

`request` must be passed because Starlette (the toolkit FastAPI is built on) uses it to build `url_for()` links. This is how `base.html` finds the stylesheet: `{{ url_for('static', path='/style.css') }}`.

`students.html` and `add_student.html` both start with `{% extends "base.html" %}`, so the header, navigation and footer are written only once.

The table uses `{% for %} ... {% else %} ... {% endfor %}`. In Jinja2, the `{% else %}` part runs when the list is empty, so the page shows "No student details available yet." instead of an empty table.

## Validation

The form already uses `required` and `pattern="[0-9]{9}"`, but browser checks can be skipped (for example with curl or Postman). So `main.py` checks every field again on the server:

| Check | Error shown |
|---|---|
| Any field empty | All three fields are required. |
| SAP ID not exactly 9 digits | SAP ID must be exactly 9 digits. |
| SAP ID already in the list | A student with SAP ID ... already exists. |

On an error, the form is shown again with the message and the typed values kept.

## Post, redirect, get

After a successful save, the server replies with `303 See Other` and sends the browser to `/students`. Because the last request is then a GET, refreshing the page does not submit the form a second time.

## How to show it is SSR

Open the page, right-click and choose **View Page Source**. The student names are already inside the `<td>` tags, which proves the HTML was built on the server.

## Limitation

The data is kept in a Python list, so it resets every time the server restarts. A real app would store it in a database.
