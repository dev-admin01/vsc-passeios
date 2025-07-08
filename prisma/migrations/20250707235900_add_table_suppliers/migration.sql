-- CreateEnum
CREATE TYPE "Jurisdicao" AS ENUM ('BRASIL', 'SAN_ANDRES');

-- CreateTable
CREATE TABLE "suppliers" (
    "id_supplier" TEXT NOT NULL,
    "nome_fantasia" TEXT NOT NULL,
    "jurisdicao" "Jurisdicao" NOT NULL,
    "cnpj" TEXT,
    "razao_social" TEXT,
    "inscricao_estadual" TEXT,
    "tax_id" TEXT,
    "registro_san" TEXT,
    "license_number" TEXT,
    "tipo_atividade" TEXT,
    "email" TEXT,
    "telefone" TEXT,
    "endereco" TEXT,
    "data_cadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id_supplier")
);

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_cnpj_key" ON "suppliers"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_tax_id_key" ON "suppliers"("tax_id");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_registro_san_key" ON "suppliers"("registro_san");

-- CreateIndex
CREATE INDEX "suppliers_jurisdicao_idx" ON "suppliers"("jurisdicao");

-- CreateIndex
CREATE INDEX "suppliers_cnpj_idx" ON "suppliers"("cnpj");

-- CreateIndex
CREATE INDEX "suppliers_registro_san_idx" ON "suppliers"("registro_san");
