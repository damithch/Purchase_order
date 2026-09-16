"use client";

import React, { useState } from "react";
import { PurchaseOrderData } from "@/types/po";
import { Printer, Download, Save, PlusCircle, Check, Loader2 } from "lucide-react";

interface POToolbarProps {
  data: PurchaseOrderData;
  onSave?: (data: PurchaseOrderData) => Promise<void>;
  onNewPO?: () => void;
}

export const POToolbar: React.FC<POToolbarProps> = ({ data, onSave, onNewPO }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    try {
      setIsExportingPdf(true);
      const element = document.getElementById("po-document");
      if (!element) return;

      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      pdf.save(`PO-${data.poNumber || "document"}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
      alert("Print mode triggered as fallback for PDF generation.");
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleSaveToDb = async () => {
    if (!onSave) return;
    try {
      setIsSaving(true);
      await onSave(data);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 text-white px-6 py-4 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-4 print:hidden">
      <div className="flex items-center space-x-3">
        <div className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg">
          <Printer className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-tight">Purchase Order #{data.poNumber}</h3>
          <p className="text-xs text-slate-400">Total: {data.currency} {data.total.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {onNewPO && (
          <button
            onClick={onNewPO}
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            New PO
          </button>
        )}

        <button
          onClick={handlePrint}
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
        >
          <Printer className="w-4 h-4 text-sky-400" />
          Print
        </button>

        <button
          onClick={handleExportPDF}
          disabled={isExportingPdf}
          type="button"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700 disabled:opacity-50"
        >
          {isExportingPdf ? (
            <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
          ) : (
            <Download className="w-4 h-4 text-amber-400" />
          )}
          Download PDF
        </button>

        {onSave && (
          <button
            onClick={handleSaveToDb}
            disabled={isSaving}
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saveSuccess ? "Saved!" : "Save to Database"}
          </button>
        )}
      </div>
    </div>
  );
};
