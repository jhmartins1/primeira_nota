/*
  Warnings:

  - A unique constraint covering the columns `[clerkId]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clerkId` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "clerkId" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_clerkId_key" ON "Usuario"("clerkId");
