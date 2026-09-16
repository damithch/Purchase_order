"use client";

import React, { useState } from "react";
import { INITIAL_PO_DATA, PurchaseOrderData } from "@/types/po";
import { POPreview } from "@/components/POPreview";
import { POForm } from "@/components/POForm";
import { POToolbar } from "@/components/POToolbar";
import { POHistoryModal } from "@/components/POHistoryModal";
import {
  FileCheck,
  History,
  Database,
  Edit3,
  Eye,
  PlusCircle,
  Sparkles,
  Layers,
  ArrowRight
} from "lucide-react";

export default function Home() {
  const [poData, setPoData] = useState<PurchaseOrderData>(INITIAL_PO_DATA);
  const [activeTab, setActiveTab] = useState<"split" | "editor" | "preview">("split");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleResetSample = () => {
    setPoData(INITIAL_PO_DATA);
  };

  const handleNewPO = () => {
    setPoData({
      ...INITIAL_PO_DATA,
      poNumber: String(Math.floor(1000 + Math.random() * 9000)),
      date: new Date().toLocaleDateString("en-US"),
      items: [
        {
          id: String(Date.now()),
          itemNumber: "",
          description: "",
          qty: 1,
          unitPrice: 0,
          total: 0,
        },
      ],
      subtotal: 0,
      total: 0,
    });
  };

  const handleSaveToDb = async (dataToSave: PurchaseOrderData) => {
    const res = await fetch("/api/po", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSave),
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error || "Failed to save Purchase Order");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* NAVBAR */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-900/30">
              <FileCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-white">
                  Purchase Order Studio
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Next.js App
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Mobile Miracles Purchase Order Generator
              </p>
            </div>
          </div>

          {/* Right Nav Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
            >
              <History className="w-4 h-4 text-emerald-400" />
              History &amp; Saved POs
            </button>

            <button
              onClick={handleNewPO}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              New PO
            </button>
          </div>
        </div>
      </header>

      {/* DB STATUS BANNER */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 text-xs text-slate-400 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              Local Database active.
            </span>
            <span className="text-slate-500 hidden sm:inline">
              When you share your database connection URL, update <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-400 font-mono text-[11px]">.env</code> to connect directly to your cloud DB.
            </span>
          </div>
          <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1 text-[11px] font-medium">
            <button
              onClick={() => setActiveTab("split")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeTab === "split" ? "bg-slate-700 text-white font-semibold" : "text-slate-400 hover:text-white"
              }`}
            >
              <Layers className="w-3 h-3 inline mr-1" />
              Split View
            </button>
            <button
              onClick={() => setActiveTab("editor")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeTab === "editor" ? "bg-slate-700 text-white font-semibold" : "text-slate-400 hover:text-white"
              }`}
            >
              <Edit3 className="w-3 h-3 inline mr-1" />
              Editor Only
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                activeTab === "preview" ? "bg-slate-700 text-white font-semibold" : "text-slate-400 hover:text-white"
              }`}
            >
              <Eye className="w-3 h-3 inline mr-1" />
              Preview Only
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* TOOLBAR */}
        <POToolbar data={poData} onSave={handleSaveToDb} onNewPO={handleNewPO} />

        {/* WORKSPACE GRID */}
        <div
          className={`grid gap-6 ${
            activeTab === "split"
              ? "grid-cols-1 lg:grid-cols-12"
              : "grid-cols-1"
          }`}
        >
          {/* EDITOR COLUMN */}
          {(activeTab === "split" || activeTab === "editor") && (
            <div className={activeTab === "split" ? "lg:col-span-6" : "w-full"}>
              <POForm
                data={poData}
                onChange={setPoData}
                onResetSample={handleResetSample}
              />
            </div>
          )}

          {/* PREVIEW COLUMN */}
          {(activeTab === "split" || activeTab === "preview") && (
            <div
              className={`${
                activeTab === "split" ? "lg:col-span-6" : "w-full"
              } flex flex-col items-center justify-start bg-slate-900/60 p-4 sm:p-6 rounded-xl border border-slate-800 overflow-x-auto`}
            >
              <div className="w-full mb-3 flex items-center justify-between text-xs text-slate-400 print:hidden">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  Document Preview (Matches Template)
                </span>
                <span className="text-[11px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                  Ready for Print / PDF
                </span>
              </div>
              <POPreview data={poData} />
            </div>
          )}
        </div>
      </main>

      {/* HISTORY MODAL */}
      <POHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectPO={(selected) => setPoData(selected)}
      />
    </div>
  );
}
