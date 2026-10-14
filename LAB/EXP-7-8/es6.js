// Experiment 07 & 08, Part A: ES6 features (sections 3.1 to 3.10)
//
// Each feature runs inside its own function. The lab sheet's snippets declare
// `add`, `name` and `age` more than once, so pasting them into one file gives
// "SyntaxError: Identifier 'add' has already been declared". A function per
// demo gives each one its own scope.
//
// The page shows the code of each demo (taken from the function itself with
// toString(), so it is exactly what ran) and what log() printed.

"use strict";

const demos = [];
const demo = (id, title, fn) => demos.push({ id, title, fn });

// Turn a value into text the way the console shows it
const show = (value) => {
    if (typeof value === "string") return value;
    if (typeof value === "function") return `[function ${value.name}]`;
    if (value instanceof Error) return `${value.name}: ${value.message}`;
    try { return JSON.stringify(value); } catch { return String(value); }
};

// ---------------------------------------------------------------- 3.1
demo("3-1", "3.1 let and const", (log) => {
    var x = 10;
    var x = 20;                      // var can be redeclared
    log("x =", x);

    let y = 10;
    try {
        new Function("let y = 10; let y = 20;");  // same code, checked by the parser
    } catch (error) {
        log("let y twice ->", error);
    }

    const z = 30;
    try {
        z = 40;                      // const cannot be reassigned
    } catch (error) {
        log("z = 40 ->", error);
    }

    if (true) {
        let blockVar = "inside";
        var funcVar = "outside";
    }
    log("typeof blockVar outside the block:", typeof blockVar);
    log("funcVar outside the block:", funcVar);
});

// ---------------------------------------------------------------- 3.2
demo("3-2", "3.2 Arrow functions", (log) => {
    const add = (a, b) => a + b;
    const square = x => x * x;
    const greet = () => "Hello!";
    const multiply = (a, b) => {
        const result = a * b;
        return result;
    };
    log("add(3, 4) =", add(3, 4));
    log("square(5) =", square(5));
    log("greet() =", greet());
    log("multiply(6, 7) =", multiply(6, 7));

    // Arrow functions take `this` from the code around them
    const counter = {
        count: 5,
        regular() { return [1].map(function () { return this; })[0]; },
        arrow()   { return [1].map(() => this.count)[0]; }
    };
    log("this inside a regular callback:", String(counter.regular()));
    log("this.count inside an arrow callback:", counter.arrow());
});

// ---------------------------------------------------------------- 3.3
demo("3-3", "3.3 Template literals", (log) => {
    const name = "Alice";
    const age = 25;
    const msg1 = "Hello, " + name + "! You are " + age + " years old.";
    const msg2 = `Hello, ${name}! You are ${age} years old.`;
    log(msg1);
    log(msg2);
    log("Same text:", msg1 === msg2);

    const html = `<div>
    <h1>${name}</h1>
    <p>Age: ${age}</p>
</div>`;
    log(html);
    log(`Sum: ${5 + 3}`);
    log(`Upper: ${name.toUpperCase()}`);
});

// ---------------------------------------------------------------- 3.4
demo("3-4", "3.4 Destructuring", (log) => {
    const colors = ["red", "green", "blue"];
    const [first, second, third] = colors;
    log("first:", first, "| second:", second, "| third:", third);

    const [, , thirdColor] = colors;
    log("thirdColor:", thirdColor);

    const person = { name: "Bob", age: 30, city: "Mumbai" };
    const { name, age } = person;
    log("name:", name, "| age:", age);

    const { name: fullName } = person;
    log("fullName:", fullName);

    const { country = "India" } = person;
    log("country (default):", country);
});

// ---------------------------------------------------------------- 3.5
demo("3-5", "3.5 Spread and rest (...)", (log) => {
    const arr1 = [1, 2, 3];
    const arr2 = [4, 5, 6];
    const combined = [...arr1, ...arr2];
    log("combined:", combined);

    const copy = [...arr1];
    copy.push(99);
    log("copy:", copy, "| arr1 unchanged:", arr1);

    const obj1 = { a: 1, b: 2 };
    const obj2 = { ...obj1, c: 3 };
    log("obj2:", obj2);

    function sum(...numbers) {
        return numbers.reduce((total, n) => total + n, 0);
    }
    log("sum(1, 2, 3, 4) =", sum(1, 2, 3, 4));

    const [head, ...tail] = [10, 20, 30, 40];
    log("head:", head, "| tail:", tail);
});

// ---------------------------------------------------------------- 3.6
demo("3-6", "3.6 Default parameters", (log) => {
    function greet(name = "Guest", greeting = "Hello") {
        return `${greeting}, ${name}!`;
    }
    log(greet());
    log(greet("Alice"));
    log(greet("Bob", "Hi"));
    log(greet(undefined, "Welcome"));   // undefined uses the default
    log(greet(null));                   // null does NOT use the default
});

// ---------------------------------------------------------------- 3.7
demo("3-7", "3.7 Classes", (log) => {
    class Animal {
        constructor(name, sound) {
            this.name = name;
            this.sound = sound;
        }
        speak() {
            return `${this.name} says ${this.sound}`;
        }
        static info() {
            return "Animals are living beings.";
        }
    }

    class Dog extends Animal {
        constructor(name) {
            super(name, "Woof");
        }
        fetch() {
            return `${this.name} is fetching the ball.`;
        }
    }

    const dog = new Dog("Rex");
    log(dog.speak());
    log(dog.fetch());
    log(Animal.info());
    log("dog instanceof Animal:", dog instanceof Animal);
    log("typeof Animal:", typeof Animal);
});

// ---------------------------------------------------------------- 3.9
demo("3-9", "3.9 Promises and async/await", (log) => {
    const fetchData = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve("Data loaded"), 1000);
        });
    };

    log("Started at 0 ms. Waiting...");
    const start = performance.now();

    fetchData().then(data => log(`.then(): ${data} after ${Math.round(performance.now() - start)} ms`));

    async function loadData() {
        try {
            const data = await fetchData();
            log(`await: ${data} after ${Math.round(performance.now() - start)} ms`);
        } catch (error) {
            log("Error:", error);
        }
    }
    loadData();

    const failing = () => new Promise((resolve, reject) => setTimeout(() => reject(new Error("Server not reachable")), 1200));
    (async () => {
        try {
            await failing();
        } catch (error) {
            log("catch after a rejected promise ->", error);
        }
    })();
});

// ---------------------------------------------------------------- 3.10
demo("3-10", "3.10 Enhanced object literals", (log) => {
    const name = "Alice";
    const age = 25;
    const person = { name, age };
    log("person:", person);

    const calculator = {
        add(a, b) { return a + b; },
        subtract(a, b) { return a - b; }
    };
    log("calculator.add(2, 3) =", calculator.add(2, 3), "| subtract(9, 4) =", calculator.subtract(9, 4));

    const key = "dynamicKey";
    const obj = { [key]: "value" };
    log("obj:", obj, "| obj.dynamicKey =", obj.dynamicKey);
});

// ---------------------------------------------------------------- render
// Build one card per demo: the code that ran, then its output.
const container = document.getElementById("demos");

demos.forEach(({ id, title, fn }) => {
    const card = document.createElement("section");
    card.className = "card";
    card.id = `demo-${id}`;

    const h2 = document.createElement("h2");
    h2.textContent = title;

    // The function's own source, without the first and last line (the wrapper)
    const lines = fn.toString().split("\n").slice(1, -1);
    const indent = Math.min(...lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length));
    const code = document.createElement("pre");
    code.textContent = lines.map(l => l.slice(indent)).join("\n");

    const label = document.createElement("p");
    label.className = "hint";
    label.textContent = "Output:";

    const out = document.createElement("pre");
    out.className = "out";

    card.append(h2, code, label, out);
    container.appendChild(card);

    const log = (...args) => {
        console.log(`[${title}]`, ...args);
        out.textContent += (out.textContent ? "\n" : "") + args.map(show).join(" ");
    };

    try {
        fn(log);
    } catch (error) {
        log("Uncaught:", error);
    }
});

// 3.8 (modules) is written in es6.html because it needs <script type="module">.
// Move its card between 3.7 and 3.9 so the sections stay in order.
document.getElementById("demo-3-9").before(document.getElementById("demo-3-8"));
