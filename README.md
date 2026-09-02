# Backend Development

Coursework repository — **B.Tech CSE, UPES Dehradun**

Lab experiments, theory notes and source code for the Backend Development course.

**Author:** Krish Pawar
**Live site:** https://krish252616.github.io/backend-development/

----

## Lab experiments

| # | Experiment | CO | Report | Live output |
|---|---|---|---|---|
| 1 | Create a web page with all possible elements of HTML5 | CO2 | [Report](./LAB/EXP-1/report.md) | [Open page](https://krish252616.github.io/backend-development/LAB/EXP-1/index.html) |

<!-- Add one row per experiment:
| 2 | Experiment title | CO_ | [Report](./LAB/EXP-2/report.md) | [Open page](https://krish252616.github.io/backend-development/LAB/EXP-2/index.html) |
-->

---

## Theory — projects

| Project | Stack | Source |
|---|---|---|
| Express demo | Node.js · Express | [`Theory/Lecture1/express-demo`](./Theory/Lecture1/express-demo) |
| Sessions | Node.js · Express | [`Theory/Sessions`](./Theory/Sessions) |
| Flask project | Python · Flask | [`Theory/Flask/backend-project`](./Theory/Flask/backend-project) |
| FastAPI project | Python · FastAPI | [`Theory/FastAPI/fastapi-project`](./Theory/FastAPI/fastapi-project) |
| Server-side rendering | Python | [`Theory/ssr-python`](./Theory/ssr-python) |
| EJS views | Node.js · EJS | [`Theory/views`](./Theory/views) |

Dependencies: [`package.json`](./Theory/package.json) · [`requirements.txt`](./Theory/requirements.txt)

---

## Repository structure

```
backend-development/
├── index.md               ← GitHub Pages homepage
├── README.md              ← this file (GitHub view)
├── LAB/
│   └── EXP-1/
│       ├── index.html     ← the experiment output
│       └── report.md      ← the lab report
├── Theory/
│   ├── FastAPI/fastapi-project/
│   ├── Flask/backend-project/
│   ├── Lecture1/express-demo/
│   ├── Sessions/
│   ├── ssr-python/
│   ├── views/
│   ├── package.json
│   ├── requirements.txt
│   └── server.js
└── .gitignore
```

---

## Running the code

**Lab experiment**

```bash
cd LAB/EXP-1
open index.html          # macOS  ·  use  start index.html  on Windows
```

**Node projects**

```bash
cd Theory
npm install
node server.js
```

**Python projects**

```bash
cd Theory
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

---

## Tech

`HTML5` · `CSS3` · `JavaScript (ES6)` · `Node.js` · `Express` · `EJS` · `Python` · `Flask` · `FastAPI` · `Git`
