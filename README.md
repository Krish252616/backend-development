<h1 align="center">Backend Development</h1>

<p align="center">
  Coursework repository &nbsp;|&nbsp; B.Tech CSE &nbsp;|&nbsp; UPES Dehradun
</p>

<p align="center">
  <a href="https://krish252616.github.io/backend-development/"><img src="https://img.shields.io/badge/Live_site-GitHub_Pages-222222?style=flat-square&logo=githubpages&logoColor=white" alt="Live site"></a>
  <a href="https://github.com/Krish252616"><img src="https://img.shields.io/badge/Author-Krish_Pawar-0A66C2?style=flat-square&logo=github&logoColor=white" alt="Author"></a>
  <img src="https://img.shields.io/badge/Lab_experiments-3-2E7D32?style=flat-square" alt="Lab experiments">
  <img src="https://img.shields.io/badge/Theory_projects-7-B45309?style=flat-square" alt="Theory projects">
</p>

<p align="center">
  Lab experiments, theory notes and source code for the Backend Development course.
</p>

---

**Contents:** [Lab experiments](#lab-experiments) · [Theory projects](#theory-projects) · [Repository structure](#repository-structure) · [Running the code](#running-the-code) · [Tech](#tech)

---

## Lab experiments

| # | Experiment | CO | Report | Live output |
|:---:|---|:---:|:---:|:---:|
| **1** | Create a web page with all possible elements of HTML5 | `CO2` | [Report](./LAB/EXP-1/report.md) | [Open page](https://krish252616.github.io/backend-development/LAB/EXP-1/index.html) |
| **13a** | User management with MongoDB and Mongoose | `CO_` | [Report](./LAB/EXP-13a/mongoose-demo/report.md) | [Output](./LAB/EXP-13a/mongoose-demo/report.md#7-output) |
| **Exam** | Simple CMS with Express, EJS and MongoDB | `CO_` | [Report](./LAB/EXP-Examination/report.md) | [Output](./LAB/EXP-Examination/report.md#output) |
| **12a** | 5 tasks | `CO_` | [Report](./LAB/EXP-12a/report.md) | [Output](https://krish252616.github.io/backend-development/LAB/EXP-12a/report.md#Screenshots) |
<!-- Add one row per experiment:
| **14** | Experiment title | `CO_` | [Report](./LAB/EXP-14/report.md) | [Open page](https://krish252616.github.io/backend-development/LAB/EXP-14/index.html) |
-->

---

## Theory projects

| Project | Stack | Source |
|---|---|---|
| **Express demo** | ![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) | [`Theory/Lecture1/express-demo`](https://github.com/Krish252616/backend-development/tree/main/Theory/Lecture1/express-demo) |
| **Sessions** | ![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white) | [`Theory/Sessions`](https://github.com/Krish252616/backend-development/tree/main/Theory/Sessions) |
| **Flask project** | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) ![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white) | [`Theory/Lecture 2/Flask/backend-project`](https://github.com/Krish252616/backend-development/tree/main/Theory/Lecture%202/Flask/backend-project) |
| **FastAPI project** | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) | [`Theory/Lecture 15/FastAPI/fastapi-project`](https://github.com/Krish252616/backend-development/tree/main/Theory/Lecture%2015/FastAPI/fastapi-project) |
| **Student Details (SSR)** | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) ![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white) ![Jinja2](https://img.shields.io/badge/Jinja2-B41717?style=flat-square&logo=jinja&logoColor=white) | [`Theory/Lecture 15/FastAPI/student-details`](https://github.com/Krish252616/backend-development/tree/main/Theory/Lecture%2015/FastAPI/student-details) |
| **Server-side rendering** | ![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white) | [`Theory/ssr-python`](https://github.com/Krish252616/backend-development/tree/main/Theory/ssr-python) |
| **EJS views** | ![Node.js](https://img.shields.io/badge/Node.js-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white) ![EJS](https://img.shields.io/badge/EJS-B4CA65?style=flat-square&logo=ejs&logoColor=black) | [`Theory/views`](https://github.com/Krish252616/backend-development/tree/main/Theory/views) |

> **Dependencies:** [`package.json`](https://github.com/Krish252616/backend-development/blob/main/Theory/package.json) and [`requirements.txt`](https://github.com/Krish252616/backend-development/blob/main/Theory/requirements.txt)

---

## Repository structure

```
backend-development/
│
├── README.md                 this file (also the GitHub Pages homepage)
├── _config.yml               Jekyll settings (excludes Theory/ from the site)
│
├── LAB/
│   ├── EXP-1/                HTML5 page and report
│   ├── EXP-13a/              MongoDB and Mongoose demo
│   └── EXP-Examination/      Simple CMS
│
├── Theory/
│   ├── Lecture1/express-demo/
│   ├── Lecture 2/Flask/backend-project/
│   ├── Lecture 15/FastAPI/
│   ├── Sessions/
│   ├── ssr-python/
│   └── views/
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

### 2. Simple CMS

> Needs MongoDB running.

```bash
brew services start mongodb-community@8.0
cd LAB/EXP-Examination
npm install
npm start
```

### 3. Node projects in Theory

```bash
cd Theory
npm install
node server.js
```

### 4. Python projects in Theory

```bash
cd Theory
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

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