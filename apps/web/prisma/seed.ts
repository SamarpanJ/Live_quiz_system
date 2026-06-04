import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const joinCode = "DEMO5";
  await prisma.quiz.deleteMany({ where: { joinCode } });

  const quiz = await prisma.quiz.create({
    data: {
      title: "Sample Quiz: General Knowledge",
      description: "A ready-made quiz so you can try a live run right away.",
      joinCode,
      questions: {
        create: [
          {
            order: 0,
            text: "What is the capital of France?",
            options: JSON.stringify(["Madrid", "Paris", "Berlin", "Rome"]),
            correctIndex: 1,
            marks: 10,
            durationSec: 15,
            breakSec: 5,
          },
          {
            order: 1,
            text: "Which planet is known as the Red Planet?",
            options: JSON.stringify(["Venus", "Jupiter", "Mars", "Saturn"]),
            correctIndex: 2,
            marks: 10,
            durationSec: 15,
            breakSec: 5,
          },
          {
            order: 2,
            text: "How many continents are there on Earth?",
            options: JSON.stringify(["5", "6", "7", "8"]),
            correctIndex: 2,
            marks: 10,
            durationSec: 12,
            breakSec: 5,
          },
        ],
      },
    },
  });

  console.log(`Seeded quiz "${quiz.title}" with join code ${quiz.joinCode}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
