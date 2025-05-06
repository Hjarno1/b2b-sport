import { NextResponse } from "next/server";
import {
  mockActivities,
  mockClubs,
  mockAgreements,
  mockUsers,
} from "@/lib/data/mock-data";

export async function GET() {
  const recentActivities = mockActivities.slice(0, 5);
  const activeClubs = mockClubs.filter(
    (club) => club.status === "Active"
  ).length;
  const pendingAgreements = mockAgreements.filter(
    (agreement) => agreement.status === "Pending"
  ).length;
  const totalClubAdmins = mockUsers.filter(
    (user) => user.role === "Club Admin"
  ).length;

  return NextResponse.json({
    recentActivities,
    stats: {
      activeClubs,
      pendingAgreements,
      totalClubAdmins,
      ordersThisMonth: 23, // Mock static number for demo
    },
  });
}
