# Lecture 3, Lab Exercise 4
# Task 7 (Flask students API) plus a POST /students route that adds a student.

from flask import Flask, jsonify, request

app = Flask(__name__)

students = [
    {"id": 1, "name": "Aarav", "branch": "CSE"},
    {"id": 2, "name": "Diya", "branch": "ECE"},
    {"id": 3, "name": "Rohan", "branch": "IT"}
]


@app.route("/")
def home():
    return "Student Management API"


@app.route("/students", methods=["GET"])
def get_students():
    return jsonify(students)


@app.route("/students", methods=["POST"])
def add_student():
    # silent=True returns None instead of raising an error when the body
    # is missing or is not valid JSON, so we can send our own 400 message.
    data = request.get_json(silent=True)
    if not data or not str(data.get("name", "")).strip() or not str(data.get("branch", "")).strip():
        return jsonify({"error": "name and branch are required"}), 400

    # The server chooses the id: one more than the largest id so far.
    new_id = max((s["id"] for s in students), default=0) + 1
    new_student = {
        "id": new_id,
        "name": str(data["name"]).strip(),
        "branch": str(data["branch"]).strip(),
    }
    students.append(new_student)
    return jsonify(new_student), 201


@app.route("/students/<int:student_id>")
def get_student(student_id):
    student = next((s for s in students if s["id"] == student_id), None)
    if student:
        return jsonify(student)
    else:
        return jsonify({"error": "Student not found"}), 404


if __name__ == "__main__":
    app.run(debug=True)
