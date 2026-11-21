---
title: "Experiment 13: Installation of MongoDB, Mongoose connection and CRUD"
layout: default
---

# Experiment 13: Installation of MongoDB, Mongoose connection and CRUD

**Course:** Backend Development Lab  
**Student:** Krish Pawar · B.Tech CSE · SAP ID 590017543 · UPES Dehradun  
**Date:** 21 November 2026

**Source:** [`LAB/EXP-13` on GitHub](https://github.com/Krish252616/backend-development/tree/main/LAB/EXP-13) · [`mongoose-basics/`](https://github.com/Krish252616/backend-development/tree/main/LAB/EXP-13/mongoose-basics) · [`shell/`](https://github.com/Krish252616/backend-development/tree/main/LAB/EXP-13/shell)

The next experiment, [13a: user management with MongoDB and Mongoose](../EXP-13a/mongoose-demo/report.md), builds an Express app on top of this setup.

---

## 1. Aim

To install MongoDB, connect to it with the MongoDB Shell (`mongosh`) and from Node.js with Mongoose, and run create, read, update and delete operations, queries with operators, sorting, limiting and projection. Then to turn on authentication and check what each kind of user is allowed to do.

## 2. Objectives

1. Install the MongoDB server (`mongod`), the shell (`mongosh`) and the database tools.
2. Start the server and connect to it.
3. Run the sheet's shell commands: `show dbs`, `use`, `insertOne`, `insertMany`, `find`, `updateOne`, `deleteOne`, `createIndex`.
4. Connect from Node.js with Mongoose, define a schema and a model, and run CRUD.
5. Use query operators (`$gt`, `$gte`, `$lt`, `$or`), `sort`, `limit` and projection.
6. Enable authentication, create users with roles and test their permissions.
7. Back up and export data with `mongodump` and `mongoexport`.

## 3. Tools and versions used

| Tool | Version | What it is |
|---|---|---|
| `mongod` | 8.0.23 | The database server |
| `mongosh` | 2.14.3 | The interactive JavaScript shell |
| `mongodump`, `mongoexport` | 100.13.0 | Database tools for backup and export |
| Node.js | 22.23 | Runs the Mongoose programs |
| Mongoose | 9.12.3 (MongoDB Node.js driver 7.8.0 inside) | ODM library for Node.js |

These are the versions the outputs below come from. The test machine runs Ubuntu 24.04, where MongoDB was installed from the conda-forge package archive because the test machine cannot reach the MongoDB download servers. On a normal computer, use the official installers in section 5. Commands, outputs and behaviour are the same.

## 4. Theory

### 4.1 MongoDB in one table

| SQL | MongoDB | Example here |
|---|---|---|
| Database | Database | `schoolDB`, `mydatabase` |
| Table | Collection | `students`, `users` |
| Row | Document (JSON-like, stored as BSON) | `{ name: "Alice", age: 22 }` |
| Column | Field | `name`, `marks` |
| Fixed schema | Flexible: each document can have different fields | Mongoose adds a schema in the application |
| Primary key | `_id`, added automatically (an `ObjectId`) | `ObjectId('6b0143521ee1d839e91f8528')` |

> **Note on the lab sheet.** The comparison table lists MongoDB transactions as "eventual consistency". By default MongoDB reads and writes go to the primary server and are strongly consistent. A single-document write is always atomic, and multi-document ACID transactions exist since MongoDB 4.0. "Eventual" only applies when you choose to read from secondary servers.

### 4.2 The three programs

| Program | Job |
|---|---|
| `mongod` | The server. Stores the data and listens on port **27017** |
| `mongosh` | A client: type commands, see results |
| MongoDB Compass | A graphical client: browse collections, edit documents, run queries with a form |

Mongoose is a fourth client, inside a Node.js program. All clients talk to the same `mongod`.

### 4.3 Mongoose: schema, model, collection

```javascript
const studentSchema = new mongoose.Schema({ name: String, age: Number, course: String, marks: Number });
const Student = mongoose.model('Student', studentSchema);   // collection: "students"
```

The schema describes the fields and their rules. The model is the class used to query the collection. The collection name is the model name in lower case and plural: `Student` becomes `students` (confirmed in the output of section 7.4).

## 5. Installation

### 5.1 macOS (Homebrew)

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community     # starts mongod now and at every login
mongosh                                   # connect (mongosh is installed with it)
```

| Item | Apple silicon (M1 to M4) | Intel Mac |
|---|---|---|
| Data folder | `/opt/homebrew/var/mongodb` | `/usr/local/var/mongodb` |
| Config file | `/opt/homebrew/etc/mongod.conf` | `/usr/local/etc/mongod.conf` |
| Log file | `/opt/homebrew/var/log/mongodb/mongo.log` | `/usr/local/var/log/mongodb/mongo.log` |
| Stop the server | `brew services stop mongodb-community` | Same |
| Is it running? | `brew services list` | Same |

### 5.2 Windows

1. Download the `.msi` from the MongoDB Community Server download page and run it. Choose **Complete** and keep **Install MongoD as a Service** ticked: the server then starts with Windows.
2. `mongosh` is **not** included. Download it separately (a `.msi` or a `.zip`). With the `.zip`, add its `bin` folder to the system `PATH`.
3. Open a **new** Command Prompt or PowerShell (old windows do not see the new `PATH`) and run `mongosh`.

| Item | Windows |
|---|---|
| Data folder | `C:\Program Files\MongoDB\Server\8.0\data` |
| Config file | `C:\Program Files\MongoDB\Server\8.0\bin\mongod.cfg` |
| Start or stop the server | `net start MongoDB` / `net stop MongoDB` (as Administrator), or the Services app |

### 5.3 Ubuntu

The sheet's main commands (MongoDB 8.0 for Ubuntu 24.04 "noble") are correct. Two notes:

| Note | Detail |
|---|---|
| `daemon-reload` order | The sheet runs `systemctl start mongod` and then `daemon-reload`. If `start` fails with "Unit mongod.service not found", run `sudo systemctl daemon-reload` first, then start |
| The "Optional Read" section | It installs **MongoDB 7.0 for Ubuntu 22.04 "jammy"** with `apt-key add`. That is a different version from the main section, and `apt-key` is deprecated on current Ubuntu. Use only one of the two sets of instructions, the main one |

### 5.4 MongoDB Compass

Compass is installed from its own download page on every system. Connect with `mongodb://127.0.0.1:27017`. After authentication is turned on (section 7.6), add the user in the connection string, for example `mongodb://myuser:PASSWORD@127.0.0.1:27017/mydatabase?authSource=mydatabase`. Compass is a desktop program, so it is not part of the test runs below.

## 6. Files

| File | What it is |
|---|---|
| `shell/session.txt` | The sheet's shell commands, typed in the interactive shell (output in 7.2) |
| `shell/basics.mongosh.js` | The same commands as a script: `mongosh --file shell/basics.mongosh.js` (output in 7.3) |
| `shell/create-users.txt` | The sheet's `createUser` commands for authentication |
| `config/mongod.conf` | The configuration for the authentication test (`security.authorization: enabled`), with Ubuntu default paths |
| `mongoose-basics/db.js` | `connectDB` and `disconnectDB` (sheet sections 5 and 8) |
| `mongoose-basics/studentModel.js` | Schema and model (section 7) |
| `mongoose-basics/crud.js` | Create, read, update, delete (section 9): `npm run crud` |
| `mongoose-basics/queries.js` | Operators, sort, limit, projection (sections 10 and 11): `npm run queries` |

## 7. Output

### 7.1 Server and tools installed

```text
$ mongod --version
db version v8.0.23

$ mongosh --version
2.14.3

$ mongodump --version
mongodump version: 100.13.0
```

### 7.2 The sheet's shell commands, typed in `mongosh`

`show dbs` at the start has no `mydatabase`. `use mydatabase` only switches to it. It appears in `show dbs` after the first document is inserted:

```text
test> show dbs
admin     40.00 KiB
config    12.00 KiB
local     40.00 KiB
schoolDB   8.00 KiB
test> use mydatabase
switched to db mydatabase
mydatabase> db.users.insertOne({ name: "John Doe", age: 30, email: "john@example.com" })
{
  acknowledged: true,
  insertedId: ObjectId('6b0143521ee1d839e91f8528')
}
mydatabase> show dbs
admin       40.00 KiB
config      12.00 KiB
local       40.00 KiB
mydatabase   8.00 KiB
schoolDB     8.00 KiB
mydatabase> db.users.insertMany([
  { name: "Jane Smith", age: 25, email: "jane@example.com" },
  { name: "Bob Johnson", age: 35, email: "bob@example.com" }
])
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('6b0143521ee1d839e91f8529'),
    '1': ObjectId('6b0143521ee1d839e91f852a')
  }
}
mydatabase> db.users.find({ age: { $gt: 25 } })
[
  {
    _id: ObjectId('6b0143521ee1d839e91f8528'),
    name: 'John Doe',
    age: 30,
    email: 'john@example.com'
  },
  {
    _id: ObjectId('6b0143521ee1d839e91f852a'),
    name: 'Bob Johnson',
    age: 35,
    email: 'bob@example.com'
  }
]
mydatabase> db.users.updateOne({ name: "John Doe" }, { $set: { age: 31 } })
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
mydatabase> db.users.deleteOne({ name: "Bob Johnson" })
{ acknowledged: true, deletedCount: 1 }
mydatabase> db.users.createIndex({ email: 1 })
email_1
mydatabase> db.users.getIndexes()
[
  { v: 2, key: { _id: 1 }, name: '_id_' },
  { v: 2, key: { email: 1 }, name: 'email_1' }
]
mydatabase> db.users.find({}, { _id: 0, name: 1, age: 1 })
[ { name: 'John Doe', age: 31 }, { name: 'Jane Smith', age: 25 } ]
```

(`db.users.find()` with no filter printed all three users. It is left out above only to keep the listing short.)

### 7.3 The same commands as a script file

```text
$ mongosh --quiet --file shell/basics.mongosh.js
Databases: admin, config, local, schoolDB
After insert, databases: admin, config, local, mydatabase, schoolDB
...
Index created: email_1

Final users:
[
  { name: 'John Doe', age: 31 },
  { name: 'Jane Smith', age: 25 }
]
```

A script file cannot use `use mydatabase` or `show dbs` (section 8.3), so it uses `db.getSiblingDB("mydatabase")` and `db.adminCommand({ listDatabases: 1 })`.

### 7.4 Mongoose CRUD: `npm run crud`

```text
$ npm run crud
Database connected: 127.0.0.1:27017/schoolDB
Collection used by the model: students

(1) Create
Student added! {
  name: 'Alice',
  age: 22,
  course: 'B.Tech',
  marks: 88,
  _id: new ObjectId('6b014346be6078cf9bb06153'),
  __v: 0
}

(2) Read
find(): [
  {
    _id: new ObjectId('6b014346be6078cf9bb06153'),
    name: 'Alice',
    age: 22,
    course: 'B.Tech',
    marks: 88,
    __v: 0
  }
]
findOne({ name: "Alice" }): {
  _id: new ObjectId('6b014346be6078cf9bb06153'),
  name: 'Alice',
  age: 22,
  course: 'B.Tech',
  marks: 88,
  __v: 0
}

(3) Update
Record updated { matchedCount: 1, modifiedCount: 1 }
Marks now: 92

(4) Delete
Record deleted { deletedCount: 1 }
Students left: 0

Validation
ValidationError: Path `name` is required. | Path `marks` (150) is more than maximum allowed value (100).
Database disconnected
```

`__v` is Mongoose's version key, added to every document it saves. The validation step tried to save a student with no name and 150 marks: the schema's `required` and `max: 100` rules stopped it before it reached the database.

### 7.5 Queries: `npm run queries`

Eight students were inserted, then each query from sections 10 and 11 of the sheet was run:

```text
marks > 80:  find({ marks: { $gt: 80 } })
┌─────────┬──────────┬─────┬────────┬───────┐
│ (index) │ name     │ age │ course │ marks │
├─────────┼──────────┼─────┼────────┼───────┤
│ 0       │ 'Aarav'  │ 20  │ 'CS'   │ 91    │
│ 1       │ 'Priya'  │ 22  │ 'CS'   │ 85    │
│ 2       │ 'Ananya' │ 20  │ 'CS'   │ 96    │
└─────────┴──────────┴─────┴────────┴───────┘

IT OR marks < 50:  find({ $or: [{ course: "IT" }, { marks: { $lt: 50 } }] })
┌─────────┬──────────┬─────┬────────┬───────┐
│ (index) │ name     │ age │ course │ marks │
├─────────┼──────────┼─────┼────────┼───────┤
│ 0       │ 'Diya'   │ 21  │ 'IT'   │ 78    │
│ 1       │ 'Kabir'  │ 20  │ 'IT'   │ 45    │
│ 2       │ 'Ishaan' │ 21  │ 'ECE'  │ 49    │
└─────────┴──────────┴─────┴────────┴───────┘

Top 5:  find().sort({ marks: -1 }).limit(5)
┌─────────┬──────────┬─────┬────────┬───────┐
│ (index) │ name     │ age │ course │ marks │
├─────────┼──────────┼─────┼────────┼───────┤
│ 0       │ 'Ananya' │ 20  │ 'CS'   │ 96    │
│ 1       │ 'Aarav'  │ 20  │ 'CS'   │ 91    │
│ 2       │ 'Priya'  │ 22  │ 'CS'   │ 85    │
│ 3       │ 'Diya'   │ 21  │ 'IT'   │ 78    │
│ 4       │ 'Rohan'  │ 19  │ 'CS'   │ 74    │
└─────────┴──────────┴─────┴────────┴───────┘

Projection:  find({}, { name: 1, course: 1, _id: 0 })
[
  { name: 'Aarav', course: 'CS' },
  { name: 'Diya', course: 'IT' },
  { name: 'Rohan', course: 'CS' },
  { name: 'Priya', course: 'CS' },
  { name: 'Kabir', course: 'IT' },
  { name: 'Meera', course: 'ECE' },
  { name: 'Ishaan', course: 'ECE' },
  { name: 'Ananya', course: 'CS' }
]
```

The "CS AND marks >= 75" query returned Aarav, Priya and Ananya (Rohan is CS but has 74). The full sorted list went from Ananya (96) down to Kabir (45). Each condition was checked against the data: for example `$or` returned the two IT students plus Ishaan, who is ECE but has 49.

### 7.6 Authentication

The users from the sheet were created (`shell/create-users.txt`), plus `schoolapp` for the Mongoose program:

| User | Created in | Role | Meant for |
|---|---|---|---|
| `adminUser` | `admin` | `userAdminAnyDatabase` | Sheet section 6 |
| `admin` | `admin` | `root` | Sheet "Enable Authentication" |
| `myuser` | `mydatabase` | `readWrite` on `mydatabase` | Sheet "Enable Authentication" |
| `schoolapp` | `admin` | `readWrite` on `schoolDB` | The Mongoose programs |

Then the server was restarted with `config/mongod.conf` (`security: authorization: enabled`), and every kind of login was tried:

```text
$ mongosh --eval "db.adminCommand({listDatabases: 1})"
MongoServerError: Command listDatabases requires authentication

$ mongosh -u adminUser -p wrongPassword --authenticationDatabase admin
MongoServerError: Authentication failed.

$ mongosh -u adminUser -p securePassword123 --authenticationDatabase admin --eval "...getUsers()..."
[ 'admin (admin)', 'adminUser (admin)', 'schoolapp (admin)' ]

$ mongosh -u adminUser -p securePassword123 --authenticationDatabase admin --eval "db.getSiblingDB('mydatabase').users.find().toArray()"
MongoServerError: not authorized on mydatabase to execute command { find: "users", ... }

$ mongosh -u myuser -p user-password --authenticationDatabase mydatabase mydatabase --eval "db.users.find({}, {_id: 0, name: 1}).toArray()"
[ { name: 'John Doe' }, { name: 'Jane Smith' } ]

$ mongosh -u myuser -p user-password --authenticationDatabase mydatabase mydatabase --eval "db.getSiblingDB('schoolDB').students.find().toArray()"
MongoServerError: not authorized on schoolDB to execute command { find: "students", ... }

$ mongosh -u admin -p your-secure-password --authenticationDatabase admin --eval "db.adminCommand({listDatabases: 1}).databases.map(d => d.name)"
[ 'admin', 'config', 'local', 'mydatabase', 'schoolDB' ]
```

| Who | Result | Why |
|---|---|---|
| No login | Refused | Authorization is on |
| Wrong password | "Authentication failed." | |
| `adminUser` listing users | Allowed | `userAdminAnyDatabase` manages users and roles |
| `adminUser` reading data | **Refused** | That role does **not** include reading or writing data |
| `myuser` in `mydatabase` | Allowed | `readWrite` on `mydatabase` |
| `myuser` in `schoolDB` | Refused | Its role covers only `mydatabase` |
| `admin` | Everything | `root` |

Mongoose against the secured server:

```text
$ npm run crud
Database connected: 127.0.0.1:27017/schoolDB
Collection used by the model: students
MongoServerError: Command delete requires authentication
Database disconnected

$ MONGODB_URI="mongodb://schoolapp:school-app-password@127.0.0.1:27017/schoolDB?authSource=admin" npm run crud
Database connected: 127.0.0.1:27017/schoolDB
...
Record updated { matchedCount: 1, modifiedCount: 1 }
Record deleted { deletedCount: 1 }
Students left: 0
Database disconnected
```

Without a user, Mongoose still prints "Database connected": the connection opens, and the first command is refused. With `schoolapp` and `authSource=admin` (the database where that user was created) everything works.

### 7.7 Backup and export

```text
$ mongoexport --uri='mongodb://myuser:user-password@127.0.0.1:27017/mydatabase?authSource=mydatabase' --collection=users --out=users.json
connected to: mongodb://[**REDACTED**]@127.0.0.1:27017/mydatabase?authSource=mydatabase
exported 2 records
{"_id":{"$oid":"6b0143624cf0ec238be3452f"},"name":"John Doe","age":31,"email":"john@example.com"}
{"_id":{"$oid":"6b0143624cf0ec238be34530"},"name":"Jane Smith","age":25,"email":"jane@example.com"}

$ mongodump --uri='mongodb://admin:your-secure-password@127.0.0.1:27017/mydatabase?authSource=admin' --out=backup
writing mydatabase.users to backup/mydatabase/users.bson
done dumping mydatabase.users (2 documents)

$ mongoexport --uri='mongodb://127.0.0.1:27017/mydatabase' --collection=users --out=nope.json
Failed: (Unauthorized) Command listCollections requires authentication
```

`mongoexport` writes readable JSON (one document per line). `mongodump` writes BSON plus metadata, which `mongorestore` reads back with indexes. The tools also need a user once authentication is on.

### 7.8 Server not running

```text
$ npm run crud          (mongod stopped)
Connection error: connect ECONNREFUSED 127.0.0.1:27017
exit code: 1, took 5.3 s
```

## 8. Problems in the lab sheet, and the fixes

### 8.1 The connection example fails with current Mongoose

The sheet's section 5:

```javascript
mongoose.connect('mongodb://127.0.0.1:27017/schoolDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
```

Run as written with Mongoose 9.12.3:

```text
Connection error: MongoParseError: options usenewurlparser, useunifiedtopology are not supported
```

The connection is never made. These two options were needed with the old MongoDB driver 3. Since driver 4 they do nothing, and the current driver (7.8) rejects them. **Fix:** leave them out: `mongoose.connect(uri)` (`db.js`).

### 8.2 The CRUD snippets cannot run as written

Sections 9 to 11 use `await` at the top level together with `require()`:

```text
ReferenceError: Cannot determine intended module format because both require() and top-level await are present.
If the code is intended to be CommonJS, wrap await in an async function.
```

**Fix:** the code runs inside `async function main() { ... }`, and `main().catch(...)` prints a clear error and closes the connection if anything fails (`crud.js`, `queries.js`).

### 8.3 `use` and `show` do not work in a script file

The sheet's "In MongoDB Shell" commands work when typed, but saved in a file and run with `mongosh --file`:

```text
SyntaxError: Missing semicolon. (2:3)
> 2 | use helpertest
    |    ^
```

`use` and `show` are shell helpers for typing, not JavaScript. **Fix:** `shell/basics.mongosh.js` uses `db.getSiblingDB("mydatabase")` and `db.adminCommand({ listDatabases: 1 })`.

### 8.4 The sheet's admin user cannot read data

`adminUser` gets `userAdminAnyDatabase`. Section 7.6 shows that this user can manage users but gets "not authorized" on any `find`. It is the right role for a user administrator, but not for an application. **Fix:** use a user with `readWrite` on its own database for apps (`myuser`, `schoolapp`), and `root` only for full administration.

### 8.5 Other notes

| Item | Note |
|---|---|
| Passwords on the command line | `mongosh -u adminUser -p securePassword123` stores the password in the shell history. Typing `-p` with no value makes `mongosh` ask for it instead |
| Passwords in the sheet | `securePassword123`, `your-secure-password` and `user-password` were used only on this local test server, as in the sheet. Real servers need strong, unique passwords, kept out of the code (for example in an environment variable like `MONGODB_URI`) |
| "Whitelist your IP" (Atlas) | Atlas now calls it the **IP Access List** |
| Error handling in the sheet's `connectDB` | It logs the error and keeps running, so every later query fails too. `db.js` exits with code 1 instead, after a 5 s timeout rather than the default 30 s |
| Two installation guides | See 5.3: the optional section installs a different version |

## 9. Observations (what I learned)

1. A database or collection is created on the first insert, not by `use` or by defining a model. `show dbs` showed `mydatabase` only after `insertOne`.
2. Every document gets a unique `_id` automatically, and `insertMany` returns all the new ids.
3. `updateOne` reports `matchedCount` and `modifiedCount` separately: a filter can match a document that already has the new value, and then `modifiedCount` is 0.
4. Mongoose maps the model `Student` to the collection `students`, adds `__v`, and checks the schema rules before saving.
5. Query operators are objects: `{ marks: { $gt: 80 } }`. Several fields in one filter are joined with AND, `$or` takes an array of conditions.
6. `sort({ marks: -1 })` is descending, `limit(5)` keeps the first five after sorting, and a projection of `{ name: 1, _id: 0 }` returns only those fields.
7. With authorization on, logging in and being allowed are two different steps. A user can log in and still be refused (`adminUser`), and Mongoose can connect without a password and still be refused on the first query.
8. `authSource` must name the database where the user was created (`admin` for `schoolapp`, `mydatabase` for `myuser`).

## 10. Problems and Windows vs macOS differences

| # | Problem | Cause | Fix |
|---|---|---|---|
| 1 | `MongoParseError: options usenewurlparser, useunifiedtopology are not supported` | Old options from MongoDB driver 3 | Removed them (8.1) |
| 2 | `ReferenceError: Cannot determine intended module format` | Top-level `await` with `require` | `async function main()` (8.2) |
| 3 | `SyntaxError: Missing semicolon` at `use ...` in a script | Shell helpers only work when typed | `db.getSiblingDB()` (8.3) |
| 4 | `not authorized on mydatabase` for `adminUser` | `userAdminAnyDatabase` has no data access | Separate `readWrite` users (8.4) |
| 5 | `MongoServerError: Command delete requires authentication` from Mongoose | Server has authorization on, URI has no user | `MONGODB_URI` with user, password and `authSource` |
| 6 | `connect ECONNREFUSED 127.0.0.1:27017` | `mongod` not running | macOS: `brew services start mongodb-community`. Windows: `net start MongoDB` or the Services app. Ubuntu: `sudo systemctl start mongod` |
| 7 | `mongosh` not found on Windows | It is a separate download and its folder is not on `PATH` | Install it and open a new terminal. On macOS, Homebrew installs it with the server |
| 8 | Where is the config file? | Different on each system | macOS `/opt/homebrew/etc/mongod.conf` (Apple silicon), Windows `C:\Program Files\MongoDB\Server\8.0\bin\mongod.cfg`, Ubuntu `/etc/mongod.conf` |
| 9 | `localhost` vs `127.0.0.1` | On some systems `localhost` resolves to the IPv6 address `::1` first, while `mongod` listens on `127.0.0.1` | Use `127.0.0.1`, as the sheet does |

## 11. Viva questions

1. **What is MongoDB?** An open-source, document-oriented NoSQL database that stores JSON-like documents in collections, without a fixed table schema.
2. **`mongod` vs `mongosh` vs Compass?** `mongod` is the server, `mongosh` is the command-line shell client, Compass is the graphical client.
3. **Default port?** 27017.
4. **Do you need to create a database or collection before inserting?** No. Both are created on the first insert (shown in 7.2).
5. **What does Mongoose add on top of MongoDB?** Schemas with types and validation, models with query methods, and middleware.
6. **Schema vs model?** The schema describes the fields and rules. The model is built from the schema and is used to create and query documents.
7. **How is the collection name chosen?** From the model name, in lower case and plural: `Student` becomes `students`.
8. **`find` vs `findOne`?** `find` returns an array of all matches, `findOne` the first match or `null`.
9. **`updateOne` result fields?** `matchedCount` (found) and `modifiedCount` (actually changed).
10. **What does `{ _id: 0, name: 1 }` do in `find`?** It is a projection: return only `name`, without `_id`.
11. **`$gt`, `$gte`, `$lt`, `$or`?** Greater than, greater than or equal, less than, and "any of these conditions".
12. **Why did the sheet's connection code fail?** `useNewUrlParser` and `useUnifiedTopology` were removed from the driver. Current Mongoose rejects them.
13. **What is `authSource`?** The database where the user was created. Login checks the user there.
14. **Can `userAdminAnyDatabase` read data?** No. It manages users and roles only.
15. **`mongodump` vs `mongoexport`?** `mongodump` makes a BSON backup with indexes for `mongorestore`. `mongoexport` writes JSON or CSV for other programs.

## 12. Result

MongoDB 8.0.23, `mongosh` 2.14.3 and the database tools were installed and the server was started. The sheet's shell commands created a database, inserted, found, updated and deleted documents and built an index. A Mongoose program connected, defined the `Student` model and ran CRUD, validation, operator queries, sorting, limiting and projection. With authorization enabled, every user behaved as its role allows, and `mongodump` and `mongoexport` backed up the data. Two of the sheet's code examples do not run with current Node.js and Mongoose (old connection options, top-level `await` with `require`), and both were fixed.

## 13. Conclusion

MongoDB keeps data as flexible documents and creates databases and collections on demand, while Mongoose brings back structure and validation inside the application. Running every command for real showed that tutorial code ages: options and syntax that worked a few versions ago now stop the program. Turning on authentication showed the difference between logging in and being allowed, which is the basis of giving each application only the access it needs.

## 14. References

1. MongoDB documentation: *Install MongoDB Community Edition*. <https://www.mongodb.com/docs/manual/administration/install-community/>
2. MongoDB documentation: *mongosh, Write scripts* (helpers and `getSiblingDB`). <https://www.mongodb.com/docs/mongodb-shell/write-scripts/>
3. MongoDB documentation: *Built-in roles*. <https://www.mongodb.com/docs/manual/reference/built-in-roles/>
4. MongoDB documentation: *Connection string options* (`authSource`). <https://www.mongodb.com/docs/manual/reference/connection-string-options/>
5. Mongoose documentation: *Connections*. <https://mongoosejs.com/docs/connections.html>
6. Mongoose documentation: *Models* (collection names). <https://mongoosejs.com/docs/models.html>
