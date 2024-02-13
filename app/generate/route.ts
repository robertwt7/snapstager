import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "../../src/services";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { api } from "src/env";

// Create a new ratelimiter, that allows 5 requests per 24 hours
const ratelimit = redis
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.fixedWindow(5, "1440 m"),
      analytics: true,
    })
  : undefined;

export async function POST(request: Request) {
  // Rate Limiter Code
  if (ratelimit) {
    const headersList = headers();
    const ipIdentifier = headersList.get("x-real-ip");

    const result = await ratelimit.limit(ipIdentifier ?? "");

    if (!result.success) {
      return new Response(
        "Too many uploads in 1 day. Please try again in a 24 hours.",
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": result.limit,
            "X-RateLimit-Remaining": result.remaining,
          } as any,
        },
      );
    }
  }

  const { imageUrl, imageMaskUrl, theme, room } = await request.json();

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
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return NextResponse.json(
    restoredImage ? restoredImage : "Failed to restore image",
  );
}
