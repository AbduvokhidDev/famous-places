-- AlterTable
ALTER TABLE "Place" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE INDEX "Place_userId_idx" ON "Place"("userId");
