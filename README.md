<h1 align="center">Backend Development</h1>

<p align="center">
  Coursework repository &nbsp;|&nbsp; B.Tech CSE &nbsp;|&nbsp; UPES Dehradun
</p>

<p align="center">
  <a href="https://krish252616.github.io/backend-development/"><img src="https://img.shields.io/badge/Live_site-GitHub_Pages-222222?style=flat-square&logo=githubpages&logoColor=white" alt="Live site"></a>
  <a href="https://github.com/Krish252616"><img src="https://img.shields.io/badge/Author-Krish_Pawar-0A66C2?style=flat-square&logo=github&logoColor=white" alt="Author"></a>
  <img src="https://img.shields.io/badge/Lab_experiments-4-2E7D32?style=flat-square" alt="Lab experiments">
  <img src="https://img.shields.io/badge/Theory_projects-6-B45309?style=flat-square" alt="Theory projects">
  <img src="https://img.shields.io/badge/Assignments-2-6A1B9A?style=flat-square" alt="Assignments">
</p>

<p align="center">
  Lab experiments, theory notes and source code for the Backend Development course.
</p>

---

**Contents:** [Lab experiments](#lab-experiments) · [Theory projects](#theory-projects) · [Assignments](#assignments) · [Repository structure](#repository-structure) · [Running the code](#running-the-code) · [Tech](#tech)

---

## Lab experiments

| # | Experiment | CO | Report | Live output |
|:---:|---|:---:|:---:|:---:|
| **1** | Create a web page with all possible elements of HTML5 | `CO2` | [Report](./LAB/EXP-1/report.md) | [Open page](https://krish252616.github.io/backend-development/LAB/EXP-1/index.html) |
| **12** | Node.js, Express.js and EJS (5 tasks) | `CO_` | [Report](./LAB/EXP-12a/report.md) | [Screenshots](./LAB/EXP-12a/report.md#screenshots) |
| **13a** | User management with MongoDB and Mongoose | `CO_` | [Report](./LAB/EXP-13a/mongoose-demo/report.md) | [Output](./LAB/EXP-13a/mongoose-demo/report.md#7-output) |
| **Exam** | Simple CMS with Express, EJS and MongoDB | `CO_` | [Report](./LAB/EXP-Examination/report.md) | [Output](./LAB/EXP-Examination/report.md#output) |
<!-- Add one row per experiment:
| **14** | Experiment title | `CO_` | [Report](./LAB/EXP-14/report.md) | [Open page](https://krish252616.github.io/backend-development/LAB/EXP-14/index.html) |
-->

---

## Theory projects

Each lecture folder is named after the lecture it belongs to: `Theory/Lecture-03`, `Theory/Lecture-05`, and so on.

| Lecture | Project | Stack | Source |
|:---:|---|---|---|
| **3** | **Express demo** (tasks 1 to 5) | ![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) ![EJS](https://img.shields.io/badge/EJS-B4CA65?style=flat-square&logo=ejs&logoColor=black) | [`Theory/Lecture-03/express-demo`](./Theory/Lecture-03/express-demo) |
| **3** | **Flask demo** | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) ![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white) | [`Theory/Lecture-03/flask-demo`](./Theory/Lecture-03/flask-demo) |
| **5** | **FastAPI CRUD API** | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) | [`Theory/Lecture-05/fastapi-crud`](./Theory/Lecture-05/fastapi-crud) |
| **6** | **Sessions** | ![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) | [`Theory/Lecture-06/sessions`](./Theory/Lecture-06/sessions) |
| **8** | **Student Details (SSR)** | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) ![Jinja2](https://img.shields.io/badge/Jinja2-B41717?style=flat-square&logo=jinja&logoColor=white) | [`Theory/Lecture-08/student-details`](./Theory/Lecture-08/student-details) ([report](./Theory/Lecture-08/student-details/report.md)) |
| **8** | **Server-side rendering with Python** | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) ![Jinja2](https://img.shields.io/badge/Jinja2-B41717?style=flat-square&logo=jinja&logoColor=white) | [`Theory/Lecture-08/ssr-python`](./Theory/Lecture-08/ssr-python) |

> **Python dependencies for all Theory projects:** [`Theory/requirements.txt`](./Theory/requirements.txt). Each Node project has its own `package.json`.

---

## Assignments

| # | Assignment | Topic | Report | Source |
|:---:|---|---|:---:|:---:|
| **01** | Notes app with localStorage | L07: localStorage, sessionStorage and JSON | [Report](./Theory/ASSIGNMENT_1_notes-app/report.md) | [`Theory/ASSIGNMENT_1_notes-app`](./Theory/ASSIGNMENT_1_notes-app) |
| **02** | PostgreSQL as SQL + NoSQL: working with JSONB | Unit 2: Database Management | [Report](./Theory/590017543-assignment2.md) | [`Theory/590017543-assignment2.md`](./Theory/590017543-assignment2.md) |

**Assignment 01:** add, edit, delete and complete notes that stay saved after a refresh, plus search, categories, JSON import and export, dark mode and drag to reorder. Frontend only, no server needed. [Live app](https://krish252616.github.io/backend-development/Theory/ASSIGNMENT_1_notes-app/) · [Screenshots](./Theory/ASSIGNMENT_1_notes-app/report.md#10-screenshots)

**Assignment 02:** a product catalog with fixed columns and one `jsonb` column, JSONB operators (`->`, `->>`, `@>`, `?`), a GIN index compared on 5 and 200,000 rows, and the same queries in MongoDB. [Index results](./Theory/590017543-assignment2.md#task-6-index-and-compare)

---

## Repository structure

```
backend-development/
│
├── index.html                GitHub Pages homepage
├── style.css                 styles for the homepage
├── README.md                 this file
├── _config.yml               Jekyll settings (publishes only the assignments from Theory/)
│
├── LAB/
│   ├── EXP-1/                HTML5 page and report
│   ├── EXP-12a/              Node.js, Express.js and EJS: 5 tasks
│   ├── EXP-13a/              MongoDB and Mongoose demo
│   └── EXP-Examination/      Simple CMS
│
├── Theory/
│   ├── Lecture-03/
│   │   ├── express-demo/     Express tasks 1 to 5
│   │   └── flask-demo/       first Flask app
│   ├── Lecture-05/
│   │   └── fastapi-crud/     REST API with FastAPI
│   ├── Lecture-06/
│   │   └── sessions/         express-session login
│   ├── Lecture-08/
│   │   ├── student-details/  FastAPI + Jinja2 SSR with a form
│   │   └── ssr-python/       FastAPI + Jinja2 hello world
│   ├── ASSIGNMENT_1_notes-app/   Assignment 01: notes app and report
│   ├── 590017543-assignment2.md  Assignment 02: PostgreSQL JSONB
│   └── requirements.txt      Python packages for the Theory projects
│
└── .gitignore
```

---

## Running the code

### 1. HTML experiment

```bash
cd LAB/EXP-1
open index.html          # macOS. On Windows: start index.html
```

### 2. Lab experiments with a server

EXP-13a and the Simple CMS need MongoDB running. EXP-12a does not.

```bash
brew services start mongodb-community@8.0   # only for EXP-13a and the Simple CMS
cd LAB/EXP-Examination                      # or LAB/EXP-12a, LAB/EXP-13a/mongoose-demo
npm install
npm start
```

### 3. Notes app (Assignment 01)

```bash
cd Theory/ASSIGNMENT_1_notes-app
open index.html          # macOS. On Windows: start index.html
```

### 4. Node projects in Theory

```bash
# Lecture 3: Express tasks
cd Theory/Lecture-03/express-demo
npm install
npm run task3            # any of task1 to task5, then open http://localhost:3000

# Lecture 6: sessions
cd Theory/Lecture-06/sessions
npm install
npm start                # then open http://localhost:3000/login
```

### 5. Python projects in Theory

Create one virtual environment in `Theory/` and install everything once:

```bash
cd Theory
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

Then run any project from its own folder:

| Project | Command | Open |
|---|---|---|
| Lecture 3: Flask demo | `cd Lecture-03/flask-demo && python app.py` | http://127.0.0.1:5000 |
| Lecture 5: FastAPI CRUD API | `cd Lecture-05/fastapi-crud && python main.py` | http://127.0.0.1:5000/docs |
| Lecture 8: Student Details | `cd Lecture-08/student-details && uvicorn main:app --reload` | http://127.0.0.1:8000 |
| Lecture 8: SSR with Python | `cd Lecture-08/ssr-python && uvicorn main:app --reload` | http://127.0.0.1:8000 |

On macOS, port 5000 may be taken by AirPlay Receiver. If the Flask demo will not start, turn off AirPlay Receiver in System Settings or run it on another port.

---

## Tech

**Frontend**

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**Node.js stack**

![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black)

**Databases**

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

**Python stack**

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Jinja2](https://img.shields.io/badge/Jinja2-B41717?style=for-the-badge&logo=jinja&logoColor=white)

**Tools**

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

---

<p align="center">
  <sub>Krish Pawar &nbsp;|&nbsp; B.Tech CSE, UPES Dehradun</sub>
</p>
