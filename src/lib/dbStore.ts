import { PurchaseOrderData } from "@/types/po";

// In-memory fallback for serverless environments (Vercel)
// where the filesystem is read-only at runtime.
let inMemoryStore: PurchaseOrderData[] = [];

function isServerlessEnv(): boolean {
  return !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
}

function getFileStore(): { read: () => PurchaseOrderData[]; write: (data: PurchaseOrderData[]) => void } | null {
  if (isServerlessEnv()) return null;

  try {
    const fs = require("fs");
    const path = require("path");
    const DATA_DIR = path.join(process.cwd(), "data");
    const DB_FILE = path.join(DATA_DIR, "db.json");

    return {
      read: () => {
        if (!fs.existsSync(DATA_DIR)) {
          fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        if (!fs.existsSync(DB_FILE)) {
          fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), "utf-8");
        }
        const data = fs.readFileSync(DB_FILE, "utf-8");
        return JSON.parse(data) || [];
      },
      write: (data: PurchaseOrderData[]) => {
        if (!fs.existsSync(DATA_DIR)) {
          fs.mkdirSync(DATA_DIR, { recursive: true });
        }
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
      },
    };
  } catch {
    return null;
  }
}

export function getSavedPurchaseOrders(): PurchaseOrderData[] {
  try {
    const fileStore = getFileStore();
    if (fileStore) {
      return fileStore.read();
    }
    return [...inMemoryStore];
  } catch (err) {
    console.error("Failed to read purchase orders:", err);
    return [...inMemoryStore];
  }
}

export function savePurchaseOrderRecord(po: PurchaseOrderData): PurchaseOrderData {
  try {
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

    const fileStore = getFileStore();
    if (fileStore) {
      fileStore.write(orders);
    } else {
      // Serverless: update in-memory store
      inMemoryStore = orders;
    }

    return recordWithId;
  } catch (err) {
    console.error("Failed to write purchase order:", err);
    throw err;
  }
}
