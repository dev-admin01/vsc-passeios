-- CreateTable
CREATE TABLE "services_suppliers" (
    "id_service_supplier" SERIAL NOT NULL,
    "id_service" INTEGER NOT NULL,
    "id_supplier" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "services_suppliers_pkey" PRIMARY KEY ("id_service_supplier")
);

-- AddForeignKey
ALTER TABLE "services_suppliers" ADD CONSTRAINT "services_suppliers_id_service_fkey" FOREIGN KEY ("id_service") REFERENCES "services"("id_service") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services_suppliers" ADD CONSTRAINT "services_suppliers_id_supplier_fkey" FOREIGN KEY ("id_supplier") REFERENCES "suppliers"("id_supplier") ON DELETE RESTRICT ON UPDATE CASCADE;
