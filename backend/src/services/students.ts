import { Prisma, PrismaClient } from "@prisma/client";
import Fuse from "fuse.js";

const prisma = new PrismaClient();

type StudentWithMarks = Prisma.StudentGetPayload<{
  include: {
    marks: {
      include: {
        subject: true;
        month: true;
      };
    };
  };
}>;

export interface MarksGridInput {
  [subject: string]: {
    [month: string]: number;
  };
}

export class StudentService {
  /**
   * Computes student subject averages from mark records.
   */
  private static calculateAverages(student: StudentWithMarks) {
    const subjects = ["Telugu", "Hindi", "English", "Social Studies"];
    const averages: { [key: string]: number } = {};

    subjects.forEach((subject) => {
      const subjectMarks = student.marks.filter(
        (m) => m.subject.subjectName === subject
      );
      if (subjectMarks.length > 0) {
        const sum = subjectMarks.reduce((acc: number, curr) => acc + curr.marks, 0);
        averages[subject] = Math.round((sum / subjectMarks.length) * 10) / 10;
      } else {
        averages[subject] = 0;
      }
    });

    return {
      id: student.id,
      name: student.name,
      age: student.age,
      currentClass: student.currentClass,
      teluguAverage: averages["Telugu"],
      hindiAverage: averages["Hindi"],
      englishAverage: averages["English"],
      socialStudiesAverage: averages["Social Studies"]
    };
  }

  /**
   * Fetch all students paginated, with optional fuzzy search.
   */
  static async getStudents(page: number, limit: number, search?: string) {
    // 1. Fetch all student records with marks
    const allStudents = await prisma.student.findMany({
      include: {
        marks: {
          include: {
            subject: true,
            month: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    });

    // 2. Map to records with averages
    let processedStudents = allStudents.map(this.calculateAverages);

    // 3. Apply Fuzzy Search if query is present
    if (search && search.trim() !== "") {
      const fuse = new Fuse(processedStudents, {
        keys: ["name"],
        threshold: 0.4 // 0.0 means perfect match, 1.0 matches anything. 0.4 is optimal for typos.
      });
      const results = fuse.search(search);
      processedStudents = results.map((r) => r.item);
    }

    // 4. Paginate the resulting set
    const total = processedStudents.length;
    const startIndex = (page - 1) * limit;
    const paginatedStudents = processedStudents.slice(startIndex, startIndex + limit);
    const totalPages = Math.ceil(total / limit);

    return {
      students: paginatedStudents,
      total,
      page,
      totalPages
    };
  }

  /**
   * Fetch a single student record with complete marks entry grid.
   */
  static async getStudentById(id: number) {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        marks: {
          include: {
            subject: true,
            month: true
          }
        }
      }
    });

    if (!student) return null;

    // Convert marks list to subject-month key-value grid for easy form mapping
    const marksGrid: { [subject: string]: { [month: string]: number } } = {};

    student.marks.forEach((m) => {
      const subName = m.subject.subjectName;
      const monName = m.month.monthName;
      if (!marksGrid[subName]) {
        marksGrid[subName] = {};
      }
      marksGrid[subName][monName] = m.marks;
    });

    return {
      id: student.id,
      name: student.name,
      age: student.age,
      currentClass: student.currentClass,
      marks: marksGrid
    };
  }

  /**
   * Create a new student record and populate their marks grid.
   */
  static async createStudent(name: string, age: number, currentClass: string, marks: MarksGridInput) {
    return prisma.$transaction(async (tx) => {
      // 1. Create Student
      const student = await tx.student.create({
        data: {
          name,
          age,
          currentClass
        }
      });

      // 2. Fetch subject and month database IDs
      const dbSubjects = await tx.subject.findMany();
      const dbMonths = await tx.month.findMany();

      const markRecords = [];

      for (const subName in marks) {
        const dbSub = dbSubjects.find((s) => s.subjectName === subName);
        if (!dbSub) continue;

        for (const monName in marks[subName]) {
          const dbMon = dbMonths.find((m) => m.monthName === monName);
          if (!dbMon) continue;

          markRecords.push({
            studentId: student.id,
            subjectId: dbSub.id,
            monthId: dbMon.id,
            marks: Number(marks[subName][monName])
          });
        }
      }

      if (markRecords.length > 0) {
        await tx.mark.createMany({
          data: markRecords
        });
      }

      return student;
    });
  }

  /**
   * Update an existing student record and update their marks.
   */
  static async updateStudent(id: number, name: string, age: number, currentClass: string, marks: MarksGridInput) {
    return prisma.$transaction(async (tx) => {
      // 1. Update student info
      const student = await tx.student.update({
        where: { id },
        data: {
          name,
          age,
          currentClass
        }
      });

      // 2. Fetch subject and month database IDs
      const dbSubjects = await tx.subject.findMany();
      const dbMonths = await tx.month.findMany();

      // 3. Upsert mark records for every combination
      for (const subName in marks) {
        const dbSub = dbSubjects.find((s) => s.subjectName === subName);
        if (!dbSub) continue;

        for (const monName in marks[subName]) {
          const dbMon = dbMonths.find((m) => m.monthName === monName);
          if (!dbMon) continue;

          const score = Number(marks[subName][monName]);

          await tx.mark.upsert({
            where: {
              studentId_subjectId_monthId: {
                studentId: id,
                subjectId: dbSub.id,
                monthId: dbMon.id
              }
            },
            update: {
              marks: score
            },
            create: {
              studentId: id,
              subjectId: dbSub.id,
              monthId: dbMon.id,
              marks: score
            }
          });
        }
      }

      return student;
    });
  }

  /**
   * Delete student record. CASCADE handles marks.
   */
  static async deleteStudent(id: number) {
    return prisma.student.delete({
      where: { id }
    });
  }

  /**
   * Get student details and marks trends formatted for Chart.js.
   */
  static async getStudentAnalytics(id: number) {
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        marks: {
          include: {
            subject: true,
            month: true
          }
        }
      }
    });

    if (!student) return null;

    const subjects = ["Telugu", "Hindi", "English", "Social Studies"];
    const months = ["January", "February", "March", "April", "May", "June"];

    const analyticsData: { [subject: string]: number[] } = {};

    subjects.forEach((subName) => {
      // Sort marks by month sequence
      const trendScores: number[] = [];
      
      months.forEach((monName) => {
        const record = student.marks.find(
          (m) => m.subject.subjectName === subName && m.month.monthName === monName
        );
        trendScores.push(record ? record.marks : 0);
      });

      // Map to lowercase camelCase key for frontend API spec (telugu, hindi, english, socialStudies)
      let key = subName.toLowerCase();
      if (subName === "Social Studies") {
        key = "socialStudies";
      }

      analyticsData[key] = trendScores;
    });

    return {
      student: {
        id: student.id,
        name: student.name,
        age: student.age,
        currentClass: student.currentClass
      },
      analytics: analyticsData
    };
  }
}
