"use client";

import React, { useEffect, useState } from "react";
import { PurchaseOrderData } from "@/types/po";
import { History, Eye, X, Loader2, Calendar, DollarSign, Building } from "lucide-react";

interface POHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPO: (po: PurchaseOrderData) => void;
}

export const POHistoryModal: React.FC<POHistoryModalProps> = ({ isOpen, onClose, onSelectPO }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/po");
      const json = await res.json();
      if (json.success) {
        setOrders(json.data || []);
      }
    } catch (err) {
      console.error("Failed to load PO history:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
            <History className="w-5 h-5 text-emerald-600" />
            Purchase Order Records
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-500">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              <p className="text-sm font-medium">Loading saved purchase orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <History className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">No saved purchase orders yet</p>
              <p className="text-xs text-slate-400">
                Generate a PO and click &quot;Save to Database&quot; to store your records.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {orders.map((po) => (
                <div
                  key={po.id}
                  className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/40 transition-all group cursor-pointer"
                  onClick={() => {
                    onSelectPO(po);
                    onClose();
                  }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-slate-900 text-sm">
                        PO #{po.poNumber}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                        {po.status || "ISSUED"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {po.vendorName || "No Vendor"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {po.date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-medium">Total</span>
                      <span className="font-bold text-slate-900 text-sm flex items-center justify-end gap-0.5">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                        {po.currency} {po.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <button
                      className="p-2 text-slate-400 group-hover:text-emerald-600 group-hover:bg-white rounded-lg shadow-sm border border-transparent group-hover:border-emerald-200 transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
