<div align="center">

# ⚡ Backend Development

### B.Tech CSE · UPES Dehradun

**A collection of lab experiments, theory projects, backend implementations, and course work.**

<br>

[![Live Site](https://img.shields.io/badge/🌐%20Live%20Site-Visit%20Website-ff7a00?style=for-the-badge)](https://krish252616.github.io/backend-development/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/Krish252616/backend-development)

<br><br>

<table>
<tr>
<td align="center"><strong>🧪 Labs</strong><br>Experiments & Reports</td>
<td align="center"><strong>⚙️ Backend</strong><br>Projects & APIs</td>
<td align="center"><strong>📚 Theory</strong><br>Notes & Coursework</td>
</tr>
</table>

<br>

**Author:** Krish Pawar

</div>

---

## 🧭 Overview

> **Backend Development coursework — built, documented, and organized in one place.**

This repository contains the **lab experiments, theory notes and source code** for the Backend Development course.

<div align="center">

### 🛠️ Technology Landscape

`HTML5` · `CSS3` · `JavaScript` · `Node.js` · `Express` · `EJS`  
`MongoDB` · `Python` · `Flask` · `FastAPI` · `Jinja2` · `Git`

</div>

---

# 🧪 Lab Experiments

> Practical implementations and reports completed as part of the course.

| # | Experiment | CO | Report | Live Output |
|:---:|---|:---:|:---:|:---:|
| **01** | 🌐 Create a web page with all possible elements of HTML5 | `CO2` | [📄 Report](./LAB/EXP-1/report.md) | [🚀 Open page](https://krish252616.github.io/backend-development/LAB/EXP-1/index.html) |
| **13a** | 🗄️ User management with MongoDB and Mongoose | `CO_` | [📄 Report](./LAB/EXP-13a/mongoose-demo/report.md) | [👁️ Output](./LAB/EXP-13a/mongoose-demo/report.md#7-output) |
| **Exam** | 🧩 Simple CMS with Express, EJS and MongoDB | `CO_` | [📄 Report](./LAB/EXP-Examination/report.md) | [👁️ Output](./LAB/EXP-Examination/report.md#output) |

<details>
<summary><strong>➕ Add another experiment</strong></summary>

```md
| 14 | Experiment title | CO_ | [Report](./LAB/EXP-14/report.md) | [Open page](https://krish252616.github.io/backend-development/LAB/EXP-14/index.html) |
```

</details>

---

# ⚙️ Theory Projects

> Backend technologies explored through individual projects and implementations.

<table>
<thead>
<tr>
<th>Project</th>
<th>Stack</th>
<th>Source</th>
</tr>
</thead>
<tbody>
<tr>
<td>🚂 <strong>Express demo</strong></td>
<td><code>Node.js</code> · <code>Express</code></td>
<td><a href="https://github.com/Krish252616/backend-development/tree/main/Theory/Lecture1/express-demo">View source ↗</a></td>
</tr>
<tr>
<td>🔐 <strong>Sessions</strong></td>
<td><code>Node.js</code> · <code>Express</code></td>
<td><a href="https://github.com/Krish252616/backend-development/tree/main/Theory/Sessions">View source ↗</a></td>
</tr>
<tr>
<td>🐍 <strong>Flask project</strong></td>
<td><code>Python</code> · <code>Flask</code></td>
<td><a href="https://github.com/Krish252616/backend-development/tree/main/Theory/Lecture%202/Flask/backend-project">View source ↗</a></td>
</tr>
<tr>
<td>⚡ <strong>FastAPI project</strong></td>
<td><code>Python</code> · <code>FastAPI</code></td>
<td><a href="https://github.com/Krish252616/backend-development/tree/main/Theory/Lecture%2015/FastAPI/fastapi-project">View source ↗</a></td>
</tr>
<tr>
<td>🎓 <strong>Student Details (SSR)</strong></td>
<td><code>Python</code> · <code>FastAPI</code> · <code>Jinja2</code></td>
<td><a href="https://github.com/Krish252616/backend-development/tree/main/Theory/Lecture%2015/FastAPI/student-details">View source ↗</a></td>
</tr>
<tr>
<td>🖥️ <strong>Server-side rendering</strong></td>
<td><code>Python</code></td>
<td><a href="https://github.com/Krish252616/backend-development/tree/main/Theory/ssr-python">View source ↗</a></td>
</tr>
<tr>
<td>🎨 <strong>EJS views</strong></td>
<td><code>Node.js</code> · <code>EJS</code></td>
<td><a href="https://github.com/Krish252616/backend-development/tree/main/Theory/views">View source ↗</a></td>
</tr>
</tbody>
</table>

### 📦 Dependencies

| File | Purpose |
|---|---|
| [`package.json`](https://github.com/Krish252616/backend-development/blob/main/Theory/package.json) | Node.js dependencies |
| [`requirements.txt`](https://github.com/Krish252616/backend-development/blob/main/Theory/requirements.txt) | Python dependencies |

---

# 🗂️ Repository Structure

```text
backend-development/
│
├── 📄 README.md              this file (also the GitHub Pages homepage)
├── ⚙️ _config.yml            Jekyll settings (excludes Theory/ from the site)
│
├── 🧪 LAB/
│   ├── EXP-1/                HTML5 page and report
│   ├── EXP-13a/              MongoDB and Mongoose demo
│   └── EXP-Examination/      Simple CMS
│
├── 📚 Theory/
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

# ▶️ Running the Code

<details open>
<summary><strong>🌐 HTML Experiment</strong></summary>

<br>

```bash
cd LAB/EXP-1
open index.html          # macOS. On Windows: start index.html
```

</details>

<details>
<summary><strong>🧩 Simple CMS · MongoDB</strong></summary>

<br>

**Needs MongoDB running**

```bash
brew services start mongodb-community@8.0
cd LAB/EXP-Examination
npm install
npm start
```

</details>

<details>
<summary><strong>🟢 Node Projects in Theory</strong></summary>

<br>

```bash
cd Theory
npm install
node server.js
```

</details>

<details>
<summary><strong>🐍 Python Projects in Theory</strong></summary>

<br>

```bash
cd Theory
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
```

</details>

---

# 🧰 Tech

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-B4CA65?style=flat-square&logo=ejs&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Jinja2](https://img.shields.io/badge/Jinja2-B41717?style=flat-square&logo=jinja&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white)

<br><br>

### 🌐 Explore the live site

[![Open GitHub Pages](https://img.shields.io/badge/OPEN%20GITHUB%20PAGES-ff7a00?style=for-the-badge&logo=github)](https://krish252616.github.io/backend-development/)

</div>

---

<div align="center">

### ⚡ Backend Development

**Built as coursework · Documented for reference · Organized for exploration**

<br>

<sub>Krish Pawar · B.Tech CSE · UPES Dehradun</sub>

</div>
