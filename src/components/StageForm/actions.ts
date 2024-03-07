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

export const reduceUserCredit = async (userId: string) => {
  try {
    const result = await prismaClient.profile.update({
      where: {
        uid: userId,
      },
      data: {
        credit: {
          decrement: 1,
        },
      },
    });
    return result;
  } catch (e) {
    console.log("Error updating user credit");
    throw new Error("Error updating user credit");
  }
};
