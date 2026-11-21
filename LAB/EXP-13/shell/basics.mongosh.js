// Experiment 13: the shell examples as a script file.
// Run:  mongosh --file shell/basics.mongosh.js
//
// Shell helpers such as `use mydatabase` and `show dbs` work only when typed in the
// interactive shell. In a script file `use mydatabase` is a SyntaxError, so this file
// uses db.getSiblingDB() and adminCommand() instead.

const mydb = db.getSiblingDB("mydatabase");        // same as: use mydatabase
mydb.users.drop();                                   // start clean so the output is the same every run

print("Databases:", db.adminCommand({ listDatabases: 1 }).databases.map(d => d.name).join(", "));   // same as: show dbs

mydb.users.insertOne({ name: "John Doe", age: 30, email: "john@example.com" });
mydb.users.insertMany([
  { name: "Jane Smith", age: 25, email: "jane@example.com" },
  { name: "Bob Johnson", age: 35, email: "bob@example.com" }
]);
print("After insert, databases:", db.adminCommand({ listDatabases: 1 }).databases.map(d => d.name).join(", "));

print("\nAll users:");
printjson(mydb.users.find({}, { _id: 0 }).toArray());

print("\nage > 25:");
printjson(mydb.users.find({ age: { $gt: 25 } }, { _id: 0, name: 1, age: 1 }).toArray());

printjson(mydb.users.updateOne({ name: "John Doe" }, { $set: { age: 31 } }));
printjson(mydb.users.deleteOne({ name: "Bob Johnson" }));
print("Index created:", mydb.users.createIndex({ email: 1 }));

print("\nFinal users:");
printjson(mydb.users.find({}, { _id: 0, name: 1, age: 1 }).toArray());
