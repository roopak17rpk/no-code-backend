/**
 * write a simple node api in next.js so that while hitting it
 * i get a response json object having storeid store name store onwer information
 * with correct error handling
 *
 */

import { NextRequest, NextResponse } from "next/server";
import { getStoreInfo } from "./getStoreInfo";
import { getAllNotes } from "@/app/database";

export async function POST(req: NextRequest) {
  try {
    const { subdomain }: { subdomain: string } = await req.json();

    if (!subdomain || typeof subdomain !== "string") {
      return NextResponse.json({ error: "Invalid subdomain" }, { status: 400 });
    }

    const store = await getStoreInfo(subdomain);
    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const notes = await getAllNotes();

    return NextResponse.json({ store, notes }, { status: 200 });
  } catch (error) {
    console.error("Error in getStoreBySubdomain:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
