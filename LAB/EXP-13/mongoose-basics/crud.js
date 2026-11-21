// Section 9: Create, Read, Update, Delete with Mongoose.
// The sheet's snippets use `await` at the top level of a CommonJS file, which Node refuses
// ("Cannot determine intended module format"). Here they run inside an async function.

const { connectDB, disconnectDB } = require('./db');
const Student = require('./studentModel');

async function main() {
  await connectDB();
  console.log('Collection used by the model:', Student.collection.name);

  // Start clean, so every run prints the same result
  await Student.deleteMany({});

  // (1) Create
  console.log('\n(1) Create');
  const newStudent = new Student({ name: 'Alice', age: 22, course: 'B.Tech', marks: 88 });
  await newStudent.save();
  console.log('Student added!', newStudent.toObject());

  // (2) Read
  console.log('\n(2) Read');
  const students = await Student.find();
  console.log('find():', students.map(s => s.toObject()));
  const result = await Student.findOne({ name: 'Alice' });
  console.log('findOne({ name: "Alice" }):', result.toObject());

  // (3) Update
  console.log('\n(3) Update');
  const updated = await Student.updateOne({ name: 'Alice' }, { $set: { marks: 92 } });
  console.log('Record updated', { matchedCount: updated.matchedCount, modifiedCount: updated.modifiedCount });
  console.log('Marks now:', (await Student.findOne({ name: 'Alice' })).marks);

  // (4) Delete
  console.log('\n(4) Delete');
  const deleted = await Student.deleteOne({ name: 'Alice' });
  console.log('Record deleted', { deletedCount: deleted.deletedCount });
  console.log('Students left:', await Student.countDocuments());

  // Validation from the schema: marks must be 0 to 100, name is required
  console.log('\nValidation');
  try {
    await Student.create({ age: 20, course: 'B.Tech', marks: 150 });
  } catch (error) {
    console.log(error.name + ':', Object.values(error.errors).map(e => e.message).join(' | '));
  }

  await disconnectDB();
}

main().catch(async (error) => {
  // For example "Command find requires authentication" when the server needs a password
  console.error(`${error.name}: ${error.message}`);
  await disconnectDB();
  process.exit(1);
});
