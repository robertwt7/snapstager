-- AlterTable
ALTER TABLE "public"."Images" ADD COLUMN     "relatedTo" INTEGER;

-- AlterTable
ALTER TABLE "public"."Profile" ALTER COLUMN "credit" SET DEFAULT 2;
