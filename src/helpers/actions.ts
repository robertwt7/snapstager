"use server";

import { prismaClient } from "src/services";

export type GetProfileReturn = {
  credit: number;
  firstName: string | null;
  lastName: string | null;
};
export const getProfile = async (
  userId: string,
): Promise<GetProfileReturn | null> => {
  try {
    const result = await prismaClient.profile.findFirst({
      where: {
        uid: userId,
      },
      select: {
        credit: true,
        firstName: true,
        lastName: true,
      },
    });

    return result;
  } catch (e) {
    console.log("Error getting credit from db: ", e);
    throw new Error("Error getting credit from db");
  }
};
