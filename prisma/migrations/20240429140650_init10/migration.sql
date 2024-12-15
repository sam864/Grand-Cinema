/*
  Warnings:

  - You are about to drop the column `reservationId` on the `Seat` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Seat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_reservationId_fkey";

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "reservationId",
DROP COLUMN "status";

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "_ReservationToSeat" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ReservationToSeat_AB_unique" ON "_ReservationToSeat"("A", "B");

-- CreateIndex
CREATE INDEX "_ReservationToSeat_B_index" ON "_ReservationToSeat"("B");

-- AddForeignKey
ALTER TABLE "_ReservationToSeat" ADD CONSTRAINT "_ReservationToSeat_A_fkey" FOREIGN KEY ("A") REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReservationToSeat" ADD CONSTRAINT "_ReservationToSeat_B_fkey" FOREIGN KEY ("B") REFERENCES "Seat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
