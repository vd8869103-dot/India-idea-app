import React, { useState, useEffect } from "react";
import { Idea, Investor, Message, Revision, Comment } from "./types";
import IdeaCard from "./components/IdeaCard";
import CreateIdeaModal from "./components/CreateIdeaModal";
import CertificationBadge from "./components/CertificationBadge";
import InvestorList from "./components/InvestorList";
import MessagingPortal from "./components/MessagingPortal";
import { generateSHA256Mock } from "./components/WatermarkEngine";
import { BookOpen, Award, TrendingUp, Mail, Building, ShieldCheck, UserCheck, Plus, Search, Sparkles, Languages, AlertCircle, HelpCircle, ArrowUpRight } from "lucide-react";
 {export default function App() {
  return (
    <div>
      <h1>India Idea Hub 🚀</h1>
      <p>Website is working!</p>
    </div>
  );
}
  // -------------------------------------------------------------
  Current session configuration (Type-in identity simulation)
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
    / 1. Initial Ideas list
    const seedIdeas: Idea[] = [
      
