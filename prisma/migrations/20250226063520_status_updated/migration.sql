-- AlterTable
ALTER TABLE "Batch" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'not started';

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'not started';

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "status" SET DEFAULT 'not started';
