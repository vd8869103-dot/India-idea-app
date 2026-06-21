import React, { useState, useEffect } from "react";
import { Idea, Investor, Message, Revision, Comment } from "./types";
import IdeaCard from "./components/IdeaCard";
import CreateIdeaModal from "./components/CreateIdeaModal";
import CertificationBadge from "./components/CertificationBadge";
import InvestorList from "./components/InvestorList";
import MessagingPortal from "./components/MessagingPortal";
import { generateSHA256Mock } from "./components/WatermarkEngine";
import { BookOpen, Award, TrendingUp, Mail, Building, ShieldCheck, UserCheck, Plus, Search, Sparkles, Languages, AlertCircle, HelpCircle, ArrowUpRight } from "lucide-react";

export default function App() {
  // -------------------------------------------------------------
  // Current session configuration (Type-in identity simulation)
  // -------------------------------------------------------------
  const [currentUserEmail, setCurrentUserEmail] = useState("vd8869103@gmail.com");
  const [currentUserName, setCurrentUserName] = useState("Vivek Dutt");
  const [currentUserType, setCurrentUserType] = useState<"inventor" | "investor">("inventor");
  const [activeTab, setActiveTab] = useState<"ideas" | "investors" | "messages">("ideas");

  // -------------------------------------------------------------
  // Data State variables
  // -------------------------------------------------------------
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  // UI state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedIdeaForCert, setSelectedIdeaForCert] = useState<Idea | null>(null);
  
  // Connect Message pre-select handles
  const [dmPreSelectEmail, setDmPreSelectEmail] = useState<string | null>(null);
  const [dmPreSelectName, setDmPreSelectName] = useState<string | null>(null);
  const [dmPreSelectIdea, setDmPreSelectIdea] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Technology", "Business", "Education", "Agriculture", "Healthcare", "Creative"];

  // -------------------------------------------------------------
  // Pre-load high fidelity mock seed data (Bilingual India Context focus)
  // -------------------------------------------------------------
  useEffect(() => {
    // 1. Initial Ideas list
    const seedIdeas: Idea[] = [
      {
        id: "seed-idea-1",
        title: "सौर-शिल्प: स्मार्ट कृषक आर्द्रता नियामक (Solar-Shilp Moisture Regulator)",
        description: "कृषि भूमि में कम पानी की खपत सुनिश्चित करने वाला एक वायवीय सौर वाल्व। जो वायुमंडलीय थर्मल तापमान के अनुरूप स्वचालित रूप से पौधों की जड़ों तक न्यूनतम आवश्यक जल वितरित करता है। इसके माध्यम से किसान ८०% तक पानी बचा सकते हैं।",
        detailedBlueprint: "MECHANICAL DESIGN:\n- Direct coupling of solar micro-actuator to localized PVC root emitters.\n- Thermostatic spring made from high-sensitivity shape memory alloy (NiTi).\n- Automatic physical feedback loop: High daylight heat triggers valve dilation; drop in soil moisture increases pore exposure dynamically. No external electrical batteries required. Fully carbon neutral.",
        category: "Agriculture",
        createdAt: "2026-06-15T12:00:00.000Z",
        creatorName: "राजेन्द्र पटेल (Rajendra Patel)",
        creatorEmail: "rajendra.patel@agrilabs-india.com",
        creatorCountry: "India",
        likes: 18,
        likedBy: ["vd8869103@gmail.com"],
        comments: [
          {
            id: "seed-c-1",
            author: "Dr. Sunita Gokhale",
            authorEmail: "sunita.g@amuldairy.org",
            text: "This solves a major groundwater depletion crisis in Pali Rajasthan. Highly recommend immediate patent testing.",
            createdAt: "2026-06-16T08:30:00.000Z"
          }
        ],
        // Sample watermarked illustration placeholder matching our skill instructions
        imageWatermarked: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=800",
        languages: {
          en: "Solar-Shilp Moisture Regulator: A pneumatic solar valve designed to ensure minimum water wastage in arid farming. It automatically expands or contracts using heat memory alloys, delivering tailored micro-drops directly to plant roots. Saves up to 80% of irrigation water.",
          hi: "सौर-शिल्प: स्मार्ट कृषक आर्द्रता नियामक - कृषि भूमि में कम पानी की खपत सुनिश्चित करने वाला एक वायवीय सौर वाल्व। जो वायुमंडलीय थर्मल तापमान के अनुरूप स्वचालित रूप से पौधों की जड़ों तक न्यूनतम आवश्यक जल वितरित करता है।"
        },
        safetyAudit: {
          passed: true,
          score: 98,
          riskNotes: "Excellent novelty rating. Thermal memory alloy combination in soil regulation presents zero patent overrides in current global classification databases.",
          claimsVerification: "Verify target pressure tolerance before finalizing legal patent claims to maximize copyright strength."
        },
        timestampHash: "02xbe5f9da892c900e576f2f23bb6e90145c2ea0f1882bfdc998d7fa8f6ad9d2f",
        certificateId: "IIH-2026-448201",
        versions: [
          {
            version: 1,
            timestamp: "2026-06-15T12:00:00.000Z",
            title: "सौर-शिल्प: स्मार्ट कृषक आर्द्रता नियामक",
            description: "कृषि भूमि में कम पानी की खपत सुनिश्चित करने वाला एक वायवीय सौर वाल्व।",
            changeSummary: "First Registration Submission Seal",
            hash: "02xbe5f9da892c900e576f2f23bb6e90145c2ea0f1882bfdc998d7fa8f6ad9d2f"
          }
        ],
        viewerNDA: true,
        authorizedViewers: ["rajendra.patel@agrilabs-india.com"]
      },
      {
        id: "seed-idea-2",
        title: "Decentralized Dairy Supply Chain Ledger",
        description: "A secure, low-latency micro-ledger designed for rural milk cooperative communities in Gujarat. Uses dynamic QR code generation to track fat content, delivery cold-chain temperatures, and direct-to-bank instant digital UPI payouts for smallholder dairy farmers.",
        detailedBlueprint: "ARCHITECTURAL BLUEPRINT:\n- Lightweight proof-of-authority transaction ledger operating on local village dairy PCs.\n- Integration with smart fat-testing lactometers via Serial-to-Web interfaces.\n- Automatic ledger distribution via periodic decentralized wireless relays.\n- Complete system locks tampering of lactometer records at point-of-collection.",
        category: "Business",
        createdAt: "2026-06-18T10:15:00.000Z",
        creatorName: "Sunita Gokhale",
        creatorEmail: "sunita.g@amuldairy.org",
        creatorCountry: "India",
        likes: 24,
        likedBy: [],
        comments: [],
        imageWatermarked: "https://images.unsplash.com/photo-1527018601619-a508a2fe00cd?auto=format&fit=crop&q=80&w=800",
        languages: {
          en: "Decentralized Dairy Supply Chain Ledger: Secure tracking for rural milk cooperatives ensuring un-tampered quality records and instant UPI banking solutions.",
          hi: "विकेंद्रीकृत डेयरी आपूर्ति श्रृंखला खाता: ग्रामीण दूध सहकारी समितियों के लिए सुरक्षित ट्रैकिंग प्रणाली, जो गुणवत्ता रिकॉर्ड और तत्काल यूपीआई भुगतान समाधान सुनिश्चित करती है।"
        },
        safetyAudit: {
          passed: true,
          score: 93,
          riskNotes: "Matches general decentralized tracking metrics, but proprietary fat-lactometer micro-relay firmware offers unique intellectual claim differentiation.",
          claimsVerification: "Prepare standard software copyright claims centered entirely on the fat-lactometer auto-locking endpoint code."
        },
        timestampHash: "02xcf6b2da892c900e576f2f23bb6e90145c2ea0f1882cd8a2fa8f6ad9d2fab80c",
        certificateId: "IIH-2026-109489",
        versions: [
          {
            version: 1,
            timestamp: "2026-06-18T10:15:00.000Z",
            title: "Decentralized Dairy Supply Chain Ledger",
            description: "A secure, low-latency micro-ledger designed for rural milk cooperative communities in Gujarat.",
            changeSummary: "First Registration Submission Seal",
            hash: "02xcf6b2da892c900e576f2f23bb6e90145c2ea0f1882cd8a2fa8f6ad9d2fab80c"
          }
        ],
        viewerNDA: true,
        authorizedViewers: ["sunita.g@amuldairy.org"]
      }
    ];

    // 2. Initial Investors list
    const seedInvestors: Investor[] = [
      {
        id: "seed-inv-1",
        name: "Aditi Iyer",
        company: "Peak XV Partners (India)",
        sector: ["Technology", "Business", "Healthcare"],
        country: "India",
        bio: "Backing deeptech, sustainable agricultural, and software product models scaling across the Pan-Asia coridores. Based in Bengaluru.",
        fundingLimit: "₹1 CRORE - ₹10 CRORE",
        verificationBadge: true,
        email: "aditi.iyer@peakxv.com"
      },
      {
        id: "seed-inv-2",
        name: "Kenji Takahashi",
        company: "Tokyo EcoTech Fund",
        sector: ["Agriculture", "Technology"],
        country: "Japan",
        bio: "Specializing in global cross-border agritech transfers, green energy patents, and automation infrastructure. Focused on connecting Japanese systems with creative Indian founders.",
        fundingLimit: "₹5 CRORE - ₹50 CRORE",
        verificationBadge: true,
        email: "takahashi@tokyo-ecotech.co.jp"
      },
      {
        id: "seed-inv-3",
        name: "Sanjay Shah",
        company: "Singapore Cross-Border Ventures",
        sector: ["Business", "Education", "Healthcare"],
        country: "Singapore",
        bio: "Assisting Indian scale-ups with global licensing, intellectual protection expansion, and corporate structures in Singapore, Europe, and GCC markets.",
        fundingLimit: "₹2 CRORE - ₹15 CRORE",
        verificationBadge: true,
        email: "shah@singapore-cbv.org"
      }
    ];

    // 3. Initial Message threads
    const seedMessages: Message[] = [
      {
        id: "m-1",
        senderEmail: "aditi.iyer@peakxv.com",
        senderName: "Aditi Iyer",
        receiverEmail: "vd8869103@gmail.com",
        receiverName: "Vivek Dutt",
        content: "Hello Vivek, I reviewed the patent summary of moisture regulation concepts registered under India Idea Hub. I would love to schedule a dynamic review to inspect the secret design formulas. Could you please accept our digital NDA?",
        createdAt: "2026-06-20T14:20:00.000Z",
        ideaTitle: "सौर-शिल्प: स्मार्ट कृषक आर्द्रता नियामक"
      }
    ];

    // Try loading from localStorage first to offer durable cloud-like local persistence
    try {
      const storedIdeas = localStorage.getItem("iih_ideas");
      const storedInvestors = localStorage.getItem("iih_investors");
      const storedMessages = localStorage.getItem("iih_messages");

      if (storedIdeas) setIdeas(JSON.parse(storedIdeas));
      else {
        setIdeas(seedIdeas);
        localStorage.setItem("iih_ideas", JSON.stringify(seedIdeas));
      }

      if (storedInvestors) setInvestors(JSON.parse(storedInvestors));
      else {
        setInvestors(seedInvestors);
        localStorage.setItem("iih_investors", JSON.stringify(seedInvestors));
      }

      if (storedMessages) setMessages(JSON.parse(storedMessages));
      else {
        setMessages(seedMessages);
        localStorage.setItem("iih_messages", JSON.stringify(seedMessages));
      }
    } catch (e) {
      setIdeas(seedIdeas);
      setInvestors(seedInvestors);
      setMessages(seedMessages);
    }
  }, []);

  // Update localStorage hooks
  const saveIdeasToStore = (updatedIdeas: Idea[]) => {
    setIdeas(updatedIdeas);
    try {
      localStorage.setItem("iih_ideas", JSON.stringify(updatedIdeas));
    } catch (e) {
      console.warn("Local storage capacity limit hit, persisting in memory state.");
    }
  };

  const saveInvestorsToStore = (updatedInvestors: Investor[]) => {
    setInvestors(updatedInvestors);
    try {
      localStorage.setItem("iih_investors", JSON.stringify(updatedInvestors));
    } catch (e) {
      console.warn("Local storage write error.");
    }
  };

  const saveMessagesToStore = (updatedMessages: Message[]) => {
    setMessages(updatedMessages);
    try {
      localStorage.setItem("iih_messages", JSON.stringify(updatedMessages));
    } catch (e) {
      console.warn("Local storage write error.");
    }
  };

  // -------------------------------------------------------------
  // Dynamic action handlers
  // -------------------------------------------------------------

  // Like ideas
  const handleLike = (ideaId: string) => {
    const updated = ideas.map((idea) => {
      if (idea.id === ideaId) {
        const likedList = [...idea.likedBy];
        let newLikes = idea.likes;
        
        if (likedList.includes(currentUserEmail)) {
          // Unlike
          const idx = likedList.indexOf(currentUserEmail);
          likedList.splice(idx, 1);
          newLikes = Math.max(0, newLikes - 1);
        } else {
          // Like
          likedList.push(currentUserEmail);
          newLikes += 1;
        }

        return { ...idea, likes: newLikes, likedBy: likedList };
      }
      return idea;
    });
    saveIdeasToStore(updated);
  };

  // Add Comment feedback
  const handleAddComment = (ideaId: string, commentText: string) => {
    const newCommentObj: Comment = {
      id: "comment-" + Date.now(),
      author: currentUserName || "Anonymous Stakeholder",
      authorEmail: currentUserEmail,
      text: commentText,
      createdAt: new Date().toISOString()
    };

    const updated = ideas.map((idea) => {
      if (idea.id === ideaId) {
        return {
          ...idea,
          comments: [...idea.comments, newCommentObj]
        };
      }
      return idea;
    });
    saveIdeasToStore(updated);
  };

  // Create an Idea addition from Modal
  const handleAddNewIdeaSubmit = (newIdea: Idea) => {
    const updated = [newIdea, ...ideas];
    saveIdeasToStore(updated);
    setShowCreateModal(false);
  };

  // Revert Version Control roll-back logic
  const handleRevertVersion = (ideaId: string, targetRevision: Revision) => {
    const updated = ideas.map((idea) => {
      if (idea.id === ideaId) {
        // Rollback details
        const revertedHash = generateSHA256Mock(targetRevision.title + " " + targetRevision.description + " rollback");
        
        const newRevisionRecord: Revision = {
          version: (idea.versions?.length || 1) + 1,
          timestamp: new Date().toISOString(),
          title: targetRevision.title,
          description: targetRevision.description,
          changeSummary: `Reverted rollback to Edition index v${targetRevision.version}.0`,
          hash: revertedHash
        };

        return {
          ...idea,
          title: targetRevision.title,
          description: targetRevision.description,
          timestampHash: revertedHash,
          versions: [...idea.versions, newRevisionRecord]
        };
      }
      return idea;
    });
    saveIdeasToStore(updated);
  };

  // Register New investor portfolio
  const handleRegisterInvestor = (newInv: Investor) => {
    const updated = [newInv, ...investors];
    saveInvestorsToStore(updated);
  };

  // Initiate direct communication context
  const handleInitiateContact = (receiverEmail: string, receiverName: string, ideaTitle: string) => {
    setDmPreSelectEmail(receiverEmail);
    setDmPreSelectName(receiverName);
    setDmPreSelectIdea(ideaTitle);
    
    // Jump to chat tab
    setActiveTab("messages");
  };

  // Submit direct message
  const handleSendPrivateMessage = (
    receiverEmail: string,
    receiverName: string,
    content: string,
    ideaTitle?: string
  ) => {
    const newMsg: Message = {
      id: "msg-" + Date.now(),
      senderEmail: currentUserEmail,
      senderName: currentUserName,
      receiverEmail,
      receiverName,
      content,
      createdAt: new Date().toISOString(),
      ideaTitle
    };

    const updated = [...messages, newMsg];
    saveMessagesToStore(updated);

    // Clear pre-selected states since thread is now officially initiated
    setDmPreSelectEmail(null);
    setDmPreSelectName(null);
    setDmPreSelectIdea(null);
  };

  // Filter ideas based on search and selected category filter
  const filteredIdeas = ideas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.creatorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "All" || idea.category.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Calculate highest trending ideas (based on likes and novelty score combined)
  const trendingIdeas = [...ideas]
    .sort((a, b) => {
      const scoreA = a.likes * 2 + (a.safetyAudit?.score || 90);
      const scoreB = b.likes * 2 + (b.safetyAudit?.score || 90);
      return scoreB - scoreA;
    })
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-gray-200 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* 1. SECURE TOP NAVIGATION HEADER */}
      <header className="bg-[#0f0f12] border-b border-white/10 py-3.5 px-4 sm:px-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Logo Brand Brandings */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-tr from-orange-500 to-indigo-600 rounded-lg flex items-center justify-center font-bold text-white text-lg shadow-sm leading-none">
              I
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white uppercase flex items-center gap-1.5 leading-none">
                India<span className="text-orange-500 underline decoration-2 underline-offset-4">Idea</span>Hub
                <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[9px] font-bold px-2 py-0.5 rounded-full tracking-widest font-sans scale-90">
                  IP-PORTAL
                </span>
              </h1>
              <p className="text-[10px] text-gray-500 tracking-wider font-semibold uppercase mt-0.5">
                Digital Intellectual Property Integrity & Investment Bureau
              </p>
            </div>
          </div>

          {/* Interactive session identity setup */}
          <div className="bg-[#141418] border border-white/10 p-2 rounded-xl flex items-center gap-3 text-xs w-full sm:w-auto">
            {/* Session account fields */}
            <div className="grid grid-cols-2 gap-2 text-left">
              <div>
                <span className="block text-[8px] font-bold text-gray-500 uppercase">Active Profile Name</span>
                <input
                  type="text"
                  value={currentUserName}
                  onChange={(e) => setCurrentUserName(e.target.value)}
                  className="font-bold text-white bg-transparent py-0.5 border-b border-dashed border-white/20 focus:border-orange-500 outline-none w-28 text-xs"
                />
              </div>
              <div>
                <span className="block text-[8px] font-bold text-gray-500 uppercase">Registered Email</span>
                <input
                  type="email"
                  value={currentUserEmail}
                  onChange={(e) => {
                    const mail = e.target.value;
                    setCurrentUserEmail(mail);
                  }}
                  className="font-mono text-xs text-gray-300 bg-transparent py-0.5 border-b border-dashed border-white/20 focus:border-orange-500 outline-none w-36"
                />
              </div>
            </div>

            <div className="h-8 w-px bg-white/10" />

            {/* Selector status */}
            <div className="flex flex-col gap-1 items-start">
              <span className="text-[8px] font-bold text-gray-500 uppercase">Role Mode</span>
              <div className="flex bg-[#1a1a1e] border border-white/10 rounded p-0.5">
                <button
                  onClick={() => setCurrentUserType("inventor")}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all ${
                    currentUserType === "inventor" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Inventor
                </button>
                <button
                  onClick={() => setCurrentUserType("investor")}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all ${
                    currentUserType === "investor" ? "bg-orange-500 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Investor
                </button>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* 2. SUB-BAR INFO BULLETIN */}
      <section className="bg-[#0a0a0b] text-gray-400 py-2.5 px-4 text-center text-xs flex flex-col sm:flex-row justify-center items-center gap-2 border-b border-white/5">
        <span className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold px-2.5 py-0.5 rounded text-[10px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> SECURE REGISTER VERIFIED
        </span>
        <p className="text-[11px] leading-relaxed">
          <strong>Cross-Border Connected:</strong> Under Indian Patents Act 2026 guidelines, uploaded materials are sealed on the canvas & translated via Gemini to enable direct global venture connectivity securely.
        </p>
      </section>

      {/* 3. MAIN DASHBOARD CONTENT AREA */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        
        {/* TAB NAVIGATION ROW */}
        <div className="flex border border-white/10 bg-[#0f0f12] p-1 rounded-xl gap-1 max-w-md">
          <button
            onClick={() => setActiveTab("ideas")}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 outline-none ${
              activeTab === "ideas" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "text-gray-400 border border-transparent hover:text-white hover:bg-white/5"
            }`}
          >
            <BookOpen className="w-4 h-4" /> Discover Ideas Feed
          </button>
          
          <button
            onClick={() => setActiveTab("investors")}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 outline-none ${
              activeTab === "investors" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "text-gray-400 border border-transparent hover:text-white hover:bg-white/5"
            }`}
          >
            <Building className="w-4 h-4" /> Investors Directory
          </button>
          
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 outline-none relative ${
              activeTab === "messages" ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" : "text-gray-400 border border-transparent hover:text-white hover:bg-white/5"
            }`}
          >
            <Mail className="w-4 h-4" /> Secure Messenger
            {messages.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center animate-pulse">
                {messages.length}
              </span>
            )}
          </button>
        </div>

        {/* ========================================== */}
        {/* TAB 1: IDEAS FEED DISCOVERY */}
        {/* ========================================== */}
        {activeTab === "ideas" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            
            {/* Left Col: Filters & Trending high scores */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Creator upload button panel */}
              <div className="bg-[#0f0f12] border border-white/10 rounded-2xl p-4 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto border border-orange-500/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Protected Registration</h3>
                  <p className="text-[10.5px] text-gray-400 mt-1">
                    Upload your technical inventions or business drafts securely. Instant timestamp hash index.
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1"
                >
                  <Plus className="w-4 h-4 text-white" /> Share New Invention
                </button>
              </div>

              {/* Categories filters vertical */}
              <div className="bg-[#0f0f12] border border-white/10 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-500">
                  Concept Classifications
                </h4>
                <div className="flex flex-wrap lg:flex-col gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`text-left px-3 py-1.5 rounded-lg text-xs font-semibold block transition-all w-full ${
                        activeCategory === cat
                          ? "bg-white/10 text-white font-bold border-l-2 border-orange-500"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {cat === "All" ? "All Classifications" : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Ideas Highlights ( likes or novelty score ) */}
              <div className="bg-[#0f0f12] border border-white/10 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-orange-400" /> Top Patent-Plausible
                </h4>

                <div className="space-y-3 divide-y divide-white/5">
                  {trendingIdeas.map((idea, i) => (
                    <div key={idea.id} className="pt-3 first:pt-0 text-left space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[9px] font-black font-mono w-4 h-4 rounded-full flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase">{idea.category}</span>
                      </div>
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); setSearchQuery(idea.title); }}
                        className="text-gray-200 font-bold text-xs hover:text-orange-400 hover:underline block leading-snug line-clamp-2"
                      >
                        {idea.title}
                      </a>
                      <div className="flex justify-between items-center text-[10px] text-gray-400 pt-0.5">
                        <span>Score: <strong>{idea.safetyAudit?.score || 92}%</strong></span>
                        <span>{idea.likes} Likes</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right 3 Col: Big Idea Registry search and results layout */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Search Bar Block */}
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Query by patent index, founder, category keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-24 py-2.5 border border-white/10 rounded-2xl bg-[#0f0f12] text-white text-xs sm:text-sm focus:ring-1 focus:ring-orange-500 focus:bg-[#141418] outline-none transition-all placeholder:text-gray-500"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-2.5 bg-white/10 text-gray-300 hover:bg-white/20 rounded-md text-[10px] sm:text-xs font-bold px-2 py-1"
                  >
                    Clear Search
                  </button>
                )}
              </div>

              {/* Ideas grid list */}
              {filteredIdeas.length === 0 ? (
                <div className="text-center py-20 bg-[#0f0f12] border border-white/10 rounded-3xl p-6">
                  <ShieldCheck className="w-12 h-12 text-gray-600 mx-auto stroke-1 mb-2" />
                  <h3 className="font-black text-white text-lg">No Sealed Intellectual Concepts Found</h3>
                  <p className="text-gray-400 text-xs mt-1 max-w-sm mx-auto">
                    No verified patents match your active keywords or category classes. Clear filters to expand your index search.
                  </p>
                  <button
                    onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}
                    className="text-orange-400 hover:underline font-bold text-xs mt-4 block mx-auto"
                  >
                    Reset Portal View
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredIdeas.map((idea) => (
                    <IdeaCard
                      key={idea.id}
                      idea={idea}
                      currentUserEmail={currentUserEmail}
                      onLike={handleLike}
                      onAddComment={handleAddComment}
                      onOpenCertificate={(selected) => setSelectedIdeaForCert(selected)}
                      onInitiateContact={handleInitiateContact}
                      onRevertVersion={handleRevertVersion}
                    />
                  ))}
                </div>
              )}

            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: INVESTOR DIRECTORY */}
        {/* ========================================== */}
        {activeTab === "investors" && (
          <div className="bg-[#0f0f12] border border-white/10 rounded-3xl p-6">
            <InvestorList
              investorList={investors}
              onRegisterInvestor={handleRegisterInvestor}
              onInitiateContact={(partner) => {
                handleInitiateContact(
                  partner.email,
                  partner.name,
                  "Investor general connection inquiry"
                );
              }}
              currentUserEmail={currentUserEmail}
            />
          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: PROTECTED MESSENGER PORTAL */}
        {/* ========================================== */}
        {activeTab === "messages" && (
          <div className="space-y-4">
            <MessagingPortal
              messages={messages}
              currentUserEmail={currentUserEmail}
              onSendMessage={handleSendPrivateMessage}
              activePreSelectedEmail={dmPreSelectEmail}
              activePreSelectedName={dmPreSelectName}
              activePreSelectedIdea={dmPreSelectIdea}
            />
          </div>
        )}

      </main>

      {/* 4. FOOTER SECURED METADATA */}
      <footer className="bg-[#0f0f12] border-t border-white/10 py-6 text-center text-gray-500 text-xs mt-auto font-sans">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="text-gray-300 font-bold">India Idea Hub © 2026</p>
          <p className="text-[10px] leading-relaxed max-w-xl mx-auto text-gray-500">
            Protected under intellectual property conservation protocols. Server side operations governed by Gemini Multilingual IP audit indexes. Direct financial connections take place under independent verified non-disclosure covenants.
          </p>
        </div>
      </footer>

      {/* ========================================== */}
      {/* POPUP MODALS AREA */}
      {/* ========================================== */}
      {showCreateModal && (
        <CreateIdeaModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleAddNewIdeaSubmit}
          currentUserEmail={currentUserEmail}
          currentUserName={currentUserName}
        />
      )}

      {selectedIdeaForCert && (
        <CertificationBadge
          idea={selectedIdeaForCert}
          onClose={() => setSelectedIdeaForCert(null)}
        />
      )}

    </div>
  );
}
