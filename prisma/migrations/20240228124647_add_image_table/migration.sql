-- CreateEnum
CREATE TYPE "public"."ImageType" AS ENUM ('ORIGINAL', 'MASK', 'FINAL');

-- CreateTable
CREATE TABLE "public"."Images" (
    "id" SERIAL NOT NULL,
    "profileId" UUID NOT NULL,
    "uniqueId" TEXT NOT NULL,
    "type" "public"."ImageType" NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Images" ADD CONSTRAINT "Images_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
