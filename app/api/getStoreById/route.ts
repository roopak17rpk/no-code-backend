/**
 * Next.js API route handler for getting a store by ID
 * This module provides a POST endpoint to retrieve store information based on the provided store ID
 */

import { getStoreById } from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

const ERROR_MESSAGES = {
  INVALID_ID: "Invalid or missing store ID. Must be a number.",
  STORE_NOT_FOUND: "Store not found",
  UNEXPECTED_ERROR: "An unexpected error occurred"
};

/**
 * Validates the store ID from the request body
 * @param {any} store_id - The store ID to validate
 * @returns {boolean} True if the store ID is valid, false otherwise
 */
function isValidStoreId(store_id: any): boolean {
  return store_id && typeof store_id === 'number';
}

/**
 * Handles the POST request to get store information by ID
 * @param {NextRequest} req - The incoming request object
 * @returns {Promise<NextResponse>} The response containing store information or error message
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { store_id } = await req.json();

    if (!isValidStoreId(store_id)) {
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
