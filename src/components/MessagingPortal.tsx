import React, { useState } from "react";
import { Message } from "../types";
import { Send, User, ShieldCheck, Mail, ArrowLeft } from "lucide-react";

interface MessagingPortalProps {
  messages: Message[];
  currentUserEmail: string | null;
  onSendMessage: (receiverEmail: string, receiverName: string, content: string, ideaTitle?: string) => void;
  activePreSelectedEmail?: string | null; // Trigger chat focus on connect
  activePreSelectedName?: string | null;
  activePreSelectedIdea?: string | null;
}

export default function MessagingPortal({
  messages,
  currentUserEmail,
  onSendMessage,
  activePreSelectedEmail = null,
  activePreSelectedName = null,
  activePreSelectedIdea = null
}: MessagingPortalProps) {
  // Extract all distinct correspondence emails/names from global message list
  const getThreads = () => {
    const threadsMap = new Map<string, { name: string; latestText: string; ideaTitle?: string; timestamp: string }>();

    // Always pre-populate the selected partner if provided to guarantee instant focus
    if (activePreSelectedEmail && activePreSelectedName) {
      threadsMap.set(activePreSelectedEmail, {
        name: activePreSelectedName,
        latestText: activePreSelectedIdea ? `Interested in concept: ${activePreSelectedIdea}` : "Initiate safe messaging...",
        ideaTitle: activePreSelectedIdea || undefined,
        timestamp: new Date().toISOString()
      });
    }

    // Accumulate other historical messages
    messages.forEach((msg) => {
      const partnerEmail = msg.senderEmail === currentUserEmail ? msg.receiverEmail : msg.senderEmail;
      const partnerName = msg.senderEmail === currentUserEmail ? msg.receiverName : msg.senderName;
      
      const currentVal = threadsMap.get(partnerEmail);
      // Keep latest message content
      if (!currentVal || new Date(msg.createdAt) > new Date(currentVal.timestamp)) {
        threadsMap.set(partnerEmail, {
          name: partnerName,
          latestText: msg.content,
          ideaTitle: msg.ideaTitle,
          timestamp: msg.createdAt
        });
      }
    });

    return Array.from(threadsMap.entries()).map(([email, info]) => ({
      email,
      ...info
    }));
  };

  const threads = getThreads();
  const initialActiveEmail = activePreSelectedEmail || (threads.length > 0 ? threads[0].email : "");
  const [activePartnerEmail, setActivePartnerEmail] = useState(initialActiveEmail);
  const [replyText, setReplyText] = useState("");

  // Sync state if pre-selected contact changes
  React.useEffect(() => {
    if (activePreSelectedEmail) {
      setActivePartnerEmail(activePreSelectedEmail);
    }
  }, [activePreSelectedEmail]);

  const activeThread = threads.find((t) => t.email === activePartnerEmail);

  // Filter messages for active discussion
  const activeChatMessages = messages.filter(
    (msg) =>
      (msg.senderEmail === currentUserEmail && msg.receiverEmail === activePartnerEmail) ||
      (msg.senderEmail === activePartnerEmail && msg.receiverEmail === currentUserEmail)
  ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  // Submit reply
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activePartnerEmail || !activeThread) return;

    onSendMessage(
      activePartnerEmail,
      activeThread.name,
      replyText.trim(),
      activeThread.ideaTitle
    );
    setReplyText("");
  };

  return (
    <div className="bg-[#0f0f12] border border-white/10 rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-3 h-[580px]">
      
      {/* Threads list Column */}
      <div className={`border-r border-white/10 flex flex-col bg-[#0a0a0b] ${activePartnerEmail && "hidden md:flex"}`}>
        <div className="p-4 border-b border-white/10 bg-[#0f0f12]">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            Secure Communications Ledger
          </h3>
          <p className="text-gray-400 text-[11px] mt-0.5">
            Encrypted tunnel. Direct messages between authenticated stakeholders.
          </p>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {threads.length === 0 ? (
            <div className="text-center p-8 text-gray-500">
              <Mail className="w-8 h-8 mx-auto stroke-1 mb-2 text-gray-600" />
              <p className="text-xs">No active discussions found.</p>
              <p className="text-[10px] mt-1 text-gray-500 italic">
                Select an idea or inventor, then connect to begin negotiating.
              </p>
            </div>
          ) : (
            threads.map((th) => {
              const isActive = th.email === activePartnerEmail;
              return (
                <button
                  key={th.email}
                  onClick={() => setActivePartnerEmail(th.email)}
                  className={`w-full text-left p-4 hover:bg-white/5 transition-all block relative cursor-pointer ${
                    isActive ? "bg-[#141418] border-l-4 border-orange-500 font-medium" : ""
                  }`}
                >
                  <div className="flex justify-between items-start gap-1">
                    <span className="text-xs font-bold text-gray-200 tracking-tight block">
                      {th.name}
                    </span>
                    <span className="text-[9px] text-gray-500 text-nowrap">
                      {new Date(th.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 block truncate mt-1">
                    {th.latestText}
                  </span>
                  {th.ideaTitle && (
                    <span className="mt-1.5 inline-block bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[9px] px-1.5 py-0.5 rounded font-mono truncate max-w-full">
                      Ref: {th.ideaTitle}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Conversation dialogue Column */}
      <div className={`col-span-1 md:col-span-2 flex flex-col bg-[#0f0f12] ${!activePartnerEmail && "hidden md:flex"}`}>
        {activePartnerEmail && activeThread ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0f0f12]">
              <div className="flex items-center gap-2.5">
                {/* Mobile Back Button */}
                <button
                  onClick={() => setActivePartnerEmail("")}
                  className="md:hidden p-1 hover:bg-white/5 rounded text-gray-400"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-orange-400 font-bold flex items-center justify-center text-sm shadow-inner">
                  {activeThread.name.slice(0, 2).toUpperCase()}
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white leading-tight flex items-center gap-1">
                    {activeThread.name}
                    <span className="inline-flex w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  </h4>
                  <p className="text-[11px] text-gray-450 text-gray-400">{activePartnerEmail}</p>
                </div>
              </div>

              <div className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-white/5 border border-white/15 text-gray-300 font-bold px-2 py-1 rounded-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-450 text-orange-400" /> SECURE TUNNEL
              </div>
            </div>

            {/* Message Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0b]">
              {/* NDA Protective watermark wrapper to align with safety theme */}
              <div className="text-center py-2 px-3 border border-white/10 bg-[#141418] rounded-lg text-[10px] text-gray-400 max-w-xs mx-auto italic">
                🇮🇳 Safe Communication Protocols: Avoid exchanging sensitive bank coordinates directly. Use India Idea Hub channels.
              </div>

              {activeChatMessages.map((msg) => {
                const isMe = msg.senderEmail === currentUserEmail;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-md rounded-2xl p-3 text-xs leading-relaxed ${
                        isMe
                          ? "bg-orange-500 text-white rounded-tr-none"
                          : "bg-white/5 border border-white/10 text-gray-205 text-gray-200 rounded-tl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] text-gray-500 mt-1 px-1">
                      <span>{isMe ? "You" : msg.senderName}</span>
                      <span>•</span>
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message compose bar */}
            <form onSubmit={handleSend} className="p-3 border-t border-white/10 bg-[#0f0f12]">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Send secure reply to ${activeThread.name}...`}
                  className="flex-1 border border-white/10 rounded-xl px-4 py-2 bg-[#0a0a0b] text-white text-xs focus:bg-[#141418] focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-650 placeholder:text-gray-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-xs font-semibold">Send</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-gray-500 p-8">
            <User className="w-12 h-12 stroke-1 mb-2 text-gray-600" />
            <h4 className="font-bold text-white mb-1">No Conversant Chosen</h4>
            <p className="text-xs text-center max-w-sm text-gray-400">
              Please choose an active dialogue thread on the port list to negotiate agreements or invest capital.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
