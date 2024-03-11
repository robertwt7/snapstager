/*
  Warnings:

  - Added the required column `amount` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeCheckoutSessionId` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Transactions" ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "stripeCheckoutSessionId" TEXT NOT NULL;
