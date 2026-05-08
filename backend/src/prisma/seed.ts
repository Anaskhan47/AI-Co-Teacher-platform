import { PrismaClient, BoardType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding curriculum data...');

    const boards: BoardType[] = ['CBSE', 'ICSE', 'SSC'];
    const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const subjectsList = ['Mathematics', 'Science', 'English', 'Social Studies', 'History', 'Geography'];

    for (const board of boards) {
        for (const grade of grades) {
            const curriculum = await prisma.curriculum.create({
                data: {
                    board,
                    grade,
                }
            });

            for (const subjectName of subjectsList) {
                const subject = await prisma.subject.create({
                    data: {
                        name: subjectName,
                        curriculumId: curriculum.id,
                    }
                });

                // Create some default chapters
                for (let i = 1; i <= 3; i++) {
                    const chapter = await prisma.chapter.create({
                        data: {
                            name: `Chapter ${i}: Basics of ${subjectName} (Grade ${grade})`,
                            subjectId: subject.id,
                        }
                    });

                    // Create some default topics
                    for (let j = 1; j <= 2; j++) {
                        await prisma.topic.create({
                            data: {
                                name: `Topic ${i}.${j}: Introduction to ${subjectName} Part ${j}`,
                                chapterId: chapter.id,
                            }
                        });
                    }
                }
            }
        }
    }

    console.log('Seed completed successfully.');
}

main()
    .catch((e) => {
        console.error('SEED ERROR:', e);
        if (e.stack) console.error(e.stack);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
