import { BoardType, PrismaClient } from '@prisma/client';

type ResolveInput = {
  board: BoardType;
  grade: number;
  subjectName: string;
  topicName: string;
};

export async function resolveCurriculumTopic(
  prisma: PrismaClient,
  input: ResolveInput
) {
  const { board, grade, subjectName, topicName } = input;

  // Standardize inputs to prevent duplicates
  const sBoard = board.toUpperCase() as BoardType;
  const sSubject = subjectName.trim();
  const sTopic = topicName.trim();

  return prisma.$transaction(async (tx) => {
    // 1. Resolve Curriculum (Board + Grade)
    const curriculum = await tx.curriculum.upsert({
      where: { board_grade: { board: sBoard, grade } },
      update: {},
      create: { board: sBoard, grade },
    });

    // 2. Resolve Subject (Title Case check or direct match)
    const subject = await tx.subject.upsert({
      where: { curriculumId_name: { curriculumId: curriculum.id, name: sSubject } },
      update: {},
      create: { curriculumId: curriculum.id, name: sSubject },
    });

    // 3. Resolve Chapter (Default to 'General' for now)
    const chapter = await tx.chapter.upsert({
      where: { subjectId_name: { subjectId: subject.id, name: 'General' } },
      update: {},
      create: { subjectId: subject.id, name: 'General' },
    });

    // 4. Resolve Topic
    const topic = await tx.topic.upsert({
      where: { chapterId_name: { chapterId: chapter.id, name: sTopic } },
      update: {},
      create: { chapterId: chapter.id, name: sTopic },
    });

    return { curriculum, subject, chapter, topic };
  });
}

