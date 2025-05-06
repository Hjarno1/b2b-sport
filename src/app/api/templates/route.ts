import { NextResponse } from "next/server";
import { mockAgreementTemplates } from "@/lib/data/mock-data";

export async function GET() {
  return NextResponse.json(mockAgreementTemplates);
}
