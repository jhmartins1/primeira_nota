DROP INDEX IF EXISTS "Agendamento_professorId_dataHora_key";

CREATE UNIQUE INDEX "Agendamento_professorId_dataHora_agendado_key"
ON "Agendamento" ("professorId", "dataHora")
WHERE "status" = 'AGENDADO';