---
title: "Lecture 5: FastAPI CRUD API"
layout: default
---

# Lecture 5: FastAPI CRUD API

**Course:** Backend Development, Unit 1
**Lecture:** 5, RESTful APIs and FastAPI
**Student:** Krish Pawar · B.Tech CSE · SAP ID 590017543 · UPES Dehradun

**Source:** [`main.py`](https://github.com/Krish252616/backend-development/blob/main/Theory/Lecture-05/fastapi-crud/main.py)

---

## 1. Aim

To build a RESTful API with FastAPI that supports all CRUD operations on a `students` resource, validates input with Pydantic, returns the correct HTTP status codes, and documents itself with Swagger UI and ReDoc.

## 2. Endpoints

| Method | Route | What it does | Success code |
|---|---|---|---|
| GET | `/students` | List all students | 200 |
| GET | `/students?branch=CSE` | List students of one branch (case does not matter) | 200 |
| GET | `/students/{student_id}` | One student, or `404` if not found | 200 |
| POST | `/students` | Create a student, the server assigns the id | 201 |
| PUT | `/students/{student_id}` | Replace a student's name and branch | 200 |
| DELETE | `/students/{student_id}` | Delete a student | 204 |

Interactive docs: http://127.0.0.1:5000/docs (Swagger UI) and http://127.0.0.1:5000/redoc (ReDoc).

## 3. How to run

```bash
cd Theory
source .venv/bin/activate          # the venv from Theory/requirements.txt
cd Lecture-05/fastapi-crud
python main.py
```

`main.py` starts Uvicorn on port **5000**. If you start it with `uvicorn main:app --reload` instead, the default port is **8000**, so the docs are at http://127.0.0.1:8000/docs.

| Step | macOS (Terminal, zsh) | Windows |
|---|---|---|
| Activate the venv | `source .venv/bin/activate` | `.venv\Scripts\activate` |
| Run | `python main.py` | `python main.py` |
| POST with curl | `curl -X POST http://127.0.0.1:5000/students -H "Content-Type: application/json" -d '{"name":"Priya","branch":"CSE"}'` | Command Prompt: `curl -X POST http://127.0.0.1:5000/students -H "Content-Type: application/json" -d "{\"name\":\"Priya\",\"branch\":\"CSE\"}"` |
| POST in PowerShell | | `Invoke-RestMethod -Method Post -Uri http://127.0.0.1:5000/students -ContentType "application/json" -Body '{"name":"Priya","branch":"CSE"}'` |
| Delete | `curl -X DELETE http://127.0.0.1:5000/students/2` | Same in Command Prompt, or `curl.exe` in PowerShell |

## 4. Code walkthrough

**Two Pydantic models**

```python
class Student(BaseModel):
    id: int
    name: str
    branch: str

class StudentCreate(BaseModel):
    name: str
    branch: str
```

`StudentCreate` is what the client sends, so it has no `id`, because the server decides the id. `Student` is what the server sends back. If the body does not match the model, FastAPI rejects it with `422` before my function runs.

**Create with status 201**

```python
@app.post("/students", response_model=Student, status_code=201)
def create_student(student: StudentCreate):
    global next_id
    new_student = Student(id=next_id, **student.model_dump())
    students.append(new_student)
    next_id += 1
    return new_student
```

`student.model_dump()` turns the Pydantic object into a dictionary, and `**` unpacks it, so this becomes `Student(id=4, name="Priya", branch="CSE")`. `global next_id` is needed because the function changes a variable defined outside it.

**404 with HTTPException**

```python
raise HTTPException(status_code=404, detail="Student not found")
```

Raising the exception stops the function and sends `{"detail": "Student not found"}` with status 404.

**How FastAPI knows where each value comes from**

| In the function | FastAPI reads it from |
|---|---|
| `student_id: int` with `{student_id}` in the route | The URL path |
| `branch: Optional[str] = Query(None)` | The query string, `?branch=CSE` |
| `student: StudentCreate` | The JSON request body |

## 5. Output

**GET /students**

![GET all students](screenshots/get-all.png)

**GET /students?branch=cse** (the filter ignores upper or lower case)

![Filter by branch](screenshots/filter-branch.png)

**GET /students/99** returns 404

![Not found](screenshots/not-found.png)

**Swagger UI** at `/docs`

![Swagger UI](screenshots/swagger-ui.png)

**POST from Swagger UI** using "Try it out": status `201` and the new student with `id: 4`

![POST in Swagger returns 201](screenshots/swagger-post-201.png)

**ReDoc** at `/redoc`

![ReDoc](screenshots/redoc.png)

**All CRUD operations with curl**

```text
$ curl -i -X POST 127.0.0.1:5000/students -H "Content-Type: application/json" -d '{"name": "Priya", "branch": "CSE"}'
HTTP/1.1 201 Created
content-type: application/json

{"id":4,"name":"Priya","branch":"CSE"}

$ curl -i -X PUT 127.0.0.1:5000/students/1 -H "Content-Type: application/json" -d '{"name": "Anuj", "branch": "ECE"}'
HTTP/1.1 200 OK
content-type: application/json

{"id":1,"name":"Anuj","branch":"ECE"}

$ curl -i -X DELETE 127.0.0.1:5000/students/2
HTTP/1.1 204 No Content

$ curl 127.0.0.1:5000/students/2
{"detail":"Student not found"}
```

**Validation errors (422)**

```text
$ curl -X POST 127.0.0.1:5000/students -H "Content-Type: application/json" -d '{"name": "Priya"}'
{"detail":[{"type":"missing","loc":["body","branch"],"msg":"Field required","input":{"name":"Priya"}}]}

$ curl 127.0.0.1:5000/students/abc
{"detail":[{"type":"int_parsing","loc":["path","student_id"],"msg":"Input should be a valid integer, unable to parse string as an integer","input":"abc"}]}
```

## 6. What I learned

1. In REST, the URL names the resource (`/students`) and the HTTP method says the action. So it is `POST /students`, not `/createStudent`.
2. Each operation has its own correct status code: `201` for create, `204` for delete with no body, `404` for a missing record, `422` for invalid data.
3. Type hints do real work in FastAPI. `student_id: int` alone makes `/students/abc` fail with a clear error, without me writing any check.
4. Using two models (`StudentCreate` for input, `Student` for output) stops the client from choosing its own id.
5. Swagger UI is generated from the code, so the documentation always matches the API. It also lets me send POST, PUT and DELETE requests without Postman.
6. `PUT` replaces the whole record, so both `name` and `branch` must be sent. Sending only one field gives `422`.
7. The data lives in a Python list, so every restart brings back the original three students. A database is needed to keep changes.

## 7. Problems and Windows vs macOS differences

| Problem | Cause | Fix |
|---|---|---|
| The docs were not at `localhost:5000/docs` when I started the server with `uvicorn main:app --reload` | The `uvicorn` command uses port **8000** by default. Port 5000 is only used when running `python main.py`, which calls `uvicorn.run(..., port=5000)` | Used `python main.py`, or opened `localhost:8000/docs` |
| On macOS, `python main.py` failed with "address already in use" on port 5000 | The macOS AirPlay Receiver service uses port 5000 | Turned off AirPlay Receiver in System Settings > General > AirDrop & Handoff, or changed `port=5000` to `port=5001` |
| The lecture's multi-line curl command (lines ending in `\`) failed on Windows | `\` for line breaks only works in macOS and Linux terminals, and Command Prompt does not accept single quotes around JSON | Wrote the command on one line with `\"` inside double quotes, or used `Invoke-RestMethod` in PowerShell |
| Opening `/students` with POST in the browser was not possible | The address bar only sends GET requests | Used Swagger UI "Try it out", Postman, or curl for POST, PUT and DELETE |
| Swagger UI and ReDoc pages stayed blank on a network that blocks CDNs | FastAPI loads the Swagger UI and ReDoc files from `cdn.jsdelivr.net` | Used an open network. The API itself keeps working, only the docs pages need the CDN |
| This folder had no package list of its own | Only `Theory/requirements.txt` existed | Added `fastapi-crud/requirements.txt` with the same versions |

## 8. Result

The API supports all five CRUD operations with the correct status codes (200, 201, 204, 404, 422), filters by branch through a query parameter, and documents every endpoint in Swagger UI and ReDoc.
