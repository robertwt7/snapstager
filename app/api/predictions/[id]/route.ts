import { NextResponse } from "next/server";
import { api } from "src/env";

export const dynamic = "force-dynamic";
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
  output: string | Array<string>;
  started_at: string;
  completed_at: string;
  metrics: {
    predict_time: number;
  };
}
export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(
      "https://api.replicate.com/v1/predictions/" + params.id,
      {
        headers: {
          Authorization: `Token ${api.REPLICATE_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
    const result: Prediction = await response.json();
    if (response.status !== 200 || result.status === "failed") {
      return NextResponse.json({ message: result.error }, { status: 500 });
    }

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { message: "Failed to get prediction" },
      { status: 500 },
    );
  }
}
