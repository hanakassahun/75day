import { db } from "@/lib/db";
import { users } from "@/src/db/schema";
import { count } from "drizzle-orm";
import { NextResponse } from "next/server";

export const revalidate = 900; // Cache database query for 15 minutes

export async function GET() {
  try {
    const [result] = await db.select({ total: count() }).from(users);
    return NextResponse.json({ total: result.total });
  } catch (error) {
    return NextResponse.json({ total: 0 }, { status: 500 });
  }
}
