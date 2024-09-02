/**
 * write a next.js GET function to get store by id
 */

import { getStoreById } from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

const ERROR_MESSAGES = {
  INVALID_ID: "Invalid or missing store ID. Must be a number.",
  STORE_NOT_FOUND: "Store not found",
  UNEXPECTED_ERROR: "An unexpected error occurred"
};

export async function POST(req: NextRequest) {
  try {
    const { store_id } = await req.json();

    if (!store_id || typeof store_id !== 'number') {
      return NextResponse.json({ error: ERROR_MESSAGES.INVALID_ID }, { status: 400 });
    }

    const store = await getStoreById(store_id);

    if (!store) {
      return NextResponse.json({ error: ERROR_MESSAGES.STORE_NOT_FOUND }, { status: 404 });
    }

    return NextResponse.json(store, { status: 200 });
  } catch (error) {
    console.error("Error in getStoreById:", error);
    return NextResponse.json(
      { error: ERROR_MESSAGES.UNEXPECTED_ERROR },
      { status: 500 }
    );
  }
}
