/*
  Warnings:

  - You are about to drop the column `monthId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `LearningObjective` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Month` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Resource` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Step` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `batchId` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `learningObjectives` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LearningObjective" DROP CONSTRAINT "LearningObjective_projectId_fkey";

-- DropForeignKey
ALTER TABLE "Month" DROP CONSTRAINT "Month_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_monthId_fkey";

-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_learningObjectiveId_fkey";

-- DropForeignKey
ALTER TABLE "Step" DROP CONSTRAINT "Step_learningObjectiveId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "monthId",
ADD COLUMN     "batchId" TEXT NOT NULL,
ADD COLUMN     "learningObjectives" JSONB NOT NULL,
ADD COLUMN     "steps" JSONB;

-- DropTable
DROP TABLE "LearningObjective";

-- DropTable
DROP TABLE "Month";

-- DropTable
DROP TABLE "Resource";

-- DropTable
DROP TABLE "Step";

-- CreateTable
CREATE TABLE "Batch" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "courseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Batch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Batch" ADD CONSTRAINT "Batch_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
