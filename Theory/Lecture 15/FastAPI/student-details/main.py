"""
Student Details — FastAPI server-side rendering demo.

The server holds the data and renders the HTML itself using Jinja2.
The browser receives a finished page, not JSON.

Run:  uvicorn main:app --reload
Open: http://127.0.0.1:8000
"""

from fastapi import FastAPI, Form, Request, status
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

app = FastAPI(title="Student Details", version="1.0.0")

# Jinja2 looks for .html files inside this folder.
templates = Jinja2Templates(directory="templates")

# Serve the stylesheet from /static/style.css
app.mount("/static", StaticFiles(directory="static"), name="static")


# ---------------------------------------------------------------------------
# Data
# ---------------------------------------------------------------------------
# Kept in memory for this demo, so it resets every time the server restarts.
# A real app would read this from a database.

students = [
    {"name": "Krish Pawar", "sap_id": "590017543", "batch": "B.Tech CSE Core 5"},
    {"name": "Divyansh Panwar", "sap_id": "590018990", "batch": "B.Tech CSE Core 5"},
]


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/")
@app.get("/students")
async def students_page(request: Request):
    """Render the student table.

    `request` is required by Jinja2Templates — it uses it to build url_for()
    links inside the template.
    """
    return templates.TemplateResponse(
        request=request,
        name="students.html",
        context={"students": students},
    )


@app.get("/students/add")
async def add_student_form(request: Request):
    """Show the blank form."""
    return templates.TemplateResponse(
        request=request,
        name="add_student.html",
        context={"error": None},
    )


@app.post("/students/add")
async def add_student(
    request: Request,
    name: str = Form(...),
    sap_id: str = Form(...),
    batch: str = Form(...),
):
    """Handle the submitted form.

    `Form(...)` pulls each field out of the POST body. The three dots mean
    the field is required — FastAPI rejects the request if it's missing.
    """
    name = name.strip()
    sap_id = sap_id.strip()
    batch = batch.strip()

    # Server-side validation. The browser checks these too via the `required`
    # and `pattern` attributes, but that runs on the client and can be
    # bypassed, so the server must check again.
    error = None

    if not name or not sap_id or not batch:
        error = "All three fields are required."
    elif not sap_id.isdigit() or len(sap_id) != 9:
        error = "SAP ID must be exactly 9 digits."
    elif any(s["sap_id"] == sap_id for s in students):
        error = f"A student with SAP ID {sap_id} already exists."

    if error:
        return templates.TemplateResponse(
            request=request,
            name="add_student.html",
            context={"error": error, "name": name, "sap_id": sap_id, "batch": batch},
        )

    students.append({"name": name, "sap_id": sap_id, "batch": batch})

    # Redirect after POST so refreshing the page doesn't resubmit the form.
    # 303 tells the browser to follow up with a GET.
    return RedirectResponse(
        url="/students",
        status_code=status.HTTP_303_SEE_OTHER,
    )
