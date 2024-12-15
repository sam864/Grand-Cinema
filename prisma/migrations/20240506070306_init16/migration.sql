-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "access_id" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_access_id_key" ON "Admin"("access_id");
