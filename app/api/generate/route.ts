import { NextResponse } from "next/server";
import { api } from "src/env";

export const maxDuration = 10; // 10s is the max for the hobby version
interface Prediction {
  id: string;
  model: string;
  version: string;
  input: {
    [key: string]: string;
  };
  logs: string;
  error: null | string;
  status: "starting" | "processing" | "succeeded" | "failed" | "cancelled";
  created_at: string;
  urls: {
    cancel: string;
    get: string;
  };
}
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

    const jsonStartResponse: Prediction = await startResponse.json();
    if (startResponse.status !== 201) {
      return NextResponse.json(
        { message: jsonStartResponse.error },
        { status: 500 },
      );
    }
    return NextResponse.json(jsonStartResponse, { status: 201 });
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
