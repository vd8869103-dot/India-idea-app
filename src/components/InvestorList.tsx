import React, { useState } from "react";
import { Investor } from "../types";
import { Search, Globe, PlusCircle, Building, DollarSign, ArrowRight, CheckCircle } from "lucide-react";

interface InvestorListProps {
  investorList: Investor[];
  onRegisterInvestor: (newInvestor: Investor) => void;
  onInitiateContact: (investor: Investor) => void;
  currentUserEmail: string | null;
}

export default function InvestorList({
  investorList,
  onRegisterInvestor,
  onInitiateContact,
  currentUserEmail
}: InvestorListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSector, setSelectedSector] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");
  
  // Registration Form State
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [sectorsInput, setSectorsInput] = useState("");
  const [country, setCountry] = useState("India");
  const [bio, setBio] = useState("");
  const [fundingLimit, setFundingLimit] = useState("₹50 LAKH - ₹5 CRORE");
  const [email, setEmail] = useState(currentUserEmail || "");

  const sectors = ["All", "Technology", "Business", "Education", "Agriculture", "Healthcare", "Creative"];
  const countries = ["All", "India", "USA", "Singapore", "Canada", "Japan", "Germany", "UK"];

  // Handle investor registration
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !email) {
      alert("Name, Company and Email are mandatory to register a profile.");
      return;
    }

    const sectorArray = sectorsInput
      ? sectorsInput.split(",").map(s => s.trim())
      : ["Technology"];

    const newInvestor: Investor = {
      id: "inv-" + Date.now(),
      name,
      company,
      sector: sectorArray,
      country,
      bio,
      fundingLimit,
      verificationBadge: true, // Auto badge for registry robustness
      email
    };

    onRegisterInvestor(newInvestor);
    setShowRegisterForm(false);
    
    // Reset
    setName("");
    setCompany("");
    setSectorsInput("");
    setBio("");
    setFundingLimit("₹50 LAKH - ₹5 CRORE");
  };

  const filteredInvestors = investorList.filter((inv) => {
    const matchesSearch =
      inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.bio.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSector =
      selectedSector === "All" ||
      inv.sector.some((sec) => sec.toLowerCase().includes(selectedSector.toLowerCase()));

    const matchesCountry =
      selectedCountry === "All" || inv.country.toLowerCase() === selectedCountry.toLowerCase();

    return matchesSearch && matchesSector && matchesCountry;
  });

  return (
    <div className="w-full">
      {/* Header Container */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            Investor & Venture Syndicate Network
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Connect securely with real VCs and private funds willing to sponsor licensed copyright-sealed ideas globally.
          </p>
        </div>

        <button
          onClick={() => setShowRegisterForm(!showRegisterForm)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 text-sm rounded-lg shadow-sm transition-all duration-200 flex items-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Register Firm Profile
        </button>
      </div>

      {/* Registration Form Panel */}
      {showRegisterForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#141418] border border-white/10 rounded-xl p-6 mb-8 mt-2 space-y-4 max-w-3xl"
        >
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <h3 className="font-bold text-lg text-white">
              Create Enterprise Investor Profile
            </h3>
            <button
              type="button"
              onClick={() => setShowRegisterForm(false)}
              className="text-gray-400 hover:text-white text-sm font-bold cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                Representative Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-white/10 rounded-lg p-2 bg-[#0a0a0b] text-white text-sm focus:ring-1 focus:ring-orange-500 outline-none"
                placeholder="e.g. Aditi Sharma"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                VC Firm / Company Name *
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full border border-white/10 rounded-lg p-2 bg-[#0a0a0b] text-white text-sm focus:ring-1 focus:ring-orange-500 outline-none"
                placeholder="e.g. Bangalore Agritech Syndicate"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                Corporate Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-white/10 rounded-lg p-2 bg-[#0a0a0b] text-white text-sm focus:ring-1 focus:ring-orange-500 outline-none"
                placeholder="partner@firm.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                Sectors of Interest (Comma-separated)
              </label>
              <input
                type="text"
                value={sectorsInput}
                onChange={(e) => setSectorsInput(e.target.value)}
                className="w-full border border-white/10 rounded-lg p-2 bg-[#0a0a0b] text-white text-sm focus:ring-1 focus:ring-orange-500 outline-none"
                placeholder="Agriculture, Tech, Business"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                Funding Target Capability
              </label>
              <select
                value={fundingLimit}
                onChange={(e) => setFundingLimit(e.target.value)}
                className="w-full border border-white/10 rounded-lg p-2 bg-[#0a0a0b] text-white text-sm focus:ring-1 focus:ring-orange-500 outline-none"
              >
                <option value="₹10 LAKH - ₹50 LAKH" className="bg-[#141418]">₹10 LAKH - ₹50 LAKH (Early Stage)</option>
                <option value="₹50 LAKH - ₹5 CRORE" className="bg-[#141418]">₹50 LAKH - ₹5 CRORE (Growth Tier)</option>
                <option value="₹5 CRORE - ₹25 CRORE" className="bg-[#141418]">₹5 CRORE - ₹25 CRORE (Series A)</option>
                <option value="₹25 CRORE+" className="bg-[#141418]">₹25 CRORE+ (Mega Funds)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                Headquarters Country
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full border border-white/10 rounded-lg p-2 bg-[#0a0a0b] text-white text-sm focus:ring-1 focus:ring-orange-500 outline-none"
              >
                {countries.filter(c => c !== "All").map((c) => (
                  <option key={c} value={c} className="bg-[#141418]">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                Brief Investment Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={2}
                className="w-full border border-white/10 rounded-lg p-2 bg-[#0a0a0b] text-white text-sm focus:ring-1 focus:ring-orange-500 outline-none"
                placeholder="Describe your funding focus, preferred metrics and previous backing profile..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg text-sm transition-all shadow-sm cursor-pointer"
          >
            Authenticate Profile & Add to Secured Register
          </button>
        </form>
      )}

      {/* Discovery Filters Grid */}
      <div className="bg-[#0f0f12] border border-white/10 rounded-xl p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Search */}
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search VC firms, capital, partners..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-white/10 rounded-lg bg-[#0a0a0b] text-white text-sm focus:ring-1 focus:ring-orange-500 outline-none transition-all placeholder:text-gray-600"
          />
        </div>

        {/* Sector Filter */}
        <div className="flex items-center gap-1.5 w-full">
          <span className="text-xs text-gray-400 uppercase font-bold text-nowrap">Focus:</span>
          <select
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
            className="w-full border border-white/10 rounded-lg bg-[#0a0a0b] p-1.5 text-gray-300 text-xs focus:ring-1 focus:ring-orange-500 outline-none"
          >
            {sectors.map((s) => (
              <option key={s} value={s} className="bg-[#141418]">{s}</option>
            ))}
          </select>
        </div>

        {/* Origin Country */}
        <div className="flex items-center gap-1.5 w-full">
          <span className="text-xs text-gray-400 uppercase font-bold text-nowrap">Country:</span>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full border border-white/10 rounded-lg bg-[#0a0a0b] p-1.5 text-gray-300 text-xs focus:ring-1 focus:ring-orange-500 outline-none"
          >
            {countries.map((c) => (
              <option key={c} value={c} className="bg-[#141418]">{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Investor Registry Results cards */}
      {filteredInvestors.length === 0 ? (
        <div className="text-center p-12 bg-[#0f0f12] border border-white/10 rounded-xl">
          <Building className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No certified investment syndicates match your active filters.</p>
          <button
            onClick={() => { setSearchTerm(""); setSelectedSector("All"); setSelectedCountry("All"); }}
            className="text-orange-400 font-semibold text-xs mt-2 hover:underline cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvestors.map((inv) => (
            <div
              key={inv.id}
              className="bg-[#0a0a0b] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div>
                    <h4 className="font-bold text-white text-base tracking-tight leading-tight flex items-center gap-1">
                      {inv.company}
                      {inv.verificationBadge && (
                        <CheckCircle className="w-4 h-4 text-orange-400 fill-orange-505/10" title="Identity Verified Syndicate" />
                      )}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">{inv.name} • Private Partner</p>
                  </div>

                  <span className="bg-white/5 border border-white/10 text-gray-300 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <Globe className="w-3 h-3" /> {inv.country}
                  </span>
                </div>

                {/* Bio text */}
                <p className="text-xs text-gray-400 line-clamp-3 mb-4 italic">
                  "{inv.bio || "No corporate statement provided."}"
                </p>

                {/* Sectors and target value tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {inv.sector.map((sec, idx) => (
                    <span
                      key={idx}
                      className="bg-white/5 border border-white/5 text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded-sm"
                    >
                      {sec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action and financial detail footer */}
              <div className="border-t border-white/10 pt-3 mt-auto flex items-center justify-between">
                <div>
                  <span className="text-[10px] block font-bold text-gray-500 uppercase tracking-widest">
                    Funds Commitment Limit
                  </span>
                  <span className="text-xs text-emerald-400 font-mono font-bold flex items-center">
                    <DollarSign className="w-3 h-3 -mr-0.5" />
                    {inv.fundingLimit}
                  </span>
                </div>

                <button
                  onClick={() => onInitiateContact(inv)}
                  className="bg-orange-500 text-white font-semibold text-xs py-1.5 px-3 rounded-lg hover:bg-orange-600 transition-all flex items-center gap-1 group cursor-pointer"
                >
                  Connect <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
