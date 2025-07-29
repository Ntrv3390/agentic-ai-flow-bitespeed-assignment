/*
  Warnings:

  - Added the required column `flowId` to the `Edge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Edge" ADD COLUMN     "flowId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
