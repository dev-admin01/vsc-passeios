// app/api/hello/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "GET: Hello from the App Router!" });
}

export async function POST(request: NextRequest) {
  // If you need the request body:
  const body = await request.json();

  return NextResponse.json({
    message: "POST: Hello from the App Router!",
    received: body,
  });
}
