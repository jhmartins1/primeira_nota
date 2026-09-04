/*
  Warnings:

  - You are about to drop the `DisponibilidadePadrao` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[professorId,horaInicio]` on the table `Disponibilidade` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "DisponibilidadePadrao" DROP CONSTRAINT "DisponibilidadePadrao_professorId_fkey";

-- DropTable
DROP TABLE "DisponibilidadePadrao";

-- CreateIndex
CREATE INDEX "Agendamento_professorId_idx" ON "Agendamento"("professorId");

-- CreateIndex
CREATE INDEX "Agendamento_professorId_dataHora_idx" ON "Agendamento"("professorId", "dataHora");

-- CreateIndex
CREATE INDEX "Disponibilidade_professorId_horaInicio_idx" ON "Disponibilidade"("professorId", "horaInicio");

-- CreateIndex
CREATE UNIQUE INDEX "Disponibilidade_professorId_horaInicio_key" ON "Disponibilidade"("professorId", "horaInicio");

-- CreateIndex
CREATE INDEX "ProfessorInstrumento_professorId_idx" ON "ProfessorInstrumento"("professorId");

-- CreateIndex
CREATE INDEX "ProfessorInstrumento_instrumentoId_idx" ON "ProfessorInstrumento"("instrumentoId");

-- CreateIndex
CREATE INDEX "ProfessorInstrumento_nivelId_idx" ON "ProfessorInstrumento"("nivelId");
