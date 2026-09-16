"use client";

import React from "react";
import { PurchaseOrderData } from "@/types/po";

interface POPreviewProps {
  data: PurchaseOrderData;
}

export const POPreview: React.FC<POPreviewProps> = ({ data }) => {
  const parseNum = (val: any) => {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };

  const formatMoney = (amount: number | string) => {
    const val = parseNum(amount);
    if (val === 0) return "-";
    return val.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // We ensure at least 14 rows in table to match standard printed PO sheet layout
  const minRows = 14;
  const displayedItems = [...data.items];
  const emptyRowsCount = Math.max(0, minRows - displayedItems.length);

  return (
    <div
      id="po-document"
      className="w-full max-w-[800px] mx-auto bg-white text-gray-900 p-8 shadow-2xl border border-gray-200 font-sans print:shadow-none print:border-none print:p-0 print:m-0 print:w-full print:max-w-none text-xs leading-tight select-none"
    >
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start mb-6">
        {/* Company Details & Logo */}
        <div className="flex flex-col items-start space-y-2">
          <div className="flex items-center space-x-3">
            {data.companyLogo ? (
              <div className="w-16 h-16 relative flex items-center justify-center overflow-hidden border border-gray-200 rounded-md p-1 bg-white">
                {/* Custom Uploaded Logo */}
                {/* eslint-disable-next-next/no-img-element */}
                <img
                  src={data.companyLogo}
                  alt="Company Logo"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              /* Default Styled Brand Badge */
              <div className="w-16 h-16 relative flex items-center justify-center bg-gradient-to-tr from-orange-600 to-amber-500 rounded-md p-1 shadow">
                <div className="w-full h-full flex flex-col items-center justify-center text-white font-black leading-none">
                  <span className="text-2xl font-serif tracking-tighter">m</span>
                  <span className="text-[7px] tracking-wider uppercase font-semibold">Mobile</span>
                </div>
              </div>
            )}
            <div>
              <h1 className="font-bold text-sm text-gray-900">{data.companyName}</h1>
              {data.companyAddress.split(",").map((line, idx) => (
                <p key={idx} className="text-gray-700 text-[11px]">
                  {line.trim()}
                </p>
              ))}
              <p className="text-gray-700 text-[11px]">
                <span className="font-medium">Phone:</span> {data.companyPhone}
              </p>
            </div>
          </div>
        </div>

        {/* PO Title & Meta */}
        <div className="text-right">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#00a651] uppercase mb-3">
            PURCHASE ORDER
          </h1>
          <div className="inline-block border border-gray-300 rounded overflow-hidden">
            <table className="text-right border-collapse">
              <tbody>
                <tr className="border-b border-gray-300">
                  <td className="bg-gray-50 px-3 py-1 font-bold text-gray-700 border-r border-gray-300 uppercase text-[10px]">
                    DATE
                  </td>
                  <td className="px-4 py-1 text-gray-900 font-semibold text-[11px]">
                    {data.date}
                  </td>
                </tr>
                <tr>
                  <td className="bg-gray-50 px-3 py-1 font-bold text-gray-700 border-r border-gray-300 uppercase text-[10px]">
                    PO #
                  </td>
                  <td className="px-4 py-1 text-gray-900 font-semibold text-[11px]">
                    {data.poNumber}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* VENDOR & SHIP TO TWO-COLUMN GRID */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* VENDOR BOX */}
        <div className="border border-[#00a651] rounded-sm overflow-hidden">
          <div className="bg-[#00a651] text-white font-bold px-3 py-1 uppercase text-[11px] tracking-wide">
            VENDOR
          </div>
          <div className="p-2.5 min-h-[90px] text-[11px] space-y-0.5">
            <p className="font-bold text-gray-900 uppercase">{data.vendorName}</p>
            {data.vendorTin && (
              <p className="text-gray-800">
                <span className="font-semibold">TIN :</span> {data.vendorTin}
              </p>
            )}
            <p className="text-gray-800">{data.vendorAddress}</p>
            {data.vendorDept && <p className="text-gray-800">{data.vendorDept}</p>}
            {data.vendorEmail && (
              <p className="text-blue-700 underline font-medium">
                {data.vendorEmail}
              </p>
            )}
          </div>
        </div>

        {/* SHIP TO BOX */}
        <div className="border border-[#00a651] rounded-sm overflow-hidden">
          <div className="bg-[#00a651] text-white font-bold px-3 py-1 uppercase text-[11px] tracking-wide">
            SHIP TO
          </div>
          <div className="p-2.5 min-h-[90px] text-[11px] space-y-0.5">
            <p className="font-bold text-gray-900">{data.shipToCompany}</p>
            {data.shipToAddress.split(",").map((line, idx) => (
              <p key={idx} className="text-gray-800">
                {line.trim()}
              </p>
            ))}
            <p className="text-gray-800">
              <span className="font-semibold">Phone:</span> {data.shipToPhone}
            </p>
          </div>
        </div>
      </div>

      {/* REQUISITION / SHIPPING TERMS BAR */}
      <div className="border border-[#00a651] rounded-sm overflow-hidden mb-4">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-[#00a651] text-white font-bold text-[10px] uppercase">
              <th className="w-1/4 py-1 px-2 border-r border-emerald-400">REQUISITIONER</th>
              <th className="w-1/4 py-1 px-2 border-r border-emerald-400">SHIP VIA</th>
              <th className="w-1/4 py-1 px-2 border-r border-emerald-400">F.O.B.</th>
              <th className="w-1/4 py-1 px-2">SHIPPING TERMS</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-[11px] text-gray-800 h-6">
              <td className="py-1 px-2 border-r border-gray-300">{data.requisitioner || "\u00A0"}</td>
              <td className="py-1 px-2 border-r border-gray-300">{data.shipVia || "\u00A0"}</td>
              <td className="py-1 px-2 border-r border-gray-300">{data.fob || "\u00A0"}</td>
              <td className="py-1 px-2">{data.shippingTerms || "\u00A0"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ITEMS TABLE */}
      <div className="border border-[#00a651] rounded-sm overflow-hidden mb-4">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="bg-[#00a651] text-white font-bold text-[10px] uppercase">
              <th className="py-1.5 px-3 text-left w-[22%] border-r border-emerald-400">
                ITEM #
              </th>
              <th className="py-1.5 px-3 text-left w-[44%] border-r border-emerald-400">
                DESCRIPTION
              </th>
              <th className="py-1.5 px-3 text-center w-[10%] border-r border-emerald-400">
                QTY
              </th>
              <th className="py-1.5 px-3 text-right w-[12%] border-r border-emerald-400">
                UNIT PRICE
              </th>
              <th className="py-1.5 px-3 text-right w-[12%]">
                TOTAL
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayedItems.map((item, idx) => (
              <tr key={item.id || idx} className="h-7 hover:bg-gray-50">
                <td className="py-1 px-3 border-r border-gray-300 font-semibold text-gray-900">
                  {item.itemNumber}
                </td>
                <td className="py-1 px-3 border-r border-gray-300 text-gray-800">
                  {item.description}
                </td>
                <td className="py-1 px-3 border-r border-gray-300 text-center text-gray-900 font-medium">
                  {item.qty !== "" && item.qty !== undefined ? item.qty : ""}
                </td>
                <td className="py-1 px-3 border-r border-gray-300 text-right text-gray-900">
                  {formatMoney(item.unitPrice)}
                </td>
                <td className="py-1 px-3 text-right font-medium text-gray-900">
                  {formatMoney(item.total)}
                </td>
              </tr>
            ))}
            {/* Fill empty grid lines to preserve full page structure */}
            {Array.from({ length: emptyRowsCount }).map((_, idx) => (
              <tr key={`empty-${idx}`} className="h-6">
                <td className="border-r border-gray-300 px-3">&nbsp;</td>
                <td className="border-r border-gray-300 px-3">&nbsp;</td>
                <td className="border-r border-gray-300 px-3">&nbsp;</td>
                <td className="border-r border-gray-300 px-3">&nbsp;</td>
                <td className="px-3 text-right text-gray-400 font-sans">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* COMMENTS AND TOTALS BOTTOM SECTION */}
      <div className="grid grid-cols-12 gap-4 items-start mb-8">
        {/* Comments Box (Left side 7 cols) */}
        <div className="col-span-7">
          <div className="border border-[#00a651] rounded-sm overflow-hidden min-h-[110px]">
            <div className="bg-[#00a651] text-white font-bold px-3 py-1 text-[11px] uppercase">
              Comments or Special Instructions
            </div>
            <div className="p-2 text-[11px] text-gray-700 whitespace-pre-line">
              {data.comments || ""}
            </div>
          </div>
        </div>

        {/* Financial Totals (Right side 5 cols) */}
        <div className="col-span-5">
          <table className="w-full text-[11px] font-medium border-collapse">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-1 px-2 font-bold text-gray-700 uppercase">SUBTOTAL</td>
                <td className="py-1 px-2 text-right font-semibold text-gray-900">
                  {formatMoney(data.subtotal)}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1 px-2 font-bold text-gray-700 uppercase">TAX</td>
                <td className="py-1 px-2 text-right text-gray-800">
                  {formatMoney(data.tax)}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1 px-2 font-bold text-gray-700 uppercase">SHIPPING</td>
                <td className="py-1 px-2 text-right text-gray-800">
                  {formatMoney(data.shipping)}
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-1 px-2 font-bold text-gray-700 uppercase">OTHER</td>
                <td className="py-1 px-2 text-right text-gray-800">
                  {formatMoney(data.other)}
                </td>
              </tr>
              {/* Highlighted Yellow Total Row */}
              <tr className="bg-[#ffc107] text-gray-950 font-extrabold border-t-2 border-amber-500">
                <td className="py-2 px-3 text-[12px] uppercase">TOTAL</td>
                <td className="py-2 px-3 text-right text-[13px] tracking-tight">
                  <span className="mr-1 font-bold">{data.currency}</span>
                  {parseNum(data.total).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER CONTACT LINE */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center text-gray-600 text-[11px]">
        If you have any questions about this purchase order, please contact
        <br />
        <span className="font-semibold text-gray-800">{data.contactInfo || "[Name, Phone #, E-mail]"}</span>
      </div>
    </div>
  );
};
