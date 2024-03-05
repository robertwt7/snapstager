"use server";

import { ImageType } from "@prisma/client";
import { prismaClient } from "src/services";

export const getAllImages = async (
  userId: string,
  minId: number | null,
  limit: number = 10,
) => {
  try {
    const payload = {
      where: {
        profileId: userId,
        type: ImageType.FINAL,
      },
      select: {
        id: true,
        url: true,
      },
      take: limit,
    };
    const result = await prismaClient.images.findMany({
      ...payload,
      cursor: minId
        ? {
            id: minId,
          }
        : undefined,
      skip: minId ? 1 : 0,
      orderBy: {
        id: "desc",
      },
    });
    return result;
  } catch (e) {
    console.log("Error getting images from db: ", e);
  }
};
