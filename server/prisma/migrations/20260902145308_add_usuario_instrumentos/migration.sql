-- CreateTable
CREATE TABLE "UsuarioInstrumento" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "instrumentoId" INTEGER NOT NULL,
    "nivelId" INTEGER NOT NULL,

    CONSTRAINT "UsuarioInstrumento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UsuarioInstrumento_usuarioId_idx" ON "UsuarioInstrumento"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioInstrumento_usuarioId_instrumentoId_key" ON "UsuarioInstrumento"("usuarioId", "instrumentoId");

-- AddForeignKey
ALTER TABLE "UsuarioInstrumento" ADD CONSTRAINT "UsuarioInstrumento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioInstrumento" ADD CONSTRAINT "UsuarioInstrumento_instrumentoId_fkey" FOREIGN KEY ("instrumentoId") REFERENCES "Instrumento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioInstrumento" ADD CONSTRAINT "UsuarioInstrumento_nivelId_fkey" FOREIGN KEY ("nivelId") REFERENCES "Nivel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
