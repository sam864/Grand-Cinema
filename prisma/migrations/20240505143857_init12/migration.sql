/*
  Warnings:

  - Added the required column `seatPrice` to the `Screening` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Screening" ADD COLUMN     "seatPrice" INTEGER NOT NULL;
