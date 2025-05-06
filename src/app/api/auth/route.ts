// src/app/api/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import { mockUsers } from "@/lib/data/mock-data";

export async function POST(request: NextRequest) {
  try {
    const { role } = await request.json();

    // Find a user with the selected role
    const user = mockUsers.find((user) => user.role === role);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // In a real app, you would generate JWT tokens here
    // For demo purposes, we'll just return the user object
    return NextResponse.json({
      user,
      success: true,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
