/*
  Warnings:

  - A unique constraint covering the columns `[clerkId]` on the table `Professor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Professor" ADD COLUMN     "clerkId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Professor_clerkId_key" ON "Professor"("clerkId");
