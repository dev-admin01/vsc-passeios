-- CreateTable
CREATE TABLE "documentos_pdf" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "arquivo_1_base64" TEXT NOT NULL,
    "arquivo_2_base64" TEXT,
    "arquivo_3_base64" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documentos_pdf_pkey" PRIMARY KEY ("id")
);
