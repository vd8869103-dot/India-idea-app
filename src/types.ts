export interface Comment {
  id: string;
  author: string;
  authorEmail: string;
  text: string;
  createdAt: string;
}

export interface Revision {
  version: number;
  timestamp: string;
  title: string;
  description: string;
  changeSummary: string;
  hash: string;
}

export interface SafetyAudit {
  passed: boolean;
  score: number;
  riskNotes: string;
  claimsVerification: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  detailedBlueprint?: string;
  category: string;
  createdAt: string;
  creatorName: string;
  creatorEmail: string;
  creatorCountry: string;
  likes: number;
  likedBy: string[]; // List of user emails
  comments: Comment[];
  imageWatermarked?: string; // Base64 or mock URL
  videoWatermarked?: string; // Mock URL/indicator
  languages: {
    en: string; // English translation/original
    hi: string; // Hindi translation/original
    otherCode?: string; // e.g. "es" or "ja"
    otherText?: string; // translated content
  };
  safetyAudit?: SafetyAudit;
  timestampHash: string; // SHA-256 styled unique hash
  certificateId: string; // Unique certificate serial number
  versions: Revision[];
  viewerNDA: boolean; // NDA status to protect content
  authorizedViewers: string[]; // list of user emails authorized to view high-detail NDA and blueprint
}

export interface Message {
  id: string;
  senderEmail: string;
  senderName: string;
  receiverEmail: string;
  receiverName: string;
  content: string;
  createdAt: string;
  ideaTitle?: string;
}

export interface Investor {
  id: string;
  name: string;
  company: string;
  sector: string[];
  country: string;
  bio: string;
  fundingLimit: string;
  verificationBadge: boolean;
  email: string;
}
