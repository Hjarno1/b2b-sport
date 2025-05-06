import { NextResponse } from "next/server";
import { mockAgreements } from "@/lib/data/mock-data";

export async function GET() {
  return NextResponse.json(mockAgreements);
}
