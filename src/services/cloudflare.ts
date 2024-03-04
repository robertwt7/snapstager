"use server";
import { app } from "src/env";
import { prismaClient } from "./prismaClient";
import { ImageType } from "@prisma/client";
/**
{
    "result": {
        "id": "2cdc28f0-017a-49c4-9ed7-87056c83901",
        "filename": "image.jpeg",
        "metadata": {
            "key": "value"
        },
        "uploaded": "2022-01-31T16:39:28.458Z",
        "requireSignedURLs": false,
        "variants": [
            "https://imagedelivery.net/Vi7wi5KSItxGFsWRG2Us6Q/2cdc28f0-017a-49c4-9ed7-87056c83901/public",
            "https://imagedelivery.net/Vi7wi5KSItxGFsWRG2Us6Q/2cdc28f0-017a-49c4-9ed7-87056c83901/thumbnail"
        ]
    },
    "success": true,
    "errors": [],
    "messages": []
}
 */
interface Result {
  result: {
    id: string;
    filename: string;
    metadata: {
      [key: string]: string;
    };
    uploaded: string;
    requireSignedURLs: boolean;
    variants: Array<string>;
  };
  success: boolean;
  errors: Array<string>;
  messages: Array<string>;
}
export const uploadImage = async (
  formData: FormData,
): Promise<Result | undefined> => {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${app.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID}/images/v1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${app.NEXT_PUBLIC_CLOUDFLARE_TOKEN}`,
        },
        body: formData,
      },
    );
    const result: Result = await response.json();
    if (result.success) {
      return result;
    } else {
      throw new Error("Error uploading image to cloudflare");
    }
  } catch (e) {
    // TODO: Snackbar feedback
    console.error(`Error uploading image to cloudflare: ${e}`);
    throw new Error("Something went wrong when uploading image");
  }
};

export const updateImageDb = async (
  imageUrl: string,
  userId: string,
  type: ImageType,
  relatedImageId?: number,
) => {
  try {
    const payload = {
      profileId: userId,
      url: imageUrl,
      type: type,
    };
    const result = await prismaClient.images.create({
      data:
        relatedImageId !== undefined
          ? {
              ...payload,
              relatedTo: relatedImageId,
            }
          : payload,
    });
    return result;
  } catch (e) {
    // TODO: Snackbar feedback
    console.error(`Error updating db in supabase: ${e}`);
  }
};
