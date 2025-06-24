-- CreateTable
CREATE TABLE "positions" (
    "id_position" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "positions_pkey" PRIMARY KEY ("id_position")
);

-- CreateTable
CREATE TABLE "users" (
    "id_user" TEXT NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "password" VARCHAR(72) NOT NULL,
    "id_position" INTEGER NOT NULL,
    "ddi" VARCHAR(3),
    "ddd" VARCHAR(3),
    "phone" VARCHAR(10),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id_session" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id_session")
);

-- CreateTable
CREATE TABLE "services" (
    "id_service" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "type" VARCHAR(1) NOT NULL,
    "price" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "observation" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id_service")
);

-- CreateTable
CREATE TABLE "customers" (
    "id_customer" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf_cnpj" TEXT,
    "rg" TEXT,
    "razao_social" TEXT,
    "nome_fantasia" TEXT,
    "ddi" TEXT,
    "ddd" TEXT,
    "telefone" TEXT,
    "indicacao" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id_customer")
);

-- CreateTable
CREATE TABLE "orders" (
    "id_order" TEXT NOT NULL,
    "order_number" TEXT,
    "link_signature" TEXT,
    "id_customer" TEXT,
    "pre_name" TEXT,
    "pre_email" TEXT,
    "pre_ddi" TEXT,
    "pre_ddd" TEXT,
    "pre_phone" TEXT,
    "id_user" TEXT NOT NULL,
    "price" TEXT,
    "time" TEXT NOT NULL,
    "id_cond_pag" TEXT,
    "id_coupons" TEXT,
    "hotel" TEXT,
    "hotel_checkin" TIMESTAMP(3),
    "hotel_checkout" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_status_order" INTEGER,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id_order")
);

-- CreateTable
CREATE TABLE "orders_service" (
    "id_order_service" SERIAL NOT NULL,
    "id_order" TEXT NOT NULL,
    "id_service" INTEGER NOT NULL,
    "discount" DECIMAL(65,30),
    "quantity" INTEGER,
    "suggested_date" TIMESTAMP(3),
    "price" TEXT,
    "time" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_service_pkey" PRIMARY KEY ("id_order_service")
);

-- CreateTable
CREATE TABLE "orders_documentation" (
    "id_order_documentation" SERIAL NOT NULL,
    "id_order" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_documentation_pkey" PRIMARY KEY ("id_order_documentation")
);

-- CreateTable
CREATE TABLE "orders_history" (
    "id_order_history" SERIAL NOT NULL,
    "id_order" TEXT NOT NULL,
    "id_user" TEXT,
    "id_status_order" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_history_pkey" PRIMARY KEY ("id_order_history")
);

-- CreateTable
CREATE TABLE "orders_status" (
    "id_status_order" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_status_pkey" PRIMARY KEY ("id_status_order")
);

-- CreateTable
CREATE TABLE "midias" (
    "id_midia" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "midias_pkey" PRIMARY KEY ("id_midia")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id_coupons" TEXT NOT NULL,
    "coupon" VARCHAR(15) NOT NULL,
    "discount" TEXT NOT NULL,
    "id_midia" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id_coupons")
);

-- CreateTable
CREATE TABLE "condicoes_pagamentos" (
    "id_cond_pag" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "installments" VARCHAR(2) NOT NULL,
    "discount" VARCHAR(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "condicoes_pagamentos_pkey" PRIMARY KEY ("id_cond_pag")
);

-- CreateIndex
CREATE UNIQUE INDEX "positions_description_key" ON "positions"("description");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "customers_cpf_cnpj_key" ON "customers"("cpf_cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "customers_rg_key" ON "customers"("rg");

-- CreateIndex
CREATE UNIQUE INDEX "orders_status_description_key" ON "orders_status"("description");

-- CreateIndex
CREATE UNIQUE INDEX "midias_description_key" ON "midias"("description");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_coupon_key" ON "coupons"("coupon");

-- CreateIndex
CREATE UNIQUE INDEX "condicoes_pagamentos_description_key" ON "condicoes_pagamentos"("description");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_id_position_fkey" FOREIGN KEY ("id_position") REFERENCES "positions"("id_position") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_id_customer_fkey" FOREIGN KEY ("id_customer") REFERENCES "customers"("id_customer") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_id_cond_pag_fkey" FOREIGN KEY ("id_cond_pag") REFERENCES "condicoes_pagamentos"("id_cond_pag") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_id_coupons_fkey" FOREIGN KEY ("id_coupons") REFERENCES "coupons"("id_coupons") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_id_status_order_fkey" FOREIGN KEY ("id_status_order") REFERENCES "orders_status"("id_status_order") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_service" ADD CONSTRAINT "orders_service_id_order_fkey" FOREIGN KEY ("id_order") REFERENCES "orders"("id_order") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_service" ADD CONSTRAINT "orders_service_id_service_fkey" FOREIGN KEY ("id_service") REFERENCES "services"("id_service") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_documentation" ADD CONSTRAINT "orders_documentation_id_order_fkey" FOREIGN KEY ("id_order") REFERENCES "orders"("id_order") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_history" ADD CONSTRAINT "orders_history_id_order_fkey" FOREIGN KEY ("id_order") REFERENCES "orders"("id_order") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_history" ADD CONSTRAINT "orders_history_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id_user") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_history" ADD CONSTRAINT "orders_history_id_status_order_fkey" FOREIGN KEY ("id_status_order") REFERENCES "orders_status"("id_status_order") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_id_midia_fkey" FOREIGN KEY ("id_midia") REFERENCES "midias"("id_midia") ON DELETE RESTRICT ON UPDATE CASCADE;
