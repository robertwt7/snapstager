"use server";
import { app } from "src/env";
import { prismaClient } from "./prismaClient";
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
      `https://api.cloudflare.com/client/v4/accounts/${app.NEXT_PUBLIC_ACCOUNT_ID}/images/v1`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${app.NEXT_PUBLIC_CLOUDFLARE_TOKEN}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      },
    );
    const result: Result = await response.json();

    if (result?.success) {
      // Save the image to the database
      await prismaClient.images.create({
        data: {
          id: result.result.id,
          filename: result.result.filename,
          uploaded: new Date(result.result.uploaded),
          original: result.result.variants[0],
          thumbnail: result.result.variants[1],
        },
      });
    }
    return result;
  } catch (e) {
    // TODO: Snackbar feedback
    console.error(`Error uploading image: ${e}`);
  }
};
