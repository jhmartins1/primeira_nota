-- DropForeignKey
ALTER TABLE "Disponibilidade" DROP CONSTRAINT "Disponibilidade_professorId_fkey";

-- DropForeignKey
ALTER TABLE "ProfessorInstrumento" DROP CONSTRAINT "ProfessorInstrumento_professorId_fkey";

-- AddForeignKey
ALTER TABLE "ProfessorInstrumento" ADD CONSTRAINT "ProfessorInstrumento_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disponibilidade" ADD CONSTRAINT "Disponibilidade_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
