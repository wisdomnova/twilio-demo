// ./app/api/messages/route.ts
import { NextResponse } from 'next/server';

// In-memory storage (for demo - use database in production)
let storedMessages: any[] = [];

export async function GET() {
  return NextResponse.json(storedMessages);
}

export async function POST(request: Request) {
  const message = await request.json();
  storedMessages.unshift(message); // Add to beginning of array
  return NextResponse.json({ success: true });
}