"use server";
import { prismaClient, supabase } from "src/services";

export interface FormValues {
  firstName: string;
  lastName: string;
  newPassword: string;
  confirmPassword: string;
  password: string;
}
export const updateProfile = async (values: FormValues, email: string) => {
  try {
    const { data } = await supabase.auth.signInWithPassword({
      email: email,
      password: values.password,
    });

    if (data?.user) {
      if (values.newPassword !== "") {
        await supabase.auth.updateUser({ password: values.newPassword });
      }

      if (values.firstName !== "" || values.lastName !== "") {
        await prismaClient.profile.update({
          where: {
            uid: data?.user?.id,
          },
          data: {
            firstName: values.firstName,
            lastName: values.lastName,
          },
        });
      }
    }
  } catch (e) {
    console.log("Error when updating user profile on server");
  }
};
