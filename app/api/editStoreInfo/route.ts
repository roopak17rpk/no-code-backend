import { editStoreInfo } from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

type editStoreInfoRequestType = {
  store_id: number;
  store_name: string | null;
  owner_name: string | null;
};

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { store_id, store_name = null, owner_name = null }: editStoreInfoRequestType = body;

  if (!body) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  if (!store_id || typeof store_id !== "number") {
    return NextResponse.json(
      { error: "Invalid store ID" },
      { status: 400 }
    );
  }

  const editStoreInfoParams = {
    storeId: store_id,
    storeName: store_name,
    ownerName: owner_name,
  };

  const updatedStoreData = await editStoreInfo(editStoreInfoParams);

  return NextResponse.json(updatedStoreData, { status: 200 });
}
