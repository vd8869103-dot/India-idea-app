import React from "react";
import { Idea } from "../types";
import { ShieldCheck, Award, FileSignature, Printer, Calendar, RefreshCcw } from "lucide-react";

interface CertificationBadgeProps {
  idea: Idea;
  onClose: () => void;
}

export default function CertificationBadge({ idea, onClose }: CertificationBadgeProps) {
  const currentVersion = idea.versions?.length > 0 ? idea.versions[idea.versions.length - 1].version : 1;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto print:bg-white print:p-0">
      <div className="relative w-full max-w-2xl bg-[#141418] rounded-xl shadow-2xl border border-white/15 p-8 text-white print:bg-white print:text-black print:shadow-none print:border-0 print:p-0">
        
        {/* Close Button - Hidden in Print */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white print:hidden p-2 rounded-full hover:bg-white/5 transition-all cursor-pointer"
        >
          ✕
        </button>

        {/* Certificate Container */}
        <div id="certificate" className="border-4 border-double border-orange-500/35 p-6 rounded-lg bg-[#0f0f12] relative overflow-hidden print:bg-white print:text-black print:border-black print:border-8">
          
          {/* Subtle watermarked Background Emblem */}
          <div className="absolute inset-0 flex items-center justify-center opacity-3 pointer-events-none select-none">
            <Award className="w-96 h-96 text-orange-500 opacity-[0.03] print:opacity-[0.05]" />
          </div>

          {/* Certificate Header */}
          <div className="text-center pb-6 border-b border-white/10 border-dashed print:border-black">
            <div className="flex justify-center items-center gap-2 mb-2">
              <Award className="w-12 h-12 text-orange-400 print:text-black" />
            </div>
            <h1 className="text-3xl font-bold tracking-wide text-white uppercase print:text-black">
              India Idea Hub
            </h1>
            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mt-1 print:text-gray-600">
              Digital Intellectual Property Integrity Bureau
            </p>
            <div className="mt-2 inline-flex items-center gap-1 bg-orange-500/10 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-500/20 print:bg-white print:text-black print:border-black">
              <ShieldCheck className="w-3.5 h-3.5" /> SECURE BLOCKCHAIN PROTOCOL TIMESTAMP
            </div>
          </div>

          {/* Body Section */}
          <div className="my-8 space-y-4 text-left">
            <p className="text-center italic text-gray-400 print:text-gray-600">
              This hereby certifies and registers a permanent ledger of claim over the underlying concept:
            </p>

            <div className="text-center bg-[#0a0a0b] border border-white/10 p-4 rounded-md print:bg-white print:border-black">
              <h2 className="text-xl font-bold text-white print:text-black">
                {idea.title}
              </h2>
              <p className="text-xs text-gray-400 mt-1 uppercase font-mono print:text-gray-600">
                Category: {idea.category} • Certified Serial: {idea.certificateId}
              </p>
            </div>

            {/* Ownership Table */}
            <div className="grid grid-cols-2 gap-4 text-xs mt-4 pt-2 border-t border-white/10 print:border-black">
              <div>
                <span className="block font-bold text-gray-500 uppercase tracking-wider">Registered Inventor:</span>
                <span className="font-medium text-white block mt-1 print:text-black">{idea.creatorName}</span>
                <span className="text-gray-400 italic block print:text-gray-600">{idea.creatorEmail}</span>
              </div>
              <div>
                <span className="block font-bold text-gray-500 uppercase tracking-wider">Registration Origin:</span>
                <span className="font-medium text-white block mt-1 print:text-black">{idea.creatorCountry}</span>
                <span className="text-gray-400 italic block print:text-gray-600">Global Hub Connected</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <span className="block font-bold text-gray-500 uppercase tracking-wider">Initial Timestamp Ledger:</span>
                <span className="font-mono text-gray-300 block mt-1 flex items-center gap-1.5 justify-start print:text-black">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  {new Date(idea.createdAt).toLocaleString("en-IN", { timeZone: "IST" })} IST
                </span>
              </div>
              <div>
                <span className="block font-bold text-gray-500 uppercase tracking-wider">Revision Index:</span>
                <span className="font-mono text-gray-300 block mt-1 flex items-center gap-1.5 justify-start print:text-black">
                  <RefreshCcw className="w-3.5 h-3.5 text-gray-500" />
                  v{currentVersion}.0 (Active Edition)
                </span>
              </div>
            </div>

            {/* Cryptographic Hash segment */}
            <div className="bg-[#0a0a0b] text-gray-305 text-gray-300 p-3 rounded-md font-mono text-[9px] break-all border border-white/10 print:bg-white print:text-black print:border-black">
              <span className="text-[10px] font-bold text-orange-400 block mb-1 uppercase tracking-widest flex items-center gap-1 print:text-black">
                <FileSignature className="w-3.5 h-3.5" /> SECURE PATENT-INTEGRITY CHECKSUM REGISTER
              </span>
              SHA-256 HASH: {idea.timestampHash}
            </div>
          </div>

          {/* Certificate Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end print:border-black">
            <div className="text-[10px] text-gray-500 space-y-1 print:text-gray-650">
              <p className="font-bold text-gray-400 print:text-black">Digital Signature Authenticated</p>
              <p>Certified via India Idea Hub IP Protections Act 2026</p>
              <p>Reference Protocol Hash: IIH-IP-{idea.certificateId.split("-")[2]}</p>
            </div>
            
            <div className="text-center space-y-1">
              {/* Mock Signature Stamp */}
              <div className="w-24 h-12 flex items-center justify-center border-2 border-orange-500/30 rounded-sm rotate-[-8deg] bg-orange-500/5 text-orange-400 font-sans font-bold text-xs p-1 tracking-wider uppercase select-none print:border-black print:text-black">
                VERIFIED SEAL<br/><span className="text-[9px] font-mono font-normal">IND-IDEA-HUB</span>
              </div>
            </div>
          </div>

        </div>

        {/* Buttons - Hidden on Print */}
        <div className="mt-6 flex justify-end gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 font-medium transition-all text-sm cursor-pointer"
          >
            Go Back
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg shadow-sm transition-all text-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" /> Print or Save PDF
          </button>
        </div>

      </div>
    </div>
  );
}
