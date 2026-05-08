-- Add constraints/indexes for correctness + scalability.
-- Aligned with `backend/src/prisma/schema.prisma`.

-- Curriculum: prevent duplicate (board, grade)
CREATE UNIQUE INDEX IF NOT EXISTS "Curriculum_board_grade_key" ON "Curriculum"("board", "grade");

-- Subject: prevent duplicate subject names per curriculum
CREATE UNIQUE INDEX IF NOT EXISTS "Subject_curriculumId_name_key" ON "Subject"("curriculumId", "name");
CREATE INDEX IF NOT EXISTS "Subject_curriculumId_idx" ON "Subject"("curriculumId");

-- Chapter: prevent duplicate chapter names per subject
CREATE UNIQUE INDEX IF NOT EXISTS "Chapter_subjectId_name_key" ON "Chapter"("subjectId", "name");
CREATE INDEX IF NOT EXISTS "Chapter_subjectId_idx" ON "Chapter"("subjectId");

-- Topic: prevent duplicate topic names per chapter
CREATE UNIQUE INDEX IF NOT EXISTS "Topic_chapterId_name_key" ON "Topic"("chapterId", "name");
CREATE INDEX IF NOT EXISTS "Topic_chapterId_idx" ON "Topic"("chapterId");

-- LessonPlan access patterns
CREATE INDEX IF NOT EXISTS "LessonPlan_teacherId_updatedAt_idx" ON "LessonPlan"("teacherId", "updatedAt");
CREATE INDEX IF NOT EXISTS "LessonPlan_subjectId_idx" ON "LessonPlan"("subjectId");
CREATE INDEX IF NOT EXISTS "LessonPlan_topicId_idx" ON "LessonPlan"("topicId");

-- Assignment access patterns
CREATE INDEX IF NOT EXISTS "Assignment_teacherId_createdAt_idx" ON "Assignment"("teacherId", "createdAt");
CREATE INDEX IF NOT EXISTS "Assignment_subjectId_idx" ON "Assignment"("subjectId");
CREATE INDEX IF NOT EXISTS "Assignment_topicId_idx" ON "Assignment"("topicId");

-- Submission access patterns
CREATE INDEX IF NOT EXISTS "Submission_assignmentId_idx" ON "Submission"("assignmentId");
CREATE INDEX IF NOT EXISTS "Submission_studentId_idx" ON "Submission"("studentId");

-- Student roster filters
CREATE INDEX IF NOT EXISTS "Student_grade_section_idx" ON "Student"("grade", "section");

-- Attendance time-series
CREATE INDEX IF NOT EXISTS "Attendance_teacherId_date_idx" ON "Attendance"("teacherId", "date");
CREATE INDEX IF NOT EXISTS "Attendance_studentId_date_idx" ON "Attendance"("studentId", "date");
CREATE INDEX IF NOT EXISTS "Attendance_classId_date_idx" ON "Attendance"("classId", "date");

-- Quiz listing
CREATE INDEX IF NOT EXISTS "Quiz_topicId_createdAt_idx" ON "Quiz"("topicId", "createdAt");

-- AssessmentGrade listing
CREATE INDEX IF NOT EXISTS "AssessmentGrade_studentId_gradedAt_idx" ON "AssessmentGrade"("studentId", "gradedAt");

-- Message listing
CREATE INDEX IF NOT EXISTS "Message_senderId_createdAt_idx" ON "Message"("senderId", "createdAt");
CREATE INDEX IF NOT EXISTS "Message_receiverId_createdAt_idx" ON "Message"("receiverId", "createdAt");

