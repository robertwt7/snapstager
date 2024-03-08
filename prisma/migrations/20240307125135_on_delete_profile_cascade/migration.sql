-- DropForeignKey
ALTER TABLE "public"."Profile" DROP CONSTRAINT "Profile_uid_fkey";

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_uid_fkey" FOREIGN KEY ("uid") REFERENCES "auth"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
