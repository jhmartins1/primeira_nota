-- CreateTable
CREATE TABLE "DisponibilidadePadrao" (
    "id" SERIAL NOT NULL,
    "professorId" INTEGER NOT NULL,
    "diaSemana" INTEGER NOT NULL,
    "horaInicio" TEXT NOT NULL,

    CONSTRAINT "DisponibilidadePadrao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DisponibilidadePadrao_professorId_diaSemana_idx" ON "DisponibilidadePadrao"("professorId", "diaSemana");

-- CreateIndex
CREATE UNIQUE INDEX "DisponibilidadePadrao_professorId_diaSemana_horaInicio_key" ON "DisponibilidadePadrao"("professorId", "diaSemana", "horaInicio");

-- AddForeignKey
ALTER TABLE "DisponibilidadePadrao" ADD CONSTRAINT "DisponibilidadePadrao_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "Professor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
