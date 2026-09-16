import { NextResponse } from "next/server";
import { getSavedPurchaseOrders, savePurchaseOrderRecord } from "@/lib/dbStore";

export async function GET() {
  try {
    const orders = getSavedPurchaseOrders();
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    console.error("GET /api/po error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const saved = savePurchaseOrderRecord(body);
    return NextResponse.json({ success: true, data: saved });
  } catch (error: any) {
    console.error("POST /api/po error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
