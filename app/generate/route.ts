import { NextResponse } from "next/server";
import { api } from "src/env";
export async function POST(request: Request): Promise<NextResponse | Response> {
  const { imageUrl, imageMaskUrl, theme, room } = await request.json();

  try {
    // POST request to Replicate to start the image restoration generation process
    const startResponse = await fetch(
      "https://api.replicate.com/v1/predictions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + api.REPLICATE_API_KEY,
        },
        body: JSON.stringify({
          version:
            "9a1427922c7a07ca79cbbb59906551b2d762d01c323ce75692394b151ae71793",
          input: {
            image: imageUrl,
            imageMask: imageMaskUrl,
            prompt: `a ${theme.toLowerCase()} ${room.toLowerCase()}`,
          },
        }),
      },
    );

    const jsonStartResponse = await startResponse.json();

    const endpointUrl = jsonStartResponse.urls.get;

    // GET request to get the status of the image restoration process & return the result when it's ready
    let restoredImage: string | null = null;
    while (!restoredImage) {
      // Loop in 1s intervals until the alt text is ready
      console.log("polling for result...");
      const finalResponse = await fetch(endpointUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + api.REPLICATE_API_KEY,
        },
      });
      const jsonFinalResponse = await finalResponse.json();

      if (jsonFinalResponse.status === "succeeded") {
        restoredImage = jsonFinalResponse.output;
      } else if (jsonFinalResponse.status === "failed") {
        break;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    if (restoredImage === null) {
      return NextResponse.json(
        {
          message: "Failed to restore image",
        },
        {
          status: 400,
        },
      );
    }
    return NextResponse.json(restoredImage);
  } catch (e) {
    return NextResponse.json(
      {
        message: "Failed to restore image",
      },
      {
        status: 400,
      },
    );
  }
}
