import React, { useState } from "react";
import { Idea, Comment, Revision } from "../types";
import { ThumbsUp, MessageSquare, ShieldCheck, Lock, Unlock, Eye, Award, History, Globe, Sparkles, Send, RefreshCw, SendToBack, Share2 } from "lucide-react";

interface IdeaCardProps {
  key?: string;
  idea: Idea;
  currentUserEmail: string | null;
  onLike: (ideaId: string) => void;
  onAddComment: (ideaId: string, commentText: string) => void;
  onOpenCertificate: (idea: Idea) => void;
  onInitiateContact: (receiverEmail: string, receiverName: string, ideaTitle: string) => void;
  onRevertVersion: (ideaId: string, revision: Revision) => void;
}

export default function IdeaCard({
  idea,
  currentUserEmail,
  onLike,
  onAddComment,
  onOpenCertificate,
  onInitiateContact,
  onRevertVersion
}: IdeaCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"summary" | "blueprint" | "history">("summary");
  
  // Translation Language selector state
  const [selectedLanguage, setSelectedLanguage] = useState<"original" | "en" | "hi">("original");

  // NDA signature state
  const [ndaName, setNdaName] = useState("");
  const [isSigningNDA, setIsSigningNDA] = useState(false);

  // New Comment state
  const [newComment, setNewComment] = useState("");

  const isOwner = currentUserEmail === idea.creatorEmail;
  const hasLiked = currentUserEmail ? idea.likedBy.includes(currentUserEmail) : false;
  const isAuthorizedToViewBlueprint = 
    !idea.viewerNDA || 
    isOwner || 
    (currentUserEmail && idea.authorizedViewers.includes(currentUserEmail));

  // Determine current active content textual description based on translation tag selection
  const getDisplayContent = () => {
    if (selectedLanguage === "en") return idea.languages.en;
    if (selectedLanguage === "hi") return idea.languages.hi;
    return idea.description; // default original
  };

  // Submit dynamic comment
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(idea.id, newComment.trim());
    setNewComment("");
  };

  // Signature submit
  const handleNdaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ndaName.trim() || !currentUserEmail) return;

    setIsSigningNDA(true);
    setTimeout(() => {
      // Simulate signature entry
      idea.authorizedViewers.push(currentUserEmail);
      setIsSigningNDA(false);
      setNdaName("");
    }, 1000);
  };

  // Share link copy simulated action
  const handleShare = () => {
    const textToCopy = `Check out "${idea.title}" on India Idea Hub. Securely Timestamped Certification Number: ${idea.certificateId}`;
    navigator.clipboard.writeText(textToCopy);
    alert("Shareable secure reference details copied successfully!");
  };

  return (
    <div className="bg-[#0f0f12] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all duration-200 flex flex-col justify-between">
      
      {/* Front Summary Display */}
      <div>
        
        {/* Header Metadata */}
        <div className="flex justify-between items-start gap-2 mb-3">
          <div>
            <span className="inline-block bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider mb-1.5">
              {idea.category}
            </span>
            <h3 className="font-bold text-white text-lg sm:text-xl tracking-tight leading-snug">
              {idea.title}
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              By {idea.creatorName} ({idea.creatorCountry}) • {new Date(idea.createdAt).toLocaleDateString("en-IN", { timeZone: "IST" })}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {idea.viewerNDA && (
              <span className="bg-orange-500/10 border border-orange-500/20 text-orange-405 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3 text-orange-500" /> NDA BOUND
              </span>
            )}
            <span 
              onClick={() => onOpenCertificate(idea)}
              className="bg-white/5 border border-white/10 hover:border-white/20 text-gray-300 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 cursor-pointer select-none transition-all"
              title="Inspect Digital Timestamp Proof"
            >
              <Award className="w-3.5 h-3.5 text-orange-400" /> REGISTERED
            </span>
          </div>
        </div>

        {/* Thumbnail preview with legal watermarks */}
        {idea.imageWatermarked && (
          <div className="relative h-44 rounded-xl overflow-hidden bg-[#0a0a0b] border border-white/10 mb-4 cursor-zoom-in" onClick={() => setIsExpanded(true)}>
            <img
              src={idea.imageWatermarked}
              alt={idea.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-2 left-2 bg-red-650 text-white font-mono text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider select-none">
              India Idea Hub Watermark Secure
            </div>
          </div>
        )}

        {/* Short Text */}
        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
          {idea.description}
        </p>

        {/* Translate dropdown toolbar inside the card summary */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-0.5 whitespace-nowrap">
            <Globe className="w-3 h-3" /> Reader Option:
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setSelectedLanguage("original")}
              className={`px-2 py-0.5 text-[10px] rounded transition-all font-semibold ${
                selectedLanguage === "original" ? "bg-orange-500 text-white" : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              Original
            </button>
            <button
              onClick={() => setSelectedLanguage("en")}
              className={`px-2 py-0.5 text-[10px] rounded transition-all font-semibold ${
                selectedLanguage === "en" ? "bg-orange-500 text-white" : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              English EN
            </button>
            <button
              onClick={() => setSelectedLanguage("hi")}
              className={`px-2 py-0.5 text-[10px] rounded transition-all font-semibold ${
                selectedLanguage === "hi" ? "bg-orange-500 text-white" : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              हिंदी HI
            </button>
          </div>
        </div>

      </div>

      {/* Social likes comments counter bar */}
      <div className="border-t border-white/10 pt-3 flex items-center justify-between text-xs text-gray-400">
        <div className="flex gap-4">
          <button
            onClick={() => onLike(idea.id)}
            className={`flex items-center gap-1.5 transition-all outline-none ${
              hasLiked ? "text-orange-400 font-semibold scale-102" : "hover:text-white"
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${hasLiked ? "fill-orange-500/10 text-orange-400" : ""}`} />
            <span>{idea.likes} {idea.likes === 1 ? "Like" : "Likes"}</span>
          </button>

          <button
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-1.5 hover:text-white font-medium"
          >
            <MessageSquare className="w-4 h-4 text-gray-500" />
            <span>{idea.comments.length} Comments</span>
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="p-1 hover:bg-white/5 text-gray-500 hover:text-white rounded"
            title="Copy patent shareable tag"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-orange-450 hover:text-orange-400 font-bold text-xs"
          >
            {isExpanded ? "Close Detail" : "Inspect Concept →"}
          </button>
        </div>
      </div>

      {/* Expanded Modal-style Detail Inspector */}
      {isExpanded && (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs flex justify-center items-center p-4 overflow-y-auto">
          <div className="bg-[#141418] w-full max-w-4xl rounded-2xl shadow-2xl border border-white/10 p-6 max-h-[90vh] overflow-y-auto relative text-left">
            
            {/* Close */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/5"
            >
              ✕
            </button>

            {/* Header info */}
            <div className="pb-4 border-b border-white/10 mb-6 pr-8">
              <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                {idea.category}
              </span>
              <h2 className="text-2xl font-bold text-white mt-1">
                {idea.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 mt-2">
                <span>By <strong>{idea.creatorName}</strong> ({idea.creatorCountry})</span>
                <span>•</span>
                <span>Created: {new Date(idea.createdAt).toLocaleString("en-IN", { timeZone: "IST" })} IST</span>
                <span>•</span>
                <span className="font-mono bg-white/5 text-gray-300 text-[10px] px-2 py-0.5 rounded border border-white/5">
                  ID: {idea.certificateId}
                </span>
              </div>
            </div>

            {/* Grid Layout for Expanded content/comments */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left 2 Column: Content description & blueprints */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Image panel in Expanded view */}
                {idea.imageWatermarked && (
                  <div className="relative border border-white/10 rounded-2xl overflow-hidden bg-[#0a0a0b]">
                    <img
                      src={idea.imageWatermarked}
                      alt={idea.title}
                      className="w-full max-h-72 object-contain mx-auto"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 left-2 bg-red-650 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded uppercase select-none">
                      Patent Secured Stamp Attached
                    </div>
                  </div>
                )}

                {/* Tabs bar */}
                <div className="border-b border-white/10 flex gap-4 text-xs font-bold text-gray-400">
                  <button
                    onClick={() => setActiveTab("summary")}
                    className={`pb-2 border-b-2 outline-none ${
                      activeTab === "summary" ? "border-orange-500 text-orange-400" : "border-transparent hover:text-white"
                    }`}
                  >
                    Brief & Translation
                  </button>
                  <button
                    onClick={() => setActiveTab("blueprint")}
                    className={`pb-2 border-b-2 flex items-center gap-1 outline-none ${
                      activeTab === "blueprint" ? "border-orange-500 text-orange-400" : "border-transparent hover:text-white"
                    }`}
                  >
                    {idea.viewerNDA ? <Lock className="w-3.5 h-3.5 text-orange-500" /> : <Unlock className="w-3.5 h-3.5 text-gray-500" />} Proprietary Blueprint
                  </button>
                  <button
                    onClick={() => setActiveTab("history")}
                    className={`pb-2 border-b-2 flex items-center gap-1 outline-none ${
                      activeTab === "history" ? "border-orange-500 text-orange-400" : "border-transparent hover:text-white"
                    }`}
                  >
                    <History className="w-3.5 h-3.5" /> Revision Ledger ({idea.versions?.length || 1})
                  </button>
                </div>

                {/* Tab content */}
                {activeTab === "summary" && (
                  <div className="space-y-4">
                    {/* Multilingual Selector */}
                    <div className="flex justify-between items-center bg-[#0f0f12] p-3 rounded-xl border border-white/10">
                      <span className="text-xs font-bold text-white flex items-center gap-1">
                        <Globe className="w-4 h-4 text-orange-400 animate-pulse" /> Auto-Translation Panel
                      </span>

                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setSelectedLanguage("original")}
                          className={`px-3 py-1 text-xs rounded font-semibold ${
                            selectedLanguage === "original" ? "bg-orange-500 text-white" : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/15"
                          }`}
                        >
                          Original Language
                        </button>
                        <button
                          onClick={() => setSelectedLanguage("en")}
                          className={`px-3 py-1 text-xs rounded font-semibold ${
                            selectedLanguage === "en" ? "bg-orange-500 text-white" : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/15"
                          }`}
                        >
                          English EN
                        </button>
                        <button
                          onClick={() => setSelectedLanguage("hi")}
                          className={`px-3 py-1 text-xs rounded font-semibold ${
                            selectedLanguage === "hi" ? "bg-orange-500 text-white" : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/15"
                          }`}
                        >
                          हिंदी HI
                        </button>
                      </div>
                    </div>

                    {/* Translating Explanation display */}
                    <div className="bg-[#0a0a0b] border border-white/10 rounded-xl p-5">
                      <h4 className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">
                        {selectedLanguage === "original" ? "Concept Brief" : `${selectedLanguage.toUpperCase()} translation`}
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                        {getDisplayContent()}
                      </p>
                    </div>

                    {/* Gemini Safety Audit insights box */}
                    {idea.safetyAudit && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" /> GEMINI AUTOMATIC SAFETY AUDIT REPORT
                          </span>
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold text-xs px-2 py-0.5 rounded">
                            NOVELTY SCORE: {idea.safetyAudit.score}/100
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-300 leading-normal">
                          <strong>Conflict Risk Assessment:</strong> {idea.safetyAudit.riskNotes}
                        </p>
                        <p className="text-[11px] text-gray-300 leading-normal border-t border-emerald-500/10 pt-1.5">
                          <strong>Patent Strategy Suggestion:</strong> {idea.safetyAudit.claimsVerification}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "blueprint" && (
                  <div className="space-y-4">
                    {isAuthorizedToViewBlueprint ? (
                      <div className="bg-[#0a0a0b] text-gray-300 p-5 rounded-2xl font-mono text-xs leading-relaxed space-y-4 border border-white/10">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                          <span className="text-orange-400 font-bold tracking-wider flex items-center gap-1">
                            <Unlock className="w-3.5 h-3.5" /> PROPRIETARY BLUEPRINT SPECIFICATIONS
                          </span>
                          <span className="text-[10px] text-gray-500">
                            Filing Hash ID: {idea.timestampHash.slice(0, 16)}...
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap">
                          {idea.detailedBlueprint || "Creator has not uploaded secondary code blueprint files yet. High quality summary remains active."}
                        </p>
                      </div>
                    ) : (
                      /* Restricted View - Prompt NDA */
                      <div className="bg-orange-500/5 border border-orange-500/10 rounded-2xl p-6 text-center space-y-4">
                        <div className="max-w-md mx-auto space-y-2">
                          <Lock className="w-12 h-12 text-orange-400 mx-auto mt-2" />
                          <h3 className="font-bold text-white text-lg">PROPRIETARY SPECIFICATIONS ENCRYPTED</h3>
                          <p className="text-xs text-gray-400 leading-normal">
                            To protect against copycat theft, the detailed blueprint and technical parameters of this invention require a legally binding Non-Disclosure Agreement (NDA).
                          </p>
                        </div>

                        {/* NDA Document and Signature Form */}
                        <form onSubmit={handleNdaSubmit} className="max-w-xl mx-auto bg-[#0f0f12] border border-white/10 rounded-xl p-4 text-left space-y-3">
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 border-b border-white/10 pb-1">
                            Digital Non-Disclosure Covenant
                          </h4>
                          <div className="max-h-24 overflow-y-auto text-[9px] text-gray-400 font-mono space-y-1.5 p-2 bg-[#0a0a0b] rounded border border-white/5">
                            <p>1. CONFIDENTIALITY PROTOCOL: The receiving party agrees to treat all information and blueprints as highly confidential.</p>
                            <p>2. NON-USE CLAUSE: Under the Patents Act of India, the receiving party is strictly prohibited from exploiting, copying, or licensing the underlying concept without clear, written patent transfer consents from the original inventor: {idea.creatorName}.</p>
                            <p>3. DURATION AND RELIEF: This covenant will bind the recipient for a duration of five (5) fiscal years from the stamp signature timestamp.</p>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={ndaName}
                              onChange={(e) => setNdaName(e.target.value)}
                              placeholder="Type your full legal name to sign..."
                              className="flex-1 border border-white/10 rounded-lg px-3 py-2 bg-[#0a0a0b] text-xs text-white focus:bg-[#141418] focus:ring-1 focus:ring-orange-500 outline-none placeholder:text-gray-600"
                              required
                            />
                            <button
                              type="submit"
                              disabled={isSigningNDA || !currentUserEmail}
                              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
                            >
                              {isSigningNDA ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying...
                                </>
                              ) : (
                                "Sign NDA & Unlock"
                              )}
                            </button>
                          </div>
                          {!currentUserEmail && (
                            <span className="text-[10px] text-red-400 font-bold block text-center">
                              Please register or set your profile email in the top panel to sign NDAs.
                            </span>
                          )}
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "history" && (
                  <div className="space-y-4">
                    <h4 className="text-xs text-gray-500 font-bold uppercase tracking-widest">
                      File Integrity Revisions Track
                    </h4>
                    
                    <div className="space-y-3">
                      {idea.versions?.map((ver, index) => (
                        <div
                          key={index}
                          className="border border-white/10 rounded-xl p-4 bg-[#0f0f12] flex flex-col sm:flex-row gap-3 justify-between items-start"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="bg-orange-500/15 text-orange-400 font-mono text-[10px] font-bold px-1.5 rounded">
                                Edition v{ver.version}.0
                              </span>
                              <span className="text-xs text-gray-400">
                                {new Date(ver.timestamp).toLocaleString("en-IN", { timeZone: "IST" })} IST
                              </span>
                            </div>
                            <p className="text-xs font-bold text-white">{ver.title}</p>
                            <p className="text-gray-400 text-[11px] leading-relaxed">
                              Change Log statement: <strong>{ver.changeSummary}</strong>
                            </p>
                            <p className="text-[10px] text-gray-500 font-mono truncate max-w-sm">
                              SECURE INDEX: {ver.hash}
                            </p>
                          </div>

                          {/* Revert Rollback button only if user is original owner and not currently looking at version 1 as the only option */}
                          {isOwner && index < idea.versions.length - 1 && (
                            <button
                              onClick={() => {
                                onRevertVersion(idea.id, ver);
                                alert(`Successfully rolled index back to v${ver.version}.0!`);
                              }}
                              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1 text-[11px] font-bold rounded-lg transition-all"
                            >
                              Revert to v{ver.version}.0
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column: Interaction sidebar (Connect / Comments Ledger) */}
              <div className="border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-6 space-y-6">
                
                {/* Connect Segment */}
                <div className="bg-[#0a0a0b] border border-white/10 text-white rounded-xl p-4 text-center space-y-3">
                  <h4 className="font-bold text-sm tracking-tight text-orange-400 uppercase">
                    Interested Stakeholder Connect
                  </h4>
                  <p className="text-[11px] text-gray-400 leading-normal">
                    Secure private connection. Reach out to the verified inventor directly to request patent licensing, equity share purchase, or global investment options.
                  </p>
                  
                  {isOwner ? (
                    <span className="bg-white/5 text-[10px] block font-bold text-gray-400 py-1 rounded">
                      This is your own invention concept
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        onInitiateContact(idea.creatorEmail, idea.creatorName, idea.title);
                        setIsExpanded(false);
                      }}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs transition-all shadow-sm"
                    >
                      Connect with Creator
                    </button>
                  )}
                </div>

                {/* Print/Download Badge reference */}
                <div className="border border-white/10 rounded-xl p-3 flex justify-between items-center text-xs bg-[#0a0a0b]">
                  <div>
                    <span className="block text-gray-500 text-[10px] font-bold uppercase tracking-widest">Digital Audit Code</span>
                    <span className="font-mono font-bold text-gray-300">{idea.certificateId}</span>
                  </div>
                  <button 
                    onClick={() => onOpenCertificate(idea)}
                    className="text-orange-400 font-bold hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Award className="w-4 h-4 text-orange-400 animate-pulse" /> Certificate
                  </button>
                </div>

                {/* Comments Section */}
                <div className="space-y-3 text-xs text-left">
                  <h4 className="font-bold text-white uppercase tracking-widest text-[11px]">
                    Social Feedbacks ({idea.comments.length})
                  </h4>

                  {/* Form */}
                  <form onSubmit={handleCommentSubmit} className="flex gap-1.5">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={currentUserEmail ? "Add secure critique..." : "Register user email above to comment..."}
                      disabled={!currentUserEmail}
                      className="flex-1 border border-white/10 rounded-lg px-2.5 py-1.5 bg-[#0a0a0b] text-white text-xs focus:bg-[#0f0f12] focus:ring-1 focus:ring-orange-500 outline-none placeholder:text-gray-600"
                    />
                    <button
                      type="submit"
                      disabled={!currentUserEmail}
                      className="bg-orange-505 bg-orange-500 hover:bg-orange-600 text-white px-2.5 py-1.5 rounded-lg text-xs disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>

                  {/* List of comments */}
                  <div className="max-h-60 overflow-y-auto space-y-2.5 divide-y divide-white/5 pr-1">
                    {idea.comments.length === 0 ? (
                      <p className="text-gray-500 italic text-[11px] text-center py-4">No comments posted yet. Add the first secure comment feedback!</p>
                    ) : (
                      idea.comments.map((comm) => (
                        <div key={comm.id} className="pt-2.5 first:pt-0">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-gray-300 text-[11px] block">{comm.author}</span>
                            <span className="text-[9px] text-gray-500">{new Date(comm.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-gray-400 text-[11px] leading-relaxed mt-0.5">{comm.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
