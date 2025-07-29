/*
  Warnings:

  - You are about to drop the column `text` on the `FlowNode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FlowNode" DROP COLUMN "text",
ADD COLUMN     "data" TEXT;
