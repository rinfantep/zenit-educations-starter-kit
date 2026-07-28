import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  Role,
  AttendanceStatus,
  InvoiceStatus,
  type Grade,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const firstNames = [
  "Sofía",
  "Mateo",
  "Valentina",
  "Santiago",
  "Isabella",
  "Sebastián",
  "Camila",
  "Nicolás",
  "Valeria",
  "Diego",
  "Renata",
  "Emiliano",
  "Antonella",
  "Joaquín",
  "Luciana",
  "Gabriel",
  "Martina",
  "Samuel",
  "Regina",
  "Andrés",
];
const lastNames = [
  "García",
  "Rodríguez",
  "Martínez",
  "López",
  "Hernández",
  "Pérez",
  "González",
  "Sánchez",
  "Ramírez",
  "Torres",
  "Flores",
  "Rivera",
  "Gómez",
  "Díaz",
  "Cruz",
];

function randomName() {
  const f = firstNames[Math.floor(Math.random() * firstNames.length)];
  const l = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${f} ${l}`;
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  const password = await bcrypt.hash("Zenith2026!", 10);

  console.log("Creando usuarios base...");
  await prisma.user.upsert({
    where: { email: "admin@zenith.edu" },
    update: {},
    create: {
      name: "Admin Sistema",
      email: "admin@zenith.edu",
      password,
      role: Role.SUPER_ADMIN,
    },
  });
  await prisma.user.upsert({
    where: { email: "director@zenith.edu" },
    update: {},
    create: {
      name: "Carolina Méndez",
      email: "director@zenith.edu",
      password,
      role: Role.DIRECTOR,
    },
  });

  console.log("Creando grados...");
  const gradeNames = [
    { name: "1er Grado", level: "Primaria", order: 1 },
    { name: "2do Grado", level: "Primaria", order: 2 },
    { name: "3er Grado", level: "Primaria", order: 3 },
    { name: "4to Grado", level: "Primaria", order: 4 },
    { name: "5to Grado", level: "Primaria", order: 5 },
    { name: "6to Grado", level: "Primaria", order: 6 },
    { name: "1ro Secundaria", level: "Secundaria", order: 7 },
    { name: "2do Secundaria", level: "Secundaria", order: 8 },
  ];
  const grades: Grade[] = [];
  for (const g of gradeNames) {
    const grade = await prisma.grade.create({ data: g });
    grades.push(grade);
  }

  console.log("Creando materias...");
  const subjectData = [
    { name: "Matemáticas", code: "MAT" },
    { name: "Lengua y Literatura", code: "LEN" },
    { name: "Ciencias Naturales", code: "CIE" },
    { name: "Historia", code: "HIS" },
    { name: "Educación Física", code: "EDF" },
    { name: "Inglés", code: "ING" },
  ];
  const subjects = [];
  for (const s of subjectData) {
    subjects.push(
      await prisma.subject.upsert({
        where: { code: s.code },
        update: {},
        create: s,
      }),
    );
  }

  console.log("Creando aulas...");
  const classroomData = [
    { name: "Aula 101", capacity: 30 },
    { name: "Aula 102", capacity: 28 },
    { name: "Aula 201", capacity: 32 },
    { name: "Laboratorio", capacity: 25 },
  ];
  const classrooms = [];
  for (const c of classroomData) {
    classrooms.push(await prisma.classroom.create({ data: c }));
  }

  console.log("Creando profesores...");
  const teachers = [];
  for (let i = 0; i < 10; i++) {
    const name = randomName();
    const email = `profesor${i + 1}@zenith.edu`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { name, email, password, role: Role.TEACHER },
    });
    const teacher = await prisma.teacher.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        teacherCode: `PROF-2026-${String(i + 1).padStart(3, "0")}`,
        specialty: randomItem([
          "Educación Primaria",
          "Ciencias",
          "Matemáticas",
          "Idiomas",
        ]),
      },
    });
    await prisma.teacherSubject.createMany({
      data: [{ teacherId: teacher.id, subjectId: randomItem(subjects).id }],
      skipDuplicates: true,
    });
    teachers.push(teacher);
  }

  console.log("Creando clases...");
  const year = 2026;
  const classes = [];
  for (let i = 0; i < grades.length; i++) {
    const schoolClass = await prisma.schoolClass.create({
      data: {
        name: `${grades[i].order}A`, // ej: "1A", "2A"... único por grado
        year,
        gradeId: grades[i].id,
        classroomId: randomItem(classrooms).id,
        homeroomTeacherId: teachers[i % teachers.length].id,
      },
    });
    classes.push(schoolClass);
  }

  console.log("Creando período académico...");
  const period = await prisma.academicPeriod.create({
    data: {
      name: "Primer Trimestre",
      year,
      startDate: new Date(`${year}-02-01`),
      endDate: new Date(`${year}-04-30`),
    },
  });

  console.log("Creando estudiantes (esto tarda un poco)...");
  const students = [];
  for (let i = 0; i < 60; i++) {
    const name = randomName();
    const email = `estudiante${i + 1}@zenith.edu`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: { name, email, password, role: Role.STUDENT },
    });
    const student = await prisma.student.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        studentCode: `EST-2026-${String(i + 1).padStart(4, "0")}`,
        birthDate: new Date(
          2012 + Math.floor(i / 10),
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1,
        ),
        classId: randomItem(classes).id,
        phone: `+1 809-555-${String(1000 + i).slice(-4)}`,
      },
    });
    students.push(student);
  }

  console.log("Generando asistencia (últimos 20 días)...");
  for (let d = 0; d < 20; d++) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    date.setHours(0, 0, 0, 0);
    if (date.getDay() === 0 || date.getDay() === 6) continue; // saltar fines de semana

    for (const student of students) {
      const roll = Math.random();
      const status =
        roll > 0.92
          ? AttendanceStatus.ABSENT
          : roll > 0.85
            ? AttendanceStatus.LATE
            : AttendanceStatus.PRESENT;
      await prisma.attendance
        .upsert({
          where: { studentId_date: { studentId: student.id, date } },
          update: {},
          create: {
            studentId: student.id,
            classId: student.classId!,
            date,
            status,
          },
        })
        .catch(() => {});
    }
  }

  console.log("Generando notas...");
  for (const student of students) {
    for (const subject of subjects.slice(0, 4)) {
      await prisma.evaluationEntry.create({
        data: {
          studentId: student.id,
          subjectId: subject.id,
          periodId: period.id,
          type: "Examen",
          score: Math.floor(Math.random() * 40) + 60,
          maxScore: 100,
        },
      });
    }
  }

  console.log("Generando facturas y pagos...");
  for (const student of students) {
    const invoice = await prisma.invoice.create({
      data: {
        studentId: student.id,
        concept: "Matrícula 2026",
        amount: 150,
        dueDate: new Date(`${year}-02-15`),
        status:
          Math.random() > 0.3 ? InvoiceStatus.PAID : InvoiceStatus.PENDING,
      },
    });
    if (invoice.status === InvoiceStatus.PAID) {
      await prisma.payment.create({
        data: {
          invoiceId: invoice.id,
          amount: 150,
          method: randomItem(["transferencia", "efectivo", "tarjeta"]),
        },
      });
    }
  }

  console.log("✅ Seed completo:");
  console.log(
    `   ${teachers.length} profesores, ${students.length} estudiantes, ${classes.length} clases`,
  );
  console.log("   Login admin: admin@zenith.edu / Zenith2026!");
  console.log("   Login director: director@zenith.edu / Zenith2026!");
  console.log("   Login profesor: profesor1@zenith.edu / Zenith2026!");
  console.log("   Login estudiante: estudiante1@zenith.edu / Zenith2026!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


import { seedDemoData } from "../lib/seed-demo-data";


seedDemoData(prisma)
  .then(() => console.log("Login admin: admin@zenith.edu / Zenith2026!"))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });