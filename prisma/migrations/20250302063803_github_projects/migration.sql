/*
  Warnings:

  - A unique constraint covering the columns `[batchId,position]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[githubOwnerid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Batch" ADD COLUMN     "githubProjectId" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "githubRepo" JSONB,
ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "githubOwnerid" TEXT,
ADD COLUMN     "githubToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Project_batchId_position_key" ON "Project"("batchId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "User_githubOwnerid_key" ON "User"("githubOwnerid");
