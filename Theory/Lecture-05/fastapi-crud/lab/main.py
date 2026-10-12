# Lecture 5, Lab Exercise: a Course API
#
# 1. A FastAPI app for a Course resource: id, title, credits, department
# 2. All five CRUD operations: GET all, GET by id, POST, PUT, DELETE
# 3. Swagger UI at /docs
# 4. ReDoc at /redoc
# 5. GET /courses?department=CSE filters by department

from fastapi import FastAPI, HTTPException, Query
import uvicorn
from pydantic import BaseModel, Field
from typing import Optional, List

app = FastAPI(
    title="Course Management API",
    version="1.0.0",
    description="Lecture 5 lab exercise: CRUD operations on courses."
)


class Course(BaseModel):
    id: int
    title: str
    credits: int
    department: str


class CourseCreate(BaseModel):
    # The client does not send an id. The server picks it.
    title: str = Field(min_length=1, examples=["Operating Systems"])
    credits: int = Field(gt=0, le=10, examples=[4])
    department: str = Field(min_length=1, examples=["CSE"])


courses: List[Course] = [
    Course(id=1, title="Backend Development", credits=4, department="CSE"),
    Course(id=2, title="Data Structures", credits=4, department="CSE"),
    Course(id=3, title="Digital Electronics", credits=3, department="ECE"),
    Course(id=4, title="Engineering Mathematics", credits=3, department="MATH"),
]

next_id = 5


@app.get("/courses", response_model=List[Course])
def list_courses(department: Optional[str] = Query(None, description="Filter by department, for example CSE")):
    if department:
        return [c for c in courses if c.department.upper() == department.upper()]
    return courses


@app.get("/courses/{course_id}", response_model=Course)
def get_course(course_id: int):
    for course in courses:
        if course.id == course_id:
            return course
    raise HTTPException(status_code=404, detail="Course not found")


@app.post("/courses", response_model=Course, status_code=201)
def create_course(course: CourseCreate):
    global next_id
    new_course = Course(id=next_id, **course.model_dump())
    courses.append(new_course)
    next_id += 1
    return new_course


@app.put("/courses/{course_id}", response_model=Course)
def update_course(course_id: int, course: CourseCreate):
    for i, existing in enumerate(courses):
        if existing.id == course_id:
            updated = Course(id=course_id, **course.model_dump())
            courses[i] = updated
            return updated
    raise HTTPException(status_code=404, detail="Course not found")


@app.delete("/courses/{course_id}", status_code=204)
def delete_course(course_id: int):
    for i, course in enumerate(courses):
        if course.id == course_id:
            courses.pop(i)
            return
    raise HTTPException(status_code=404, detail="Course not found")


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)
