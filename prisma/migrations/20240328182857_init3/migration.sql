/*
  Warnings:

  - You are about to drop the column `is_booked` on the `Seat` table. All the data in the column will be lost.
  - Added the required column `layoutId` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Screening` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Seat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "layoutId" TEXT NOT NULL,
ALTER COLUMN "number" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Screening" ADD COLUMN     "status" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "is_booked",
ADD COLUMN     "status" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Layout" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rows" INTEGER NOT NULL,
    "columns" INTEGER NOT NULL,
    "seats_per_row" INTEGER NOT NULL,
    "total_seats" INTEGER NOT NULL,
    "seat_map" TEXT[],

    CONSTRAINT "Layout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Layout_name_key" ON "Layout"("name");

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_layoutId_fkey" FOREIGN KEY ("layoutId") REFERENCES "Layout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
