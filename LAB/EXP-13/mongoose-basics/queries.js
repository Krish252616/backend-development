// Sections 10 and 11: query operators, sorting, limiting and projection.
const { connectDB, disconnectDB } = require('./db');
const Student = require('./studentModel');

const sample = [
  { name: 'Aarav',  age: 20, course: 'CS', marks: 91 },
  { name: 'Diya',   age: 21, course: 'IT', marks: 78 },
  { name: 'Rohan',  age: 19, course: 'CS', marks: 74 },
  { name: 'Priya',  age: 22, course: 'CS', marks: 85 },
  { name: 'Kabir',  age: 20, course: 'IT', marks: 45 },
  { name: 'Meera',  age: 23, course: 'ECE', marks: 67 },
  { name: 'Ishaan', age: 21, course: 'ECE', marks: 49 },
  { name: 'Ananya', age: 20, course: 'CS', marks: 96 }
];

// Print documents as a table, without _id and __v
const table = (docs) => console.table(docs.map(({ name, age, course, marks }) => ({ name, age, course, marks })));

async function main() {
  await connectDB();
  await Student.deleteMany({});
  await Student.insertMany(sample);
  console.log(`Inserted ${await Student.countDocuments()} students`);

  console.log('\nmarks > 80:  find({ marks: { $gt: 80 } })');
  table(await Student.find({ marks: { $gt: 80 } }).lean());

  console.log('\nCS AND marks >= 75:  find({ course: "CS", marks: { $gte: 75 } })');
  table(await Student.find({ course: 'CS', marks: { $gte: 75 } }).lean());

  console.log('\nIT OR marks < 50:  find({ $or: [{ course: "IT" }, { marks: { $lt: 50 } }] })');
  table(await Student.find({ $or: [{ course: 'IT' }, { marks: { $lt: 50 } }] }).lean());

  console.log('\nSorted by marks, highest first:  find().sort({ marks: -1 })');
  table(await Student.find().sort({ marks: -1 }).lean());

  console.log('\nTop 5:  find().sort({ marks: -1 }).limit(5)');
  table(await Student.find().sort({ marks: -1 }).limit(5).lean());

  console.log('\nProjection:  find({}, { name: 1, course: 1, _id: 0 })');
  console.log(await Student.find({}, { name: 1, course: 1, _id: 0 }).lean());

  await disconnectDB();
}

main().catch(async (error) => {
  // For example "Command find requires authentication" when the server needs a password
  console.error(`${error.name}: ${error.message}`);
  await disconnectDB();
  process.exit(1);
});
