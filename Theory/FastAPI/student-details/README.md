# Student Details — FastAPI SSR

A FastAPI route and Jinja2 template that serve student details (name, SAP ID,
batch) as server-rendered HTML. The data lives on the server; the browser
receives a finished page.

## Run

```bash
python3 -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Open http://127.0.0.1:8000

## Routes

| Method | Path             | What it does                              |
|--------|------------------|-------------------------------------------|
| GET    | `/`              | Student table (same as `/students`)       |
| GET    | `/students`      | Student table                             |
| GET    | `/students/add`  | Blank form                                |
| POST   | `/students/add`  | Validates, saves, redirects to the table  |

## Structure

```
student-details/
├── main.py                     FastAPI app and routes
├── requirements.txt
├── templates/
│   ├── base.html               shared layout
│   ├── students.html           the table
│   └── add_student.html        the form
└── static/
    └── style.css
```

## How the rendering works

`Jinja2Templates(directory="templates")` points FastAPI at the template folder.
A route returns `TemplateResponse(request=request, name=..., context={...})`;
Jinja2 fills the placeholders and FastAPI sends back HTML with
`Content-Type: text/html`, not JSON.

`request` is required because Jinja2 uses it to build `url_for()` links — that
is how `base.html` resolves the stylesheet path.

The table loop uses Jinja2's `{% for %} … {% else %} … {% endfor %}`, where the
`{% else %}` branch runs when the list is empty. That is a Jinja2 feature, not
standard Python.

## Note on validation

`main.py` re-checks every field the form already marked `required` and
`pattern`. Browser validation is a convenience and can be bypassed, so the
server has to validate again. Data is held in a Python list, so it resets on
every restart — a real app would use a database.
