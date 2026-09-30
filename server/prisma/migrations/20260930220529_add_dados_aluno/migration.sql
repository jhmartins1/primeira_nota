-- CreateEnum
CREATE TYPE "FaixaEtaria" AS ENUM ('ATE_6', 'DE_7_A_10', 'DE_11_A_14', 'DE_15_A_17', 'ADULTO');

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "faixaEtaria" "FaixaEtaria",
ADD COLUMN     "nomeAluno" TEXT;
