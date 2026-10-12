---
title: "Lecture 5: FastAPI CRUD API and Course API Lab"
layout: default
---

# Lecture 5: FastAPI CRUD API and Course API Lab

**Course:** Backend Development, Unit 1
**Lecture:** 5, RESTful APIs and FastAPI
**Student:** Krish Pawar · B.Tech CSE · SAP ID 590017543 · UPES Dehradun

**Source:** [`main.py`](https://github.com/Krish252616/backend-development/blob/main/Theory/Lecture-05/fastapi-crud/main.py) (Task 1, students) · [`lab/main.py`](https://github.com/Krish252616/backend-development/blob/main/Theory/Lecture-05/fastapi-crud/lab/main.py) (lab exercise, courses)

---

## 1. Aim

To build a RESTful API with FastAPI that supports all CRUD operations on a `students` resource, validates input with Pydantic, returns the correct HTTP status codes, and documents itself with Swagger UI and ReDoc. Then, in the lab exercise, to build the same kind of API on my own for a new resource, **courses**.

## 2. Endpoints

**Task 1: students** (`main.py`)

| Method | Route | What it does | Success code |
|---|---|---|---|
| GET | `/students` | List all students | 200 |
| GET | `/students?branch=CSE` | List students of one branch (case does not matter) | 200 |
| GET | `/students/{student_id}` | One student, or `404` if not found | 200 |
| POST | `/students` | Create a student, the server assigns the id | 201 |
| PUT | `/students/{student_id}` | Replace a student's name and branch | 200 |
| DELETE | `/students/{student_id}` | Delete a student | 204 |

**Lab exercise: courses** (`lab/main.py`)

A course has `id`, `title`, `credits` and `department`.

| Method | Route | What it does | Success code | Error |
|---|---|---|---|---|
| GET | `/courses` | List all courses | 200 | |
| GET | `/courses?department=CSE` | Courses of one department (case does not matter) | 200 | Empty list `[]` if none match |
| GET | `/courses/{course_id}` | One course | 200 | 404 `Course not found` |
| POST | `/courses` | Create a course, the server assigns the id | 201 | 422 if a field is missing or invalid |
| PUT | `/courses/{course_id}` | Replace a course's title, credits and department | 200 | 404, 422 |
| DELETE | `/courses/{course_id}` | Delete a course | 204 | 404 |

Both apps use port 5000, so run one at a time. Interactive docs for either app: http://127.0.0.1:5000/docs (Swagger UI) and http://127.0.0.1:5000/redoc (ReDoc).

## 3. How to run

```bash
cd Theory
source .venv/bin/activate          # the venv from Theory/requirements.txt
cd Lecture-05/fastapi-crud
python main.py
```

For the lab, go one folder further in:

```bash
cd lab
python main.py
```

Stop the first server with `Ctrl + C` before starting the other one, because both use port 5000. Each `main.py` starts Uvicorn on port **5000**. If you start it with `uvicorn main:app --reload` instead, the default port is **8000**, so the docs are at http://127.0.0.1:8000/docs.

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

**Lab: the Course models, with validation rules**

```python
class Course(BaseModel):
    id: int
    title: str
    credits: int
    department: str

class CourseCreate(BaseModel):
    title: str = Field(min_length=1, examples=["Operating Systems"])
    credits: int = Field(gt=0, le=10, examples=[4])
    department: str = Field(min_length=1, examples=["CSE"])
```

Same idea as `Student` and `StudentCreate`. `Field(...)` adds rules on top of the type: the title and department cannot be empty strings, and credits must be more than 0 and at most 10. Pydantic checks these before my function runs, so a course with `credits: 0` gets `422` without any `if` in my code. `examples` is the sample body that Swagger UI and ReDoc show.

**Lab Exercise 5: the department filter**

```python
@app.get("/courses", response_model=List[Course])
def list_courses(department: Optional[str] = Query(None, description="Filter by department, for example CSE")):
    if department:
        return [c for c in courses if c.department.upper() == department.upper()]
    return courses
```

`department` is not in the route path, so FastAPI reads it from the query string. Without `?department=...` it is `None` and every course is returned. `.upper()` on both sides makes `cse`, `Cse` and `CSE` all match. The `description` shows up next to the box in Swagger UI.

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

### Lab exercise: Course API

**GET /courses** in the browser

![GET all courses](lab/screenshots/get-all-courses.png)

**Exercise 5: GET /courses?department=CSE**

![Filter by department](lab/screenshots/filter-department-cse.png)

**GET /courses/99** returns 404

![Course not found](lab/screenshots/course-not-found.png)

**Exercise 3: Swagger UI at `/docs`.** All five operations are listed, plus the `Course` and `CourseCreate` schemas taken from the Pydantic models.

![Swagger UI for the Course API](lab/screenshots/swagger-ui.png)

Each endpoint was then tested with **Try it out** and **Execute**, in this order:

GET with `department = CSE`: 200, two CSE courses

![Swagger GET with department filter](lab/screenshots/swagger-get-department-cse.png)

POST a new course, Operating Systems: 201, the server gives it `id: 5`

![Swagger POST 201](lab/screenshots/swagger-post-201.png)

GET course 5: 200, the new course is really saved

![Swagger GET by id](lab/screenshots/swagger-get-by-id.png)

PUT course 3: 200, title and credits replaced

![Swagger PUT 200](lab/screenshots/swagger-put-200.png)

DELETE course 4: 204, no response body

![Swagger DELETE 204](lab/screenshots/swagger-delete-204.png)

POST with `credits: 0`: 422, the `gt=0` rule rejected it

![Swagger POST 422](lab/screenshots/swagger-post-422.png)

**Exercise 4: ReDoc at `/redoc`.** The same five operations in the left menu, generated from the same code.

![ReDoc for the Course API](lab/screenshots/redoc.png)

The ReDoc page for Create Course shows the rules from `Field(...)`: title and department `non-empty`, credits `( 0 .. 10 ]`. The round bracket means 0 itself is not allowed and the square bracket means 10 is allowed, which matches `gt=0, le=10`.

![ReDoc Create Course](lab/screenshots/redoc-create-course.png)

**All operations with curl**

```text
$ curl 127.0.0.1:5000/courses
[{"id":1,"title":"Backend Development","credits":4,"department":"CSE"},{"id":2,"title":"Data Structures","credits":4,"department":"CSE"},{"id":3,"title":"Digital Electronics","credits":3,"department":"ECE"},{"id":4,"title":"Engineering Mathematics","credits":3,"department":"MATH"}]

$ curl 127.0.0.1:5000/courses/2
{"id":2,"title":"Data Structures","credits":4,"department":"CSE"}

$ curl -i 127.0.0.1:5000/courses/99
HTTP/1.1 404 Not Found
content-type: application/json

{"detail":"Course not found"}

$ curl "127.0.0.1:5000/courses?department=CSE"
[{"id":1,"title":"Backend Development","credits":4,"department":"CSE"},{"id":2,"title":"Data Structures","credits":4,"department":"CSE"}]

$ curl "127.0.0.1:5000/courses?department=ece"
[{"id":3,"title":"Digital Electronics","credits":3,"department":"ECE"}]

$ curl "127.0.0.1:5000/courses?department=CIVIL"
[]

$ curl -i -X POST 127.0.0.1:5000/courses -H "Content-Type: application/json" -d '{"title": "Operating Systems", "credits": 4, "department": "CSE"}'
HTTP/1.1 201 Created
content-type: application/json

{"id":5,"title":"Operating Systems","credits":4,"department":"CSE"}

$ curl -i -X PUT 127.0.0.1:5000/courses/3 -H "Content-Type: application/json" -d '{"title": "Digital Electronics Lab", "credits": 2, "department": "ECE"}'
HTTP/1.1 200 OK
content-type: application/json

{"id":3,"title":"Digital Electronics Lab","credits":2,"department":"ECE"}

$ curl -i -X DELETE 127.0.0.1:5000/courses/4
HTTP/1.1 204 No Content

$ curl -i 127.0.0.1:5000/courses/4
HTTP/1.1 404 Not Found
content-type: application/json

{"detail":"Course not found"}

$ curl "127.0.0.1:5000/courses?department=CSE"
[{"id":1,"title":"Backend Development","credits":4,"department":"CSE"},{"id":2,"title":"Data Structures","credits":4,"department":"CSE"},{"id":5,"title":"Operating Systems","credits":4,"department":"CSE"}]
```

The last line shows the filter also picks up the course added with POST.

**Errors (404 and 422)**

```text
$ curl -i -X DELETE 127.0.0.1:5000/courses/4          # already deleted
HTTP/1.1 404 Not Found

{"detail":"Course not found"}

$ curl -X POST 127.0.0.1:5000/courses -H "Content-Type: application/json" -d '{"title": "Compilers", "department": "CSE"}'
{"detail":[{"type":"missing","loc":["body","credits"],"msg":"Field required","input":{"title":"Compilers","department":"CSE"}}]}

$ curl -X POST 127.0.0.1:5000/courses -H "Content-Type: application/json" -d '{"title": "Compilers", "credits": 0, "department": "CSE"}'
{"detail":[{"type":"greater_than","loc":["body","credits"],"msg":"Input should be greater than 0","input":0,"ctx":{"gt":0}}]}

$ curl -X POST 127.0.0.1:5000/courses -H "Content-Type: application/json" -d '{"title": "Compilers", "credits": "four", "department": "CSE"}'
{"detail":[{"type":"int_parsing","loc":["body","credits"],"msg":"Input should be a valid integer, unable to parse string as an integer","input":"four"}]}

$ curl 127.0.0.1:5000/courses/abc
{"detail":[{"type":"int_parsing","loc":["path","course_id"],"msg":"Input should be a valid integer, unable to parse string as an integer","input":"abc"}]}
```

`loc` tells exactly where the bad value was: `["body","credits"]` is the `credits` field of the JSON body, `["path","course_id"]` is the id in the URL.

## 6. Lab exercises

| # | Exercise | Where it is done | Result |
|---|---|---|---|
| 1 | FastAPI app for a **Course** resource with `id`, `title`, `credits`, `department` | `lab/main.py`, models `Course` and `CourseCreate` | 4 starting courses, ids assigned by the server |
| 2 | All five CRUD operations | `list_courses`, `get_course`, `create_course`, `update_course`, `delete_course` | 200, 200, 201, 200, 204, and 404 for a missing id |
| 3 | Test every endpoint in Swagger UI at `/docs` and take a screenshot | [Swagger screenshots](#lab-exercise-course-api) | Each operation run with Try it out, status codes as expected |
| 4 | Check ReDoc at `/redoc` | [ReDoc screenshots](#lab-exercise-course-api) | All 5 operations, body schema and validation rules shown |
| 5 | `GET /courses?department=CSE` filter | `department: Optional[str] = Query(None)` | 2 CSE courses, then 3 after the POST. Case does not matter, no match gives `[]` |

## 7. What I learned

1. In REST, the URL names the resource (`/students`) and the HTTP method says the action. So it is `POST /students`, not `/createStudent`.
2. Each operation has its own correct status code: `201` for create, `204` for delete with no body, `404` for a missing record, `422` for invalid data.
3. Type hints do real work in FastAPI. `student_id: int` alone makes `/students/abc` fail with a clear error, without me writing any check.
4. Using two models (`StudentCreate` for input, `Student` for output) stops the client from choosing its own id.
5. Swagger UI is generated from the code, so the documentation always matches the API. It also lets me send POST, PUT and DELETE requests without Postman.
6. `PUT` replaces the whole record, so both `name` and `branch` must be sent. Sending only one field gives `422`.
7. The data lives in a Python list, so every restart brings back the original three students. A database is needed to keep changes.
8. Building the Course API from scratch showed that the REST pattern is the same for any resource: change the model and the route names, and the five operations stay the same.
9. `Field(...)` puts rules like "more than 0" into the model itself, and they appear in the docs automatically. The 422 error even says which field failed and why.
10. A filter that matches nothing should return `200` with `[]`, not `404`. The list exists, it is just empty. `404` is for one item that does not exist.

## 8. Problems and Windows vs macOS differences

| Problem | Cause | Fix |
|---|---|---|
| The docs were not at `localhost:5000/docs` when I started the server with `uvicorn main:app --reload` | The `uvicorn` command uses port **8000** by default. Port 5000 is only used when running `python main.py`, which calls `uvicorn.run(..., port=5000)` | Used `python main.py`, or opened `localhost:8000/docs` |
| On macOS, `python main.py` failed with "address already in use" on port 5000 | The macOS AirPlay Receiver service uses port 5000 | Turned off AirPlay Receiver in System Settings > General > AirDrop & Handoff, or changed `port=5000` to `port=5001` |
| The lecture's multi-line curl command (lines ending in `\`) failed on Windows | `\` for line breaks only works in macOS and Linux terminals, and Command Prompt does not accept single quotes around JSON | Wrote the command on one line with `\"` inside double quotes, or used `Invoke-RestMethod` in PowerShell |
| Opening `/students` with POST in the browser was not possible | The address bar only sends GET requests | Used Swagger UI "Try it out", Postman, or curl for POST, PUT and DELETE |
| Swagger UI and ReDoc pages stayed blank on a network that blocks CDNs | FastAPI loads the Swagger UI and ReDoc files from `cdn.jsdelivr.net` | Used an open network. The API itself keeps working, only the docs pages need the CDN |
| This folder had no package list of its own | Only `Theory/requirements.txt` existed | Added `fastapi-crud/requirements.txt` with the same versions |
| Lab: starting the Course API gave "address already in use" | The students API from Task 1 was still running on port 5000 | Stopped it with `Ctrl + C` first. On macOS `lsof -i :5000` shows what is using the port, on Windows run `netstat -ano` in Command Prompt and look for `:5000` |
| Lab: with `credits: int` alone, a course with `credits: 0` or `-3` would be accepted | The type hint only checks that the value is an integer, and 0 and -3 are integers | Used `Field(gt=0, le=10)`, so Pydantic rejects these with 422 (shown in the Swagger and curl output) |
| Lab: in Swagger UI, DELETE showed no response body | `204 No Content` means the server sends no body on purpose | Not an error. The status code alone says the delete worked, and a GET for the same id now gives 404 |

## 9. Result

The API supports all five CRUD operations with the correct status codes (200, 201, 204, 404, 422), filters by branch through a query parameter, and documents every endpoint in Swagger UI and ReDoc. The Course API lab repeats all of this for a new resource, adds validation rules with `Field`, and filters by department with `?department=CSE`. All five lab exercises are done and tested in Swagger UI, ReDoc and curl.
