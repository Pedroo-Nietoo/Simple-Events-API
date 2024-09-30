/*
  Warnings:

  - Added the required column `eventCreatorId` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" ADD COLUMN     "eventCreatorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_eventCreatorId_fkey" FOREIGN KEY ("eventCreatorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
