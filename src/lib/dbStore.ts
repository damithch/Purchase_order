import fs from "fs";
import path from "path";
import { PurchaseOrderData } from "@/types/po";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function ensureDbExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

export function getSavedPurchaseOrders(): PurchaseOrderData[] {
  try {
    ensureDbExists();
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data) || [];
  } catch (err) {
    console.error("Failed to read db.json:", err);
    return [];
  }
}

export function savePurchaseOrderRecord(po: PurchaseOrderData): PurchaseOrderData {
  try {
    ensureDbExists();
    const orders = getSavedPurchaseOrders();
    const existingIdx = orders.findIndex((o) => o.poNumber === po.poNumber);

    const recordWithId = {
      ...po,
      id: po.id || String(Date.now()),
    };

    if (existingIdx >= 0) {
      orders[existingIdx] = recordWithId;
    } else {
      orders.unshift(recordWithId);
    }

    fs.writeFileSync(DB_FILE, JSON.stringify(orders, null, 2), "utf-8");
    return recordWithId;
  } catch (err) {
    console.error("Failed to write to db.json:", err);
    throw err;
  }
}
