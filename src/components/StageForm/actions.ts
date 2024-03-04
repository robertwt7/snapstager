"use server";

import { prismaClient } from "src/services";

export const updateUserProfile = async (userId: string) => {
  try {
    const result = await prismaClient.profile.upsert({
      where: {
        uid: userId,
      },
      update: {},
      create: {
        firstName: null,
        lastName: null,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return result;
  } catch (e) {
    console.log(`Error updating user profile: ${e}`);
  }
};
