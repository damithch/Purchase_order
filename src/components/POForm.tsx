"use client";

import React from "react";
import { PurchaseOrderData, POItemData } from "@/types/po";
import { Plus, Trash2, Building2, Truck, FileText, DollarSign, UserCheck, Sparkles } from "lucide-react";

interface POFormProps {
  data: PurchaseOrderData;
  onChange: (updatedData: PurchaseOrderData) => void;
  onResetSample: () => void;
}

export const POForm: React.FC<POFormProps> = ({ data, onChange, onResetSample }) => {
  const updateField = (field: keyof PurchaseOrderData, value: any) => {
    const updated = { ...data, [field]: value };
    recalculateTotals(updated);
  };

  const updateItem = (index: number, field: keyof POItemData, value: any) => {
    const newItems = [...data.items];
    const item = { ...newItems[index] };

    if (field === "qty" || field === "unitPrice") {
      const qty = field === "qty" ? Number(value) || 0 : item.qty;
      const unitPrice = field === "unitPrice" ? Number(value) || 0 : item.unitPrice;
      item[field] = Number(value) || 0;
      item.total = qty * unitPrice;
    } else {
      (item as any)[field] = value;
    }

    newItems[index] = item;
    const updated = { ...data, items: newItems };
    recalculateTotals(updated);
  };

  const addItem = () => {
    const newItem: POItemData = {
      id: String(Date.now()),
      itemNumber: "",
      description: "",
      qty: 1,
      unitPrice: 0,
      total: 0,
    };
    const updated = { ...data, items: [...data.items, newItem] };
    recalculateTotals(updated);
  };

  const removeItem = (index: number) => {
    if (data.items.length <= 1) return;
    const newItems = data.items.filter((_, i) => i !== index);
    const updated = { ...data, items: newItems };
    recalculateTotals(updated);
  };

  const recalculateTotals = (poData: PurchaseOrderData) => {
    const subtotal = poData.items.reduce((sum, item) => sum + (item.total || 0), 0);
    const tax = Number(poData.tax) || 0;
    const shipping = Number(poData.shipping) || 0;
    const other = Number(poData.other) || 0;
    const total = subtotal + tax + shipping + other;

    onChange({
      ...poData,
      subtotal,
      total,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-8 text-slate-800">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            Purchase Order Editor
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Fill in the details below to update the live purchase order preview.
          </p>
        </div>
        <button
          onClick={onResetSample}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Load Sample Data
        </button>
      </div>

      {/* PO METADATA & CURRENCY */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-emerald-600" />
          Document Metadata
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              PO Number #
            </label>
            <input
              type="text"
              value={data.poNumber}
              onChange={(e) => updateField("poNumber", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Date
            </label>
            <input
              type="text"
              value={data.date}
              onChange={(e) => updateField("date", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Currency Symbol
            </label>
            <select
              value={data.currency}
              onChange={(e) => updateField("currency", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            >
              <option value="₹">₹ (INR / LKR / ₹)</option>
              <option value="LKR">LKR (Sri Lankan Rupee)</option>
              <option value="$">$ (USD)</option>
              <option value="€">€ (EUR)</option>
              <option value="£">£ (GBP)</option>
              <option value="AED">AED (Dirham)</option>
            </select>
          </div>
        </div>
      </div>

      {/* VENDOR & SHIP TO DETAILS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* VENDOR */}
        <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-emerald-600" />
            Vendor Details
          </h3>
          <div className="space-y-2.5">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                Vendor Name
              </label>
              <input
                type="text"
                value={data.vendorName}
                onChange={(e) => updateField("vendorName", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 font-semibold"
                placeholder="POOVA HOLDINGS (PVT) LTD"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                TIN / Tax ID
              </label>
              <input
                type="text"
                value={data.vendorTin}
                onChange={(e) => updateField("vendorTin", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                placeholder="103305721"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                Address
              </label>
              <input
                type="text"
                value={data.vendorAddress}
                onChange={(e) => updateField("vendorAddress", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                placeholder="NO 129/1/A, Highlevel Road, Kirulapona"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  Department
                </label>
                <input
                  type="text"
                  value={data.vendorDept}
                  onChange={(e) => updateField("vendorDept", e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                  placeholder="Sales Department"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                  Email
                </label>
                <input
                  type="email"
                  value={data.vendorEmail}
                  onChange={(e) => updateField("vendorEmail", e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500"
                  placeholder="sales@poovaholdings.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SHIP TO */}
        <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-emerald-600" />
            Ship To Destination
          </h3>
          <div className="space-y-2.5">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                Company Name
              </label>
              <input
                type="text"
                value={data.shipToCompany}
                onChange={(e) => updateField("shipToCompany", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                Address
              </label>
              <input
                type="text"
                value={data.shipToAddress}
                onChange={(e) => updateField("shipToAddress", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                Phone Number
              </label>
              <input
                type="text"
                value={data.shipToPhone}
                onChange={(e) => updateField("shipToPhone", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SHIPPING & REQUISITION BAR */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-emerald-600" />
          Requisition & Shipping Details
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Requisitioner
            </label>
            <input
              type="text"
              value={data.requisitioner}
              onChange={(e) => updateField("requisitioner", e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Ship Via
            </label>
            <input
              type="text"
              value={data.shipVia}
              onChange={(e) => updateField("shipVia", e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              F.O.B.
            </label>
            <input
              type="text"
              value={data.fob}
              onChange={(e) => updateField("fob", e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Shipping Terms
            </label>
            <input
              type="text"
              value={data.shippingTerms}
              onChange={(e) => updateField("shippingTerms", e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* LINE ITEMS TABLE EDITOR */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Order Line Items
          </h3>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Row
          </button>
        </div>

        <div className="space-y-3">
          {data.items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="grid grid-cols-12 gap-2 items-center p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            >
              <div className="col-span-12 sm:col-span-3">
                <label className="block text-[10px] text-slate-500 font-medium sm:hidden">
                  Item #
                </label>
                <input
                  type="text"
                  value={item.itemNumber}
                  onChange={(e) => updateItem(idx, "itemNumber", e.target.value)}
                  placeholder="Item Name / #"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md font-semibold"
                />
              </div>

              <div className="col-span-12 sm:col-span-4">
                <label className="block text-[10px] text-slate-500 font-medium sm:hidden">
                  Description
                </label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(idx, "description", e.target.value)}
                  placeholder="Specs / Description"
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded-md"
                />
              </div>

              <div className="col-span-4 sm:col-span-1">
                <label className="block text-[10px] text-slate-500 font-medium">
                  Qty
                </label>
                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(e) => updateItem(idx, "qty", e.target.value)}
                  className="w-full px-2 py-1.5 text-center border border-slate-300 rounded-md font-medium"
                />
              </div>

              <div className="col-span-4 sm:col-span-2">
                <label className="block text-[10px] text-slate-500 font-medium">
                  Unit Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(idx, "unitPrice", e.target.value)}
                  className="w-full px-2 py-1.5 text-right border border-slate-300 rounded-md font-medium"
                />
              </div>

              <div className="col-span-3 sm:col-span-1 text-right font-bold text-slate-800">
                <span className="block text-[10px] text-slate-500 font-normal sm:hidden">
                  Total
                </span>
                {item.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>

              <div className="col-span-1 text-right">
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  disabled={data.items.length <= 1}
                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md disabled:opacity-30 disabled:hover:bg-transparent"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FINANCIAL ADJUSTMENTS & COMMENTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-200 pt-6">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Comments or Special Instructions
          </label>
          <textarea
            rows={4}
            value={data.comments}
            onChange={(e) => updateField("comments", e.target.value)}
            className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            placeholder="Add payment terms, delivery notes, or special instructions..."
          />
        </div>

        <div className="space-y-3 bg-slate-50 p-4 border border-slate-200 rounded-xl">
          <h4 className="text-xs font-bold text-slate-700 uppercase">
            Summary Adjustments
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Tax ({data.currency})
              </label>
              <input
                type="number"
                value={data.tax}
                onChange={(e) => updateField("tax", Number(e.target.value))}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md text-right"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Shipping ({data.currency})
              </label>
              <input
                type="number"
                value={data.shipping}
                onChange={(e) => updateField("shipping", Number(e.target.value))}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md text-right"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Other ({data.currency})
              </label>
              <input
                type="number"
                value={data.other}
                onChange={(e) => updateField("other", Number(e.target.value))}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md text-right"
              />
            </div>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
            <span>Calculated Total:</span>
            <span className="text-emerald-700 font-extrabold text-base">
              {data.currency} {data.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
