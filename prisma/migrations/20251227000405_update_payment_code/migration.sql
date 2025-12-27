/*
  Warnings:

  - The `code` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "reference" TEXT,
DROP COLUMN "code",
ADD COLUMN     "code" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "payments_code_key" ON "payments"("code");
