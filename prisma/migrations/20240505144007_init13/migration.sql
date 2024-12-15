/*
  Warnings:

  - You are about to drop the column `seatPrice` on the `Screening` table. All the data in the column will be lost.
  - Added the required column `seat_price` to the `Screening` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Screening" DROP COLUMN "seatPrice",
ADD COLUMN     "seat_price" INTEGER NOT NULL;
