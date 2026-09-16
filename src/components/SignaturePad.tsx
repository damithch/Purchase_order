"use client";

import React, { useRef, useState, useEffect } from "react";
import { PenTool, Upload, Type, Eraser, Check, X } from "lucide-react";

interface SignaturePadProps {
  signatureImage?: string;
  signatoryName?: string;
  signatoryTitle?: string;
  onSave: (data: { signatureImage: string; signatoryName: string; signatoryTitle: string }) => void;
  onClear: () => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  signatureImage,
  signatoryName = "",
  signatoryTitle = "",
  onSave,
  onClear,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState<"draw" | "upload" | "type">("draw");
  const [name, setName] = useState(signatoryName);
  const [title, setTitle] = useState(signatoryTitle);
  const [typedText, setTypedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(signatoryName);
    setTitle(signatoryTitle);
  }, [signatoryName, signatoryTitle]);

  useEffect(() => {
    if (mode === "draw") {
      initCanvas();
    }
  }, [mode]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    saveCurrentCanvas();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setTypedText("");
    onClear();
  };

  const saveCurrentCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      onSave({
        signatureImage: dataUrl,
        signatoryName: name,
        signatoryTitle: title,
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgUrl = event.target?.result as string;
        onSave({
          signatureImage: imgUrl,
          signatoryName: name,
          signatoryTitle: title,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const generateTypedSignature = (text: string) => {
    setTypedText(text);
    if (!text.trim()) return;

    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 120;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "italic bold 36px 'Brush Script MT', cursive, Georgia, serif";
    ctx.fillStyle = "#0f172a";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const dataUrl = canvas.toDataURL("image/png");
    onSave({
      signatureImage: dataUrl,
      signatoryName: name || text,
      signatoryTitle: title,
    });
  };

  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
          <PenTool className="w-4 h-4 text-emerald-600" />
          E-Signature &amp; Authorization
        </h4>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setMode("draw")}
            className={`px-2.5 py-1 rounded font-semibold transition-colors flex items-center gap-1 ${
              mode === "draw" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <PenTool className="w-3 h-3" /> Draw
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2.5 py-1 rounded font-semibold transition-colors flex items-center gap-1 ${
              mode === "upload" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Upload className="w-3 h-3" /> Upload
          </button>
          <button
            type="button"
            onClick={() => setMode("type")}
            className={`px-2.5 py-1 rounded font-semibold transition-colors flex items-center gap-1 ${
              mode === "type" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Type className="w-3 h-3" /> Type
          </button>
        </div>
      </div>

      {/* SIGNATURE PAD MODES */}
      <div>
        {mode === "draw" && (
          <div className="space-y-2">
            <div className="relative border-2 border-dashed border-slate-300 rounded-xl bg-white overflow-hidden">
              <canvas
                ref={canvasRef}
                width={400}
                height={120}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-28 cursor-crosshair touch-none"
              />
              <span className="absolute bottom-2 right-3 text-[10px] text-slate-400 font-medium pointer-events-none">
                Sign with mouse or finger above
              </span>
            </div>
          </div>
        )}

        {mode === "upload" && (
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 bg-white text-center space-y-2">
            <Upload className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-600 font-medium">
              Upload a scanned image of your handwritten signature (PNG / JPG / SVG)
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors inline-flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Choose Signature File
            </button>
          </div>
        )}

        {mode === "type" && (
          <div className="space-y-2 bg-white p-3 border border-slate-200 rounded-xl">
            <label className="block text-xs font-semibold text-slate-700">
              Type Name for Cursive Signature
            </label>
            <input
              type="text"
              value={typedText}
              onChange={(e) => generateTypedSignature(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg font-serif italic text-slate-900"
            />
            {typedText && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                <span className="font-serif italic text-2xl text-slate-800 tracking-wide">
                  {typedText}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SIGNATURE PREVIEW & DETAILS */}
      {signatureImage && (
        <div className="flex items-center justify-between p-3 bg-white border border-emerald-300 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-24 h-12 border border-slate-200 rounded flex items-center justify-center bg-white p-1">
              {/* eslint-disable-next-next/no-img-element */}
              <img
                src={signatureImage}
                alt="Active E-Signature"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Active E-Signature Added
              </span>
              <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Rendered on Purchase Order
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={clearCanvas}
            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
            title="Clear Signature"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SIGNATORY NAME & TITLE INPUTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Authorized Signatory Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              onSave({
                signatureImage: signatureImage || "",
                signatoryName: e.target.value,
                signatoryTitle: title,
              });
            }}
            placeholder="e.g. John Doe"
            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">
            Designation / Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              onSave({
                signatureImage: signatureImage || "",
                signatoryName: name,
                signatoryTitle: e.target.value,
              });
            }}
            placeholder="e.g. Managing Director"
            className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};
