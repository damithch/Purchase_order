"use client";

import React, { useRef } from "react";
import { PurchaseOrderData, POItemData } from "@/types/po";
import { Plus, Trash2, Building2, Truck, FileText, DollarSign, UserCheck, Sparkles, Upload, Image as ImageIcon, X, CreditCard, Calendar } from "lucide-react";

interface POFormProps {
  data: PurchaseOrderData;
  onChange: (updatedData: PurchaseOrderData) => void;
  onResetSample: () => void;
}

export const POForm: React.FC<POFormProps> = ({ data, onChange, onResetSample }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseNum = (val: any) => {
    if (val === "" || val === undefined || val === null) return 0;
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
  };

  const updateField = (field: keyof PurchaseOrderData, value: any) => {
    const updated = { ...data, [field]: value };
    recalculateTotals(updated);
  };

  const updateItem = (index: number, field: keyof POItemData, value: any) => {
    const newItems = [...data.items];
    const item = { ...newItems[index] };

    (item as any)[field] = value;

    if (field === "qty" || field === "unitPrice") {
      const qty = parseNum(field === "qty" ? value : item.qty);
      const unitPrice = parseNum(field === "unitPrice" ? value : item.unitPrice);
      item.total = qty * unitPrice;
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be under 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        updateField("companyLogo", event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    updateField("companyLogo", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const recalculateTotals = (poData: PurchaseOrderData) => {
    const subtotal = poData.items.reduce((sum, item) => sum + (parseNum(item.total) || 0), 0);
    const tax = parseNum(poData.tax);
    const shipping = parseNum(poData.shipping);
    const other = parseNum(poData.other);
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

      {/* LOGO & COMPANY INFO */}
      <div className="space-y-4 bg-slate-50/70 p-4 border border-slate-200 rounded-xl">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
          <ImageIcon className="w-4 h-4 text-emerald-600" />
          Company Header &amp; Logo
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Logo Uploader / Preview */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-white border border-slate-200 rounded-lg space-y-2">
            {data.companyLogo ? (
              <div className="relative group w-24 h-20 flex items-center justify-center border border-slate-200 rounded overflow-hidden p-1 bg-white">
                {/* eslint-disable-next-next/no-img-element */}
                <img
                  src={data.companyLogo}
                  alt="Company Logo Preview"
                  className="max-w-full max-h-full object-contain"
                />
                <button
                  type="button"
                  onClick={clearLogo}
                  className="absolute top-1 right-1 bg-rose-600 text-white p-1 rounded-full opacity-80 hover:opacity-100 shadow transition-opacity"
                  title="Remove Logo"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="w-full text-center py-3">
                <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                <span className="text-[11px] text-slate-400 block font-medium">Default Logo Active</span>
              </div>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              accept="image/png, image/jpeg, image/webp, image/svg+xml"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md border border-slate-300 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-600" />
              Upload Company Logo
            </button>
          </div>

          {/* Company Text Fields */}
          <div className="md:col-span-8 space-y-2.5">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                Company Name
              </label>
              <input
                type="text"
                value={data.companyName}
                onChange={(e) => updateField("companyName", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500 font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                Company Address
              </label>
              <input
                type="text"
                value={data.companyAddress}
                onChange={(e) => updateField("companyAddress", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                Company Phone
              </label>
              <input
                type="text"
                value={data.companyPhone}
                onChange={(e) => updateField("companyPhone", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* PO METADATA & CURRENCY */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-emerald-600" />
          Document Metadata &amp; Currency
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
              Currency
            </label>
            <select
              value={data.currency}
              onChange={(e) => updateField("currency", e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white font-semibold text-emerald-800"
            >
              <option value="LKR">LKR (Sri Lankan Rupee)</option>
              <option value="Rs.">Rs. (Rupees)</option>
              <option value="₹">₹ (INR / ₹)</option>
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

      {/* PAYMENT TYPE & CREDIT SETTLEMENT TERMS */}
      <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
          <CreditCard className="w-4 h-4 text-emerald-600" />
          Transaction Payment &amp; Credit Terms
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          {/* Payment Type Toggle */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Transaction Payment Type
            </label>
            <div className="grid grid-cols-2 gap-2 bg-white p-1 border border-slate-300 rounded-lg">
              <button
                type="button"
                onClick={() => updateField("paymentType", "CASH")}
                className={`py-1.5 px-3 text-xs font-bold rounded-md transition-all ${
                  data.paymentType === "CASH"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                💵 CASH
              </button>
              <button
                type="button"
                onClick={() => updateField("paymentType", "CREDIT")}
                className={`py-1.5 px-3 text-xs font-bold rounded-md transition-all ${
                  data.paymentType === "CREDIT"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                💳 CREDIT
              </button>
            </div>
          </div>

          {/* Credit Settlement Days (Visible when CREDIT is selected) */}
          {data.paymentType === "CREDIT" ? (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                Credit Settlement Days
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  value={data.creditDays !== undefined ? data.creditDays : 30}
                  onChange={(e) => updateField("creditDays", e.target.value)}
                  placeholder="30"
                  className="w-28 px-3 py-1.5 text-sm font-extrabold text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                />
                <span className="text-xs font-semibold text-slate-600">Days</span>

                {/* Preset Days Pills */}
                <div className="flex items-center gap-1">
                  {[15, 30, 60, 90].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => updateField("creditDays", d)}
                      className={`px-2 py-1 text-[11px] font-semibold rounded border transition-colors ${
                        String(data.creditDays) === String(d)
                          ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-medium py-2">
              <span className="text-emerald-700 font-semibold">Cash Payment Selected:</span> Immediate settlement upon receipt.
            </div>
          )}
        </div>
      </div>

      {/* SHIPPING & REQUISITION BAR */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-emerald-600" />
          Requisition &amp; Shipping Details
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
                  type="text"
                  inputMode="numeric"
                  value={item.qty}
                  onChange={(e) => updateItem(idx, "qty", e.target.value)}
                  className="w-full px-2 py-1.5 text-center border border-slate-300 rounded-md font-medium"
                />
              </div>

              <div className="col-span-4 sm:col-span-2">
                <label className="block text-[10px] text-slate-500 font-medium">
                  Unit Price ({data.currency})
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={item.unitPrice}
                  onChange={(e) => updateItem(idx, "unitPrice", e.target.value)}
                  placeholder="27081.00"
                  className="w-full px-2 py-1.5 text-right border border-slate-300 rounded-md font-medium"
                />
              </div>

              <div className="col-span-3 sm:col-span-1 text-right font-bold text-slate-800">
                <span className="block text-[10px] text-slate-500 font-normal sm:hidden">
                  Total
                </span>
                {parseNum(item.total).toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
                type="text"
                inputMode="decimal"
                value={data.tax}
                onChange={(e) => updateField("tax", e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md text-right"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Shipping ({data.currency})
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={data.shipping}
                onChange={(e) => updateField("shipping", e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md text-right"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Other ({data.currency})
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={data.other}
                onChange={(e) => updateField("other", e.target.value)}
                className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-md text-right"
              />
            </div>
          </div>
          <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold text-slate-900">
            <span>Calculated Total:</span>
            <span className="text-emerald-700 font-extrabold text-base">
              {data.currency} {parseNum(data.total).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
