# Backend Development

Coursework repository, B.Tech CSE, UPES Dehradun.

Lab experiments, theory notes and source code for the Backend Development course.

**Author:** Krish Pawar
**Live site:** https://krish252616.github.io/backend-development/

---

## Lab experiments

| # | Experiment | CO | Report | Live output |
|---|---|---|---|---|
| 1 | Create a web page with all possible elements of HTML5 | CO2 | [Report](./LAB/EXP-1/report.md) | [Open page](https://krish252616.github.io/backend-development/LAB/EXP-1/index.html) |
| 13a | User management with MongoDB and Mongoose | CO_ | [Report](./LAB/EXP-13a/mongoose-demo/report.md) | [Output](./LAB/EXP-13a/mongoose-demo/report.md#7-output) |
| Exam | Simple CMS with Express, EJS and MongoDB | CO_ | [Report](./LAB/EXP-Examination/report.md) | [Output](./LAB/EXP-Examination/report.md#output) |

<!-- Add one row per experiment:
| 14 | Experiment title | CO_ | [Report](./LAB/EXP-14/report.md) | [Open page](https://krish252616.github.io/backend-development/LAB/EXP-14/index.html) |
-->

---

## Theory projects

| Project | Stack | Source |
|---|---|---|
| Express demo | Node.js, Express | [`Theory/Lecture1/express-demo`](https://github.com/Krish252616/backend-development/tree/main/Theory/Lecture1/express-demo) |
| Sessions | Node.js, Express | [`Theory/Sessions`](https://github.com/Krish252616/backend-development/tree/main/Theory/Sessions) |
| Flask project | Python, Flask | [`Theory/Lecture 2/Flask/backend-project`](https://github.com/Krish252616/backend-development/tree/main/Theory/Lecture%202/Flask/backend-project) |
| FastAPI project | Python, FastAPI | [`Theory/Lecture 15/FastAPI/fastapi-project`](https://github.com/Krish252616/backend-development/tree/main/Theory/Lecture%2015/FastAPI/fastapi-project) |
| Student Details (SSR) | Python, FastAPI, Jinja2 | [`Theory/Lecture 15/FastAPI/student-details`](https://github.com/Krish252616/backend-development/tree/main/Theory/Lecture%2015/FastAPI/student-details) |
| Server-side rendering | Python | [`Theory/ssr-python`](https://github.com/Krish252616/backend-development/tree/main/Theory/ssr-python) |
| EJS views | Node.js, EJS | [`Theory/views`](https://github.com/Krish252616/backend-development/tree/main/Theory/views) |

Dependencies: [`package.json`](https://github.com/Krish252616/backend-development/blob/main/Theory/package.json) and [`requirements.txt`](https://github.com/Krish252616/backend-development/blob/main/Theory/requirements.txt)

---

## Repository structure

```
backend-development/
├── README.md              this file (also the GitHub Pages homepage)
├── _config.yml            Jekyll settings (excludes Theory/ from the site)
├── LAB/
│   ├── EXP-1/             HTML5 page and report
│   ├── EXP-13a/           MongoDB and Mongoose demo
│   └── EXP-Examination/   Simple CMS
├── Theory/
│   ├── Lecture1/express-demo/
│   ├── Lecture 2/Flask/backend-project/
│   ├── Lecture 15/FastAPI/
│   ├── Sessions/
│   ├── ssr-python/
│   └── views/
└── .gitignore
```

---

## Running the code

**HTML experiment**

```bash
cd LAB/EXP-1
open index.html          # macOS. On Windows: start index.html
```

**Simple CMS (needs MongoDB running)**

```bash
brew services start mongodb-community@8.0
cd LAB/EXP-Examination
npm install
npm start
```

**Node projects in Theory**

```bash
cd Theory
npm install
node server.js
```

**Python projects in Theory**

```bash
cd Theory
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

---

## Tech

`HTML5` `CSS3` `JavaScript` `Node.js` `Express` `EJS` `MongoDB` `Python` `Flask` `FastAPI` `Jinja2` `Git`
