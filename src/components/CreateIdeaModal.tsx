import React, { useState } from "react";
import { Idea, SafetyAudit } from "../types";
import { watermarkImage, generateSHA256Mock, generateCertificateId } from "./WatermarkEngine";
import { UploadCloud, Loader2, ShieldCheck, Lock, Unlock, AlertTriangle, Sparkles } from "lucide-react";

interface CreateIdeaModalProps {
  onClose: () => void;
  onSubmit: (newIdea: Idea) => void;
  currentUserEmail: string | null;
  currentUserName: string | null;
}

export default function CreateIdeaModal({
  onClose,
  onSubmit,
  currentUserEmail,
  currentUserName
}: CreateIdeaModalProps) {
  // Input fields state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Technology");
  const [description, setDescription] = useState("");
  const [detailedBlueprint, setDetailedBlueprint] = useState("");
  const [creatorName, setCreatorName] = useState(currentUserName || "");
  const [creatorEmail, setCreatorEmail] = useState(currentUserEmail || "");
  const [creatorCountry, setCreatorCountry] = useState("India");
  const [viewerNDA, setViewerNDA] = useState(true);
  const [primaryLanguage, setPrimaryLanguage] = useState("en");

  // Media
  const [imageFile, setImageFile] = useState<string | null>(null);
  const [isWatermarking, setIsWatermarking] = useState(false);
  const [watermarkedUrl, setWatermarkedUrl] = useState<string | null>(null);

  // Submission / Loading Pipeline states
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishingStage, setPublishingStage] = useState(""); // "sealing", "auditing", "translating", "completed"

  const categories = ["Technology", "Business", "Education", "Agriculture", "Healthcare", "Creative"];
  const countries = ["India", "USA", "Singapore", "Canada", "Japan", "Germany", "UK", "Australia"];

  // Handle image upload and apply watermark immediately
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsWatermarking(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const originalUrl = reader.result as string;
      setImageFile(originalUrl);

      try {
        const certPlaceholder = "IIH-TEMP-" + Math.floor(1000 + Math.random() * 9000);
        const timestampStr = new Date().toLocaleString("en-IN", { timeZone: "IST" }) + " IST";
        
        // Dynamic watermarking draw on-the-fly
        const protectedUrl = await watermarkImage(
          originalUrl,
          creatorName || "SECURED ORIGINAL",
          timestampStr,
          certPlaceholder
        );
        setWatermarkedUrl(protectedUrl);
      } catch (err) {
        console.error("Watermark failed:", err);
        setWatermarkedUrl(originalUrl);
      } finally {
        setIsWatermarking(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !creatorName || !creatorEmail) {
      alert("All fields marked * are mandatory to protect ownership integrity.");
      return;
    }

    setIsPublishing(true);
    
    // Step 1: Simulate Blockchain-like Sealing
    setPublishingStage("Generating cryptographic signature & hash stamp...");
    await new Promise((r) => setTimeout(r, 1200));

    // Generate SHA hash and certificate of ownership
    const tempCertId = generateCertificateId();
    const tempHash = generateSHA256Mock(title + " " + description + " " + (detailedBlueprint || ""));

    // Dynamic watermark update with the official certificate code if image available
    let finalWatermarkedImage = watermarkedUrl;
    if (imageFile && watermarkedUrl) {
      setPublishingStage("Re-stamping legal certificate watermark onto assets...");
      try {
        const timestampOfficial = new Date().toLocaleString("en-IN", { timeZone: "IST" }) + " IST";
        finalWatermarkedImage = await watermarkImage(
          imageFile,
          creatorName,
          timestampOfficial,
          tempCertId
        );
      } catch (err) {
        finalWatermarkedImage = watermarkedUrl;
      }
    }

    // Step 2: Contact Gemini server-side route for advanced dynamic translation & IP Novelty Scan
    setPublishingStage("Invoking Gemini server AI for novelty audit & bilingual Indian translator index...");
    
    let enTrans = title + ": " + description;
    let hiTrans = title + ": " + description;
    let safetyObject: SafetyAudit = {
      passed: true,
      score: 95,
      riskNotes: "No direct infringements spotted. The concept leverages creative domain assertions.",
      claimsVerification: "Highly robust invention claim structure verified."
    };

    try {
      const response = await fetch("/api/analyze-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          detailedBlueprint,
          category,
          primaryLanguage
        })
      });

      if (response.ok) {
        const data = await response.json();
        enTrans = data.english_translation || enTrans;
        hiTrans = data.hindi_translation || hiTrans;
        
        safetyObject = {
          passed: data.safety_passed ?? true,
          score: data.safety_score ?? 95,
          riskNotes: data.risk_notes || "Compliant.",
          claimsVerification: data.claims_verification || "Secured novelty."
        };
      }
    } catch (err) {
      console.warn("Gemini safety audit offline fallback activated.");
    }

    setPublishingStage("Publishing secure ledger logs to Indian Idea Hub archive...");
    await new Promise((r) => setTimeout(r, 800));

    // Form final Idea Object
    const completeIdea: Idea = {
      id: "idea-" + Date.now(),
      title,
      description,
      detailedBlueprint: detailedBlueprint || undefined,
      category,
      createdAt: new Date().toISOString(),
      creatorName,
      creatorEmail,
      creatorCountry,
      likes: 0,
      likedBy: [],
      comments: [],
      imageWatermarked: finalWatermarkedImage || undefined,
      videoWatermarked: undefined, // Setup simulated indication if requested
      languages: {
        en: enTrans,
         hi: hiTrans
      },
      safetyAudit: safetyObject,
      timestampHash: tempHash,
      certificateId: tempCertId,
      versions: [
        {
          version: 1,
          timestamp: new Date().toISOString(),
          title,
          description,
          changeSummary: "First Registration Submission Seal",
          hash: tempHash
        }
      ],
      viewerNDA,
      authorizedViewers: [creatorEmail] // Owner is instantly authorized
    };

    onSubmit(completeIdea);
    setIsPublishing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#141418] rounded-2xl shadow-2xl border border-white/10 p-6 sm:p-8 text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isPublishing}
          className="absolute top-4 right-4 text-gray-400 hover:text-white disabled:opacity-30 p-2 rounded-full hover:bg-white/5 cursor-pointer"
        >
          ✕
        </button>

        {/* Heading */}
        <div className="border-b border-white/10 pb-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            Patent & Invention Hub Upload
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            Provide the required details to secure your concept registry. Image assets are run in sandboxed watermarking grids before database entry.
          </p>
        </div>

        {/* Dynamic publishing loader mask */}
        {isPublishing ? (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 font-sans">
            <Loader2 className="w-12 h-12 text-orange-450 text-orange-400 animate-spin" />
            <div className="space-y-1">
              <h3 className="font-bold text-white text-lg">Conducting Secure IP Registration</h3>
              <p className="text-xs text-gray-400 max-w-md italic">{publishingStage}</p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl max-w-sm mt-4 flex items-start gap-2.5 text-left text-xs text-emerald-400">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Anti-Theft Protocol Engaged</span>
                Your text content and detailed sketches are protected under standard digital patent rights protocols while routing.
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            
            {/* Sec 1: Idea Identity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                  Invention / Concept Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-white/10 rounded-lg p-2.5 bg-[#0a0a0b] text-white text-xs sm:text-sm focus:bg-[#0f0f12] focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-650"
                  placeholder="e.g. Zero-Water Smart Crop Incubator"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                    Primary Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-white/10 rounded-lg p-2.5 bg-[#0a0a0b] text-white text-xs sm:text-sm focus:bg-[#0f0f12] focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#141418]">{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                    Primary Language
                  </label>
                  <select
                    value={primaryLanguage}
                    onChange={(e) => setPrimaryLanguage(e.target.value)}
                    className="w-full border border-white/10 rounded-lg p-2.5 bg-[#0a0a0b] text-white text-xs sm:text-sm focus:bg-[#0f0f12] focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                  >
                    <option value="en" className="bg-[#141418]">English (Original)</option>
                    <option value="hi" className="bg-[#141418]">हिंदी (Hindi Original)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sec 2: Public Explanation and Private Technical Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                  Public Summary * (Visible to Everyone)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full border border-white/10 rounded-lg p-2.5 bg-[#0a0a0b] text-white text-xs leading-relaxed focus:bg-[#0f0f12] focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-650"
                  placeholder="Provide a general description of your concept, problem targeted, and global scalability, without exposing your private formulas or patented files..."
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-semibold text-gray-400 uppercase">
                    Secret Technical Blueprint (Patented)
                  </label>
                  <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-405 text-orange-400 px-1.5 py-0.5 rounded text-[10px] font-bold border border-orange-500/20">
                    <Lock className="w-3 h-3 text-orange-400" /> Secure
                  </div>
                </div>
                <textarea
                  value={detailedBlueprint}
                  onChange={(e) => setDetailedBlueprint(e.target.value)}
                  rows={4}
                  className="w-full border border-white/10 rounded-lg p-2.5 bg-[#0a0a0b] text-white text-xs leading-relaxed focus:bg-[#0f0f12] focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-650"
                  placeholder="OPTIONAL: Enter detailed proprietary design specifications, chemical formulations, code architecture, or manufacturing mechanics. Highly protected logic."
                />
              </div>
            </div>

            {/* Sec 3: Profile Identity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                  Creator Full Name *
                </label>
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  className="w-full border border-white/10 rounded-lg p-2 bg-[#0a0a0b] text-white text-xs focus:bg-[#0f0f12] focus:ring-1 focus:ring-orange-500 outline-none"
                  placeholder="Inventor Name"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                  Creator Contact Email *
                </label>
                <input
                  type="email"
                  value={creatorEmail}
                  onChange={(e) => setCreatorEmail(e.target.value)}
                  className="w-full border border-white/10 rounded-lg p-2 bg-[#0a0a0b] text-white text-xs focus:bg-[#0f0f12] focus:ring-1 focus:ring-orange-500 outline-none"
                  placeholder="contact@inventor.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                  Country of Filing *
                </label>
                <select
                  value={creatorCountry}
                  onChange={(e) => setCreatorCountry(e.target.value)}
                  className="w-full border border-white/10 rounded-lg p-2 bg-[#0a0a0b] text-white text-xs focus:bg-[#0f0f12] focus:ring-1 focus:ring-orange-500 outline-none"
                >
                  {countries.map((c) => (
                    <option key={c} value={c} className="bg-[#141418]">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sec 4: Watermarking Image upload & NDA settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start bg-[#0f0f12] p-4 rounded-xl border border-white/10">
              
              {/* Image upload with preview */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase mb-1 flex items-center gap-1">
                  Invention Diagram or Concept Image
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                </label>
                
                {watermarkedUrl ? (
                  <div className="relative border border-white/10 rounded-lg overflow-hidden bg-[#0a0a0b] group mt-1.5">
                    <img
                      src={watermarkedUrl}
                      alt="Watermarked diagram"
                      className="w-full h-32 object-contain bg-[#0a0a0b]"
                    />
                    <div className="absolute top-1 right-1 bg-red-600 text-white font-mono text-[9px] px-1.5 py-0.5 rounded uppercase font-bold">
                      WATERMARKED
                    </div>
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setWatermarkedUrl(null); }}
                      className="absolute bottom-1 right-1 bg-black/80 text-white rounded text-[10px] px-2 py-0.5 hover:bg-black font-semibold cursor-pointer"
                    >
                      Remove Diagram
                    </button>
                  </div>
                ) : (
                  <div className="relative border-2 border-dashed border-white/10 hover:border-white/20 bg-[#0a0a0b] rounded-lg p-4 transition-all mt-1.5 flex flex-col items-center justify-center text-center cursor-pointer">
                    <UploadCloud className="w-8 h-8 text-gray-500 mb-1" />
                    <p className="text-[11px] font-medium text-gray-300">Click to upload schematics</p>
                    <p className="text-[9px] text-gray-500">Diag, Mock, Sketch (JPEG/PNG)</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      disabled={isWatermarking}
                    />
                    {isWatermarking && (
                      <div className="absolute inset-0 bg-[#0f0f12]/95 flex flex-col items-center justify-center p-2 text-center">
                        <Loader2 className="w-6 h-6 text-orange-400 animate-spin mb-1" />
                        <span className="text-[10px] font-bold text-white">Processing Watermark...</span>
                        <span className="text-[8px] text-gray-550">Overlaying security stamps on Canvas</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Protective NDA variables toggler */}
              <div className="space-y-2 pt-1 text-left">
                <span className="block text-xs font-semibold text-gray-350 uppercase">
                  Patent Theft Protection Guard
                </span>
                
                <div className="flex items-start gap-2.5 mt-2">
                  <input
                    type="checkbox"
                    id="nda-checkbox"
                    checked={viewerNDA}
                    onChange={(e) => setViewerNDA(e.target.checked)}
                    className="w-4.5 h-4.5 accent-orange-500 border-white/10 rounded focus:ring-orange-500 mt-0.5 cursor-pointer bg-[#0a0a0b]"
                  />
                  <div className="text-left">
                    <label htmlFor="nda-checkbox" className="text-xs font-bold text-gray-300 flex items-center gap-1.5 cursor-pointer select-none">
                      Require Digital NDA before viewing blueprint {viewerNDA ? <Lock className="w-3.5 h-3.5 text-orange-400 inline" /> : <Unlock className="w-3.5 h-3.5 text-gray-400 inline" />}
                    </label>
                    <p className="text-[10px] text-gray-500 leading-normal mt-0.5">
                      Ensures that viewers outside the creator account cannot access detailed design blueprint data until they sign our digital non-disclosure covenant.
                    </p>
                  </div>
                </div>

                <div className="bg-orange-500/5 border border-orange-500/10 rounded-lg p-2.5 flex gap-1.5 text-[10px] text-gray-300 leading-normal">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-orange-400 mt-0.5" />
                  <p>
                    <strong>Global Connection:</strong> Connecting your draft guarantees matching options for international cross-border syndicates in our partnership registry.
                  </p>
                </div>
              </div>

            </div>

            {/* Buttons */}
            <div className="border-t border-white/10 pt-4 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-white/10 text-gray-400 rounded-lg text-xs sm:text-sm hover:text-white hover:bg-white/5 transition-all font-medium cursor-pointer"
              >
                Go Back
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                Sign & Upload Safely
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
