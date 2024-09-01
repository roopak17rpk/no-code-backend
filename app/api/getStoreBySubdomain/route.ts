/**
 * write a simple node api in next.js so that while hitting it 
 * i get a response json object having storeid store name store onwer information
 * with correct error handling
 * 
 */

import { NextRequest, NextResponse } from 'next/server';
import { getStoreInfo } from './getStoreInfo';

export async function POST(req: NextRequest) {
    try {
        const { subdomain } = await req.json();
        const store = await getStoreInfo(subdomain as string);
        return NextResponse.json(store, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}