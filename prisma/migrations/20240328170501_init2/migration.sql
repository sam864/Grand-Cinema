/*
  Warnings:

  - You are about to drop the column `screeningId` on the `Seat` table. All the data in the column will be lost.
  - Added the required column `roomId` to the `Seat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_screeningId_fkey";

-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "screeningId",
ADD COLUMN     "roomId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
