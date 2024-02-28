-- CreateTable
CREATE TABLE "public"."Profile" (
    "uid" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "credit" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."Transactions" (
    "id" SERIAL NOT NULL,
    "profileId" UUID NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_uid_key" ON "public"."Profile"("uid");

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_uid_fkey" FOREIGN KEY ("uid") REFERENCES "auth"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Transactions" ADD CONSTRAINT "Transactions_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "public"."Profile"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
