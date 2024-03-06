"use server";

import { prismaClient } from "src/services";

export const getCredit = async (userId: string) => {
  try {
    const result = await prismaClient.profile.findFirst({
      where: {
        uid: userId,
      },
      select: {
        credit: true,
      },
    });

    return result;
  } catch (e) {
    console.log("Error getting credit from db: ", e);
    throw new Error("Error getting credit from db");
  }
};
