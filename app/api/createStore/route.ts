import { createStore } from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, contents } = await req.json();
    if (typeof title !== "string" || typeof contents !== "string") {
      return NextResponse.json(
        { error: "Params are not of correct type" },
        { status: 400 }
      );
    }
    const result = await createStore(title, contents);
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}
