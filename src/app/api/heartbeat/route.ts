import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Query database to prevent Supabase inactivity pausing
    await prisma.country.findFirst();
    
    return NextResponse.json({ 
      status: "active", 
      database: "healthy",
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json({ 
      status: "error", 
      message: err.message 
    }, { status: 500 });
  }
}
