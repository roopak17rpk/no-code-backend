import { createStore } from "@/app/database";
import { NextRequest, NextResponse } from "next/server";

function generateRandomDomainName(storeName: string): string {
  const domains = ["example", "test", "demo", "sample", "mystore"];
  const tlds = [".com", ".net", ".org", ".io", ".co"];

  const randomDomain = domains[Math.floor(Math.random() * domains.length)];
  const randomTld = tlds[Math.floor(Math.random() * tlds.length)];

  return `www.${storeName}.${randomDomain}${randomTld}`;
}

type createStoreRequestType = {
  storeName: string;
  storeOwnerInfo: {
    name: string;
  };
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { storeName, storeOwnerInfo }: createStoreRequestType = body;
    console.log(body);
    if (
      (storeOwnerInfo && typeof storeName !== "string") ||
      typeof storeOwnerInfo !== "object" ||
      typeof storeOwnerInfo.name !== "string"
    ) {
      return NextResponse.json(
        { error: "Params are not of correct type" },
        { status: 400 }
      );
    }
    let result;
    try {
      result = await createStore(
        storeName,
        storeOwnerInfo,
        generateRandomDomainName(storeName)
      );
    } catch (error) {
      console.error("Error creating store:", error);
      return NextResponse.json(
        { error: "Failed to create store" },
        { status: 400 }
      );
    }
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
