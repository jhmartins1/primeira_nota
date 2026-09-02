CREATE UNIQUE INDEX "Agendamento_usuarioId_dataHora_agendado_key"
ON "Agendamento" ("usuarioId", "dataHora")
WHERE "status" = 'AGENDADO';