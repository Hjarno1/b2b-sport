import { NextResponse } from "next/server";
import { mockClubs } from "@/lib/data/mock-data";

export async function GET() {
  return NextResponse.json(mockClubs);
}
