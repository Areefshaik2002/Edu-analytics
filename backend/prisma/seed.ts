import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const subjectsList = ["Telugu", "Hindi", "English", "Social Studies"];
const monthsList = ["January", "February", "March", "April", "May", "June"];

const firstNames = [
  "Arjun", "Priya", "Rohan", "Sneha", "Aarav", "Ananya", "Rahul", "Pooja", "Vikram", "Neha",
  "Aditya", "Shruti", "Sanjay", "Meera", "Kabir", "Divya", "Amit", "Kiran", "Yash", "Tanvi",
  "Alok", "Riya", "Rajesh", "Deepika", "Manish", "Sunita", "Gaurav", "Aarti", "Suresh", "Preeti",
  "Abhishek", "Kavita", "Vivek", "Shalini", "Kartik", "Shweta", "Harish", "Nisha", "Sameer", "Swati",
  "Ashok", "Geeta", "Vijay", "Anjali", "Ramesh", "Priyanka", "Anil", "Meenakshi", "Sandeep", "Jyoti",
  "Pranav", "Ishita", "Varun", "Ritu", "Akash", "Komal", "Dev", "Payal", "Nikhil", "Prerna",
  "Kunwar", "Radhika", "Gopal", "Madhavi", "Raman", "Kriti", "Mohan", "Rupali", "Bhupesh", "Kajal",
  "Karan", "Simran", "Dinesh", "Pallavi", "Jitendra", "Shikha", "Mahesh", "Rashmi", "Umesh", "Bhawna",
  "Tushar", "Sonia", "Mayank", "Monalisa", "Ankur", "Vandana", "Tarun", "Rakhi", "Bharat", "Rekha",
  "Hemant", "Kusum", "Satish", "Lata", "Naveen", "Sudha", "Pankaj", "Uma", "Narendra", "Sarita"
];

const lastNames = [
  "Kumar", "Sharma", "Reddy", "Verma", "Singh", "Gupta", "Patel", "Joshi", "Rao", "Nair",
  "Mehta", "Iyer", "Sen", "Das", "Roy", "Choudhury", "Mishra", "Pandey", "Trivedi", "Deshmukh",
  "Kulkarni", "Patil", "Bose", "Chatterjee", "Banerjee", "Mukherjee", "Shukla", "Dube", "Prasad", "Sinha"
];

const classes = ["10-A", "10-B", "9-A", "9-B", "8-A", "8-B"];

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomMark(subject: string): number {
  // Let us make marks realistic based on subjects
  let min = 50;
  let max = 100;
  if (subject === "English") {
    min = 60;
  } else if (subject === "Telugu") {
    min = 55;
  } else if (subject === "Hindi") {
    min = 45;
  } else if (subject === "Social Studies") {
    min = 50;
  }
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
}

async function main() {
  console.log("Seeding started...");

  // 1. Seed Subjects
  console.log("Seeding subjects...");
  const subjects = [];
  for (const sName of subjectsList) {
    const sub = await prisma.subject.upsert({
      where: { subjectName: sName },
      update: {},
      create: { subjectName: sName }
    });
    subjects.push(sub);
  }

  // 2. Seed Months
  console.log("Seeding months...");
  const months = [];
  for (const mName of monthsList) {
    const mon = await prisma.month.upsert({
      where: { monthName: mName },
      update: {},
      create: { monthName: mName }
    });
    months.push(mon);
  }

  // 3. Seed Students & Marks
  console.log("Seeding 100 students and their marks...");
  
  // Use unique set of names
  const generatedNames = new Set<string>();
  
  for (let i = 0; i < 100; i++) {
    let name = "";
    do {
      name = `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`;
    } while (generatedNames.has(name));
    generatedNames.add(name);

    // Make sure Arjun Kumar, Priya Sharma, Rohan Verma exist as per design mockups
    if (i === 0) name = "Arjun Kumar";
    if (i === 1) name = "Priya Sharma";
    if (i === 2) name = "Rohan Verma";

    const age = name === "Rohan Verma" ? 16 : 15;
    const currentClass = i < 30 ? "10-A" : getRandomElement(classes);

    const student = await prisma.student.create({
      data: {
        name,
        age,
        currentClass
      }
    });

    // Create marks for every subject/month combination
    const markData = [];
    for (const sub of subjects) {
      for (const mon of months) {
        markData.push({
          studentId: student.id,
          subjectId: sub.id,
          monthId: mon.id,
          marks: getRandomMark(sub.subjectName)
        });
      }
    }

    await prisma.mark.createMany({
      data: markData
    });
  }

  console.log("Database successfully seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
