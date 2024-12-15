/*
  Warnings:

  - The `seat_map` column on the `Layout` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Layout" DROP COLUMN "seat_map",
ADD COLUMN     "seat_map" JSONB[];
