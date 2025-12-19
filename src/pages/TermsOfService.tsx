import React, { useMemo, useState, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import {
  FileText,
  Info,
  Phone,
  ShieldAlert,
  AlertTriangle,
  Scale,
  Shield,
  Lock,
  Eye,
  Gavel,
  Ban,
  UserX,
  CreditCard,
  Truck,
  Package,
  AlertCircle,
  FileWarning,
  Fingerprint,
  Globe,
  BookOpen,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Scroll,
  BadgeAlert,
  Siren,
  HandCoins,
  Receipt,
  MapPin,
  Building2,
  Landmark,
  Users,
  Mail,
  PhoneCall,
  Copyright,
  Bookmark,
  ListChecks,
  RefreshCw,
  Zap,
  Server,
  Database,
  Key,
  ShieldCheck,
  ShieldX,
  UserCheck,
  FileCheck,
  FileClock,
  FileX,
  Banknote,
  IndianRupee,
  TriangleAlert,
  OctagonAlert,
  CircleAlert,
  BadgeX,
  BadgeCheck,
  ScrollText,
  BookMarked,
  LibraryBig,
  Wallet,
  HandshakeIcon,
  FileQuestion,
  FilePen,
  FileSearch,
  FileLock,
  FileKey,
  FileStack,
  FolderLock,
  FolderKey,
  MonitorSmartphone,
  Wifi,
  WifiOff,
  Activity,
  BarChart3,
  PieChart,
  TrendingUp,
  Timer,
  CalendarClock,
  CalendarX,
  CalendarCheck,
  MapPinned,
  Navigation,
  Route,
  Milestone,
  Flag,
  Target,
  Crosshair,
  Search,
  ScanLine,
  ScanSearch,
  Filter,
  Settings,
  Wrench,
  Hammer,
  Construction,
  HardHat,
  Cone,
  AlertOctagon,
  Megaphone,
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Video,
  VideoOff,
  Image,
  ImageOff,
  FileImage,
  FileVideo,
  FileAudio,
  File,
  Files,
  Folder,
  FolderOpen,
  FolderClosed,
  Archive,
  Trash2,
  Eraser,
  Scissors,
  Copy,
  Clipboard,
  ClipboardCheck,
  ClipboardX,
  ClipboardList,
  ClipboardCopy,
  ClipboardPaste,
  ClipboardType,
  ClipboardSignature,
  Stamp,
  PenTool,
  Pencil,
  Edit,
  Edit2,
  Edit3,
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ListTree,
  ListTodo,
  ListFilter,
  ListPlus,
  ListMinus,
  ListX,
  ListRestart,
  ListEnd,
  ListStart,
  ListVideo,
  ListMusic,
  ListCollapse,
  LayoutList,
  LayoutGrid,
  LayoutDashboard,
  LayoutTemplate,
  LayoutPanelLeft,
  LayoutPanelTop,
  Columns,
  Rows,
  Table,
  Table2,
  TableProperties,
  Grid,
  Grid2X2,
  Grid3X3,
  Square,
  SquareStack,
  Layers,
  Layers2,
  Layers3,
  Component,
  Puzzle,
  Box,
  Boxes,
  PackageCheck,
  PackageX,
  PackageSearch,
  PackagePlus,
  PackageMinus,
  PackageOpen,
  Gift,
  ShoppingCart,
  ShoppingBag,
  Store,
  Storefront,
  Building,
  Home,
  House,
  Factory,
  Warehouse,
  Hotel,
  School,
  GraduationCap,
  BookOpenCheck,
  BookText,
  BookCopy,
  BookType,
  BookA,
  BookAudio,
  BookDashed,
  BookDown,
  BookUp,
  BookLock,
  BookKey,
  BookHeart,
  BookUser,
  BookPlus,
  BookMinus,
  BookX,
  Notebook,
  NotebookPen,
  NotebookText,
  NotebookTabs,
  StickyNote,
  NotepadText,
  NotepadTextDashed,
  FileSpreadsheet,
  FileJson,
  FileJson2,
  FileCode,
  FileCode2,
  FileTerminal,
  FileType,
  FileType2,
  FileBadge,
  FileBadge2,
  FileChart,
  FileChartColumn,
  FileChartLine,
  FileChartPie,
  FileDigit,
  FileDiff,
  FileHeart,
  FileInput,
  FileOutput,
  FileMinus,
  FilePlus,
  FilePlus2,
  FileScan,
  FileSymlink,
  FileUp,
  FileDown,
  FileArchive,
  FileCog,
  FileSliders
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * RAVENIUS TERMS OF SERVICE
 * ============================================================================
 * 
 * This document constitutes the legally binding Terms of Service agreement
 * between Ravenius ("Company", "We", "Us", "Our") and the User ("You", "Your",
 * "Customer", "Buyer", "Visitor").
 * 
 * GOVERNING LAW: Republic of India
 * APPLICABLE STATUTES:
 * - Indian Contract Act, 1872
 * - Consumer Protection Act, 2019
 * - Information Technology Act, 2000
 * - Information Technology (Reasonable Security Practices and Procedures
 *   and Sensitive Personal Data or Information) Rules, 2011
 * - Payment and Settlement Systems Act, 2007
 * - Indian Penal Code, 1860
 * - Code of Civil Procedure, 1908
 * - Arbitration and Conciliation Act, 1996
 * - Sale of Goods Act, 1930
 * - Legal Metrology Act, 2009
 * - Foreign Exchange Management Act, 1999
 * - Prevention of Money Laundering Act, 2002
 * 
 * JURISDICTION: Courts of competent jurisdiction in India
 * 
 * ============================================================================
 */

/**
 * Decorative Lottie animation for legal/shield theme
 */
const legalShieldLottie = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 90,
  w: 200,
  h: 200,
  nm: "LegalShield",
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Shield",
      sr: 1,
      ks: {
        o: { a: 0, k: 85 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [-2], e: [2] },
            { t: 45, s: [2], e: [-2] },
            { t: 90, s: [-2] }
          ]
        },
        p: { a: 0, k: [100, 100, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              p: { a: 0, k: [0, -8] },
              s: { a: 0, k: [80, 100] },
              r: { a: 0, k: 16 }
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.15, 0.35, 0.75, 1] },
              o: { a: 0, k: 100 }
            }
          ]
        }
      ]
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Checkmark",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 95, 0] },
        s: { a: 0, k: [80, 80, 100] }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              p: { a: 0, k: [0, 0] },
              s: { a: 0, k: [24, 24] },
              r: { a: 0, k: 4 }
            },
            {
              ty: "fl",
              c: { a: 0, k: [1, 1, 1, 1] },
              o: { a: 0, k: 90 }
            }
          ]
        }
      ]
    }
  ]
};

/**
 * Warning/Alert Lottie animation
 */
const warningLottie = {
  v: "5.7.4",
  fr: 24,
  ip: 0,
  op: 48,
  w: 100,
  h: 100,
  nm: "Warning",
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Triangle",
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { t: 0, s: [100], e: [60] },
            { t: 24, s: [60], e: [100] },
            { t: 48, s: [100] }
          ]
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [50, 50, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              p: { a: 0, k: [0, 0] },
              s: { a: 0, k: [60, 60] },
              r: { a: 0, k: 8 }
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.9, 0.2, 0.2, 1] },
              o: { a: 0, k: 100 }
            }
          ]
        }
      ]
    }
  ]
};

/**
 * ============================================================================
 * SECTION INTERFACES AND TYPES
 * ============================================================================
 */

interface SubSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface Section {
  id: string;
  number: string;
  title: string;
  icon: React.ReactNode;
  iconColor: string;
  severity: "info" | "warning" | "critical" | "legal";
  summary: string;
  content: React.ReactNode;
  subsections?: SubSection[];
  legalReferences?: string[];
  effectiveDate?: string;
  lastAmended?: string;
}

/**
 * ============================================================================
 * UTILITY COMPONENTS
 * ============================================================================
 */

const LegalHighlight: React.FC<{
  children: React.ReactNode;
  type?: "warning" | "critical" | "info" | "legal";
}> = ({ children, type = "info" }) => {
  const styles = {
    warning: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100",
    critical: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100",
    info: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100",
    legal: "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-100"
  };

  const icons = {
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />,
    critical: <OctagonAlert className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />,
    legal: <Gavel className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
  };

  return (
    <div className={cn("border rounded-lg p-4 flex gap-3 items-start", styles[type])}>
      {icons[type]}
      <div className="text-sm font-medium">{children}</div>
    </div>
  );
};

const StatuteReference: React.FC<{
  statute: string;
  section?: string;
  description?: string;
}> = ({ statute, section, description }) => (
  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-mono">
    <Landmark className="w-3 h-3 text-slate-500" />
    <span className="font-semibold text-slate-700 dark:text-slate-300">{statute}</span>
    {section && (
      <>
        <span className="text-slate-400">•</span>
        <span className="text-slate-600 dark:text-slate-400">{section}</span>
      </>
    )}
    {description && (
      <>
        <span className="text-slate-400">—</span>
        <span className="text-slate-500 dark:text-slate-500 italic">{description}</span>
      </>
    )}
  </div>
);

const DefinitionTerm: React.FC<{
  term: string;
  definition: string;
}> = ({ term, definition }) => (
  <div className="border-l-4 border-indigo-500 pl-4 py-2">
    <dt className="font-bold text-foreground">{term}</dt>
    <dd className="text-muted-foreground mt-1">{definition}</dd>
  </div>
);

const LegalList: React.FC<{
  items: string[];
  type?: "numbered" | "bullet" | "roman";
  className?: string;
}> = ({ items, type = "bullet", className }) => {
  const ListComponent = type === "bullet" ? "ul" : "ol";
  const listStyle = type === "numbered" ? "decimal" : type === "roman" ? "upper-roman" : "disc";

  return (
    <ListComponent
      className={cn("space-y-2 ml-6", className)}
      style={{ listStyleType: listStyle }}
    >
      {items.map((item, index) => (
        <li key={index} className="text-muted-foreground pl-2">
          {item}
        </li>
      ))}
    </ListComponent>
  );
};

const PenaltyBox: React.FC<{
  title: string;
  description: string;
  penalty: string;
  statute?: string;
}> = ({ title, description, penalty, statute }) => (
  <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-5 space-y-3">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
        <Siren className="w-5 h-5 text-red-600 dark:text-red-400" />
      </div>
      <h4 className="font-bold text-red-900 dark:text-red-100">{title}</h4>
    </div>
    <p className="text-sm text-red-800 dark:text-red-200">{description}</p>
    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-red-200 dark:border-red-800">
      <span className="text-xs font-semibold text-red-700 dark:text-red-300 uppercase tracking-wide">
        Penalty:
      </span>
      <span className="text-sm font-bold text-red-900 dark:text-red-100">{penalty}</span>
    </div>
    {statute && (
      <div className="pt-2">
        <StatuteReference statute={statute} />
      </div>
    )}
  </div>
);

const ImportantNotice: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-2 border-amber-300 dark:border-amber-700 rounded-2xl p-6">
    <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
      <Lottie animationData={warningLottie} loop className="opacity-20" />
    </div>
    <div className="relative z-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-amber-200 dark:bg-amber-800 rounded-lg">
          <BadgeAlert className="w-6 h-6 text-amber-700 dark:text-amber-300" />
        </div>
        <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div className="text-amber-800 dark:text-amber-200 space-y-3">
        {children}
      </div>
    </div>
  </div>
);

const CriticalWarning: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <div className="relative overflow-hidden bg-gradient-to-br from-red-600 to-red-800 dark:from-red-800 dark:to-red-950 text-white rounded-2xl p-6 shadow-lg shadow-red-500/20">
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48cGF0aCBkPSJNMjAgMjBtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-30" />
    <div className="relative z-10 flex items-start gap-4">
      <div className="p-3 bg-white/20 rounded-xl flex-shrink-0">
        <ShieldX className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-black uppercase tracking-wider flex items-center gap-2">
          <span>Critical Legal Notice</span>
          <span className="animate-pulse">⚠️</span>
        </h3>
        <div className="text-red-100 font-medium">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const LegalArticle: React.FC<{
  number: string;
  title: string;
  children: React.ReactNode;
}> = ({ number, title, children }) => (
  <div className="space-y-3">
    <div className="flex items-baseline gap-3">
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
        Article {number}
      </span>
      <h4 className="font-bold text-foreground">{title}</h4>
    </div>
    <div className="pl-4 border-l-2 border-border text-muted-foreground space-y-2">
      {children}
    </div>
  </div>
);

const TableOfContents: React.FC<{
  sections: Section[];
  activeSection: string | null;
  onSectionClick: (id: string) => void;
}> = ({ sections, activeSection, onSectionClick }) => (
  <nav className="sticky top-4 bg-card border rounded-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
    <div className="flex items-center gap-3 pb-4 border-b">
      <ListChecks className="w-5 h-5 text-brand" />
      <h3 className="font-bold text-lg">Table of Contents</h3>
    </div>
    <ul className="space-y-1">
      {sections.map((section) => (
        <li key={section.id}>
          <button
            onClick={() => onSectionClick(section.id)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200",
              "hover:bg-secondary/80 hover:translate-x-1",
              activeSection === section.id
                ? "bg-brand/10 text-brand font-semibold border-l-4 border-brand"
                : "text-muted-foreground"
            )}
          >
            <span className="font-mono text-xs mr-2">{section.number}</span>
            {section.title}
          </button>
        </li>
      ))}
    </ul>
  </nav>
);

/**
 * ============================================================================
 * TERMS OF SERVICE SECTIONS DATA
 * ============================================================================
 * 
 * Each section is carefully crafted to provide maximum legal protection
 * while complying with Indian law requirements.
 * 
 * ============================================================================
 */

const TERMS_SECTIONS: Section[] = [
  /**
   * ========================================================================
   * SECTION 1: INTRODUCTION AND ACCEPTANCE OF TERMS
   * ========================================================================
   */
  {
    id: "introduction",
    number: "1",
    title: "Introduction and Acceptance of Terms",
    icon: <Scale className="w-5 h-5" />,
    iconColor: "text-indigo-600 dark:text-indigo-400",
    severity: "legal",
    summary: "Legal framework establishing the binding nature of this agreement under Indian law.",
    legalReferences: [
      "Indian Contract Act, 1872 - Section 10",
      "Information Technology Act, 2000 - Section 10A",
      "Consumer Protection Act, 2019 - Section 2(7)"
    ],
    content: (
      <div className="space-y-6">
        <LegalHighlight type="legal">
          This document constitutes a legally binding electronic contract under the Information
          Technology Act, 2000, and is enforceable as per Indian law.
        </LegalHighlight>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <p>
            Welcome to Ravenius ("Company," "We," "Us," "Our"). These Terms of Service
            ("Terms," "Agreement," "Contract") constitute a legally binding agreement between
            you ("User," "Customer," "Buyer," "You," "Your") and Ravenius, governing your
            access to and use of our website, mobile applications, and all related services
            (collectively, the "Platform" or "Services").
          </p>

          <p>
            <strong>PLEASE READ THESE TERMS CAREFULLY BEFORE ACCESSING OR USING OUR SERVICES.</strong>
            By accessing this website, creating an account, browsing products, adding items to
            your cart, placing an order, making a payment, or using any feature of our Platform,
            you acknowledge that you have read, understood, and agree to be bound by these Terms
            in their entirety.
          </p>
        </div>

        <ImportantNotice title="Binding Agreement">
          <p className="font-bold">
            YOUR USE OF THIS PLATFORM CONSTITUTES YOUR ACCEPTANCE OF THESE TERMS.
          </p>
          <p>
            If you do not agree with any provision of these Terms, you must immediately
            cease all use of the Platform and refrain from placing any orders. Continued
            use after disagreement shall be deemed as acceptance under the doctrine of
            implied consent as recognized under Indian contract law.
          </p>
        </ImportantNotice>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">1.1 Formation of Contract</h4>
          <p className="text-muted-foreground">
            Under Section 10 of the Indian Contract Act, 1872, this agreement is formed when:
          </p>
          <LegalList
            type="numbered"
            items={[
              "You access the Platform (constituting an offer to engage)",
              "You browse products or services (constituting consideration of terms)",
              "You add items to cart or initiate checkout (constituting intent to contract)",
              "You complete a purchase (constituting acceptance and formation of contract)",
              "We confirm your order (constituting our acceptance creating binding obligations)"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">1.2 Electronic Contract Validity</h4>
          <p className="text-muted-foreground">
            Pursuant to Section 10A of the Information Technology Act, 2000, contracts formed
            through electronic means shall not be denied legal effect, validity, or enforceability
            solely on the ground that they are in electronic form. This Agreement, executed
            electronically, shall have the same legal standing as a physical written contract
            signed by both parties.
          </p>
          <StatuteReference
            statute="IT Act, 2000"
            section="Section 10A"
            description="Validity of contracts formed through electronic means"
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">1.3 Capacity to Contract</h4>
          <p className="text-muted-foreground">
            By using this Platform, you represent and warrant that:
          </p>
          <LegalList
            items={[
              "You are at least 18 years of age or have attained the age of majority in your jurisdiction",
              "You are of sound mind and capable of entering into a binding contract as per Section 11 of the Indian Contract Act, 1872",
              "You are not disqualified from contracting by any law to which you are subject",
              "If acting on behalf of an organization, you have the authority to bind that organization to these Terms",
              "All information you provide is accurate, current, and complete"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">1.4 Minors</h4>
          <p className="text-muted-foreground">
            Persons under 18 years of age may use this Platform only with the involvement,
            supervision, and consent of a parent or legal guardian. The parent or guardian
            agrees to be bound by these Terms on behalf of the minor and shall be liable
            for all activities conducted through the minor's use of the Platform.
          </p>
          <LegalHighlight type="warning">
            Parents and guardians are jointly and severally liable for any transactions,
            damages, or violations arising from a minor's use of the Platform.
          </LegalHighlight>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">1.5 Modifications to Terms</h4>
          <p className="text-muted-foreground">
            We reserve the right to modify, amend, or update these Terms at any time at our
            sole discretion. Changes will be effective immediately upon posting on the Platform.
            Your continued use of the Platform following the posting of revised Terms means
            you accept and agree to the changes. We encourage you to review these Terms
            periodically.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CalendarClock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Last Updated
                </span>
              </div>
              <span className="font-bold">{new Date().toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Review Frequency
                </span>
              </div>
              <span className="font-bold">Quarterly</span>
            </div>
          </div>
        </div>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 2: DEFINITIONS AND INTERPRETATION
   * ========================================================================
   */
  {
    id: "definitions",
    number: "2",
    title: "Definitions and Interpretation",
    icon: <BookOpen className="w-5 h-5" />,
    iconColor: "text-blue-600 dark:text-blue-400",
    severity: "info",
    summary: "Comprehensive definitions of terms used throughout this agreement.",
    content: (
      <div className="space-y-6">
        <p className="text-muted-foreground">
          In these Terms of Service, unless the context otherwise requires, the following
          words and expressions shall have the meanings assigned to them:
        </p>

        <div className="space-y-4">
          <h4 className="font-bold text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand" />
            2.1 Primary Definitions
          </h4>
          
          <dl className="space-y-4">
            <DefinitionTerm
              term="Account"
              definition="The personal account created by a User on the Platform containing their profile information, order history, saved addresses, payment methods, and preferences."
            />
            <DefinitionTerm
              term="Agreement or Terms"
              definition="This Terms of Service document, including all schedules, annexures, policies incorporated by reference, and any amendments thereto."
            />
            <DefinitionTerm
              term="Business Day"
              definition="Any day other than Saturday, Sunday, or a public holiday declared by the Central Government or State Government of the applicable jurisdiction in India."
            />
            <DefinitionTerm
              term="Cart"
              definition="The virtual shopping cart feature that allows Users to select and hold Products for potential purchase before checkout."
            />
            <DefinitionTerm
              term="Cash on Delivery (COD)"
              definition="A payment method where the Customer pays the order amount in cash to the delivery personnel at the time of receiving the Product."
            />
            <DefinitionTerm
              term="Company, We, Us, Our"
              definition="Ravenius, the entity operating this Platform, including its directors, officers, employees, agents, affiliates, and successors."
            />
            <DefinitionTerm
              term="Confidential Information"
              definition="Any non-public information, whether written, oral, or electronic, including but not limited to business plans, customer data, pricing, technical data, and trade secrets."
            />
            <DefinitionTerm
              term="Consumer"
              definition="As defined under Section 2(7) of the Consumer Protection Act, 2019, any person who buys goods or avails services for consideration."
            />
            <DefinitionTerm
              term="Content"
              definition="All text, graphics, images, photographs, videos, audio, data, software, and other materials available on or through the Platform."
            />
            <DefinitionTerm
              term="Courier or Delivery Partner"
              definition="Third-party logistics companies engaged by the Company to deliver Products to Customers."
            />
            <DefinitionTerm
              term="Customer, Buyer, User, You, Your"
              definition="Any individual or entity accessing the Platform, whether or not they make a purchase, including registered users and guest visitors."
            />
            <DefinitionTerm
              term="Delivery"
              definition="The physical transfer of possession of Products from the Courier to the Customer at the designated delivery address."
            />
            <DefinitionTerm
              term="Delivery Address"
              definition="The physical address provided by the Customer where the Products are to be delivered."
            />
            <DefinitionTerm
              term="Fraud"
              definition="Any intentional deception, misrepresentation, or concealment of material facts with the intent to deprive the Company of its property, services, or lawful rights, including but not limited to identity theft, payment fraud, return fraud, and abuse of promotional offers."
            />
            <DefinitionTerm
              term="Indian Rupees or INR"
              definition="The official currency of the Republic of India as legal tender."
            />
            <DefinitionTerm
              term="Intellectual Property"
              definition="All patents, trademarks, service marks, trade names, copyrights, trade secrets, domain names, know-how, and all other intellectual property rights, whether registered or unregistered."
            />
            <DefinitionTerm
              term="Order"
              definition="A request by the Customer to purchase one or more Products, subject to acceptance by the Company."
            />
            <DefinitionTerm
              term="Order Confirmation"
              definition="The electronic communication sent by the Company confirming receipt and acceptance of an Order."
            />
            <DefinitionTerm
              term="Order ID"
              definition="The unique alphanumeric identifier assigned to each Order for tracking and reference purposes."
            />
            <DefinitionTerm
              term="Payment Gateway"
              definition="Third-party payment processing services integrated with the Platform to facilitate electronic payments."
            />
            <DefinitionTerm
              term="Personal Data"
              definition="As defined under the Information Technology Rules, 2011, information that relates to a natural person and is capable of identifying such person."
            />
            <DefinitionTerm
              term="Platform"
              definition="The Ravenius website, mobile applications, and all related digital properties, services, and functionalities."
            />
            <DefinitionTerm
              term="Price"
              definition="The amount payable for a Product as displayed on the Platform, exclusive or inclusive of taxes as specified."
            />
            <DefinitionTerm
              term="Product"
              definition="Any goods, merchandise, or items offered for sale on the Platform."
            />
            <DefinitionTerm
              term="Prohibited Conduct"
              definition="Any activity that violates these Terms, applicable laws, or that the Company deems harmful to its business, other Users, or third parties."
            />
            <DefinitionTerm
              term="Refund"
              definition="The return of payment made by a Customer, which is NOT offered by Ravenius except in specific circumstances as outlined in these Terms."
            />
            <DefinitionTerm
              term="Sensitive Personal Data (SPDI)"
              definition="As defined under IT Rules, 2011, includes passwords, financial information, health information, biometric data, and similar sensitive categories."
            />
            <DefinitionTerm
              term="Services"
              definition="All services provided by the Company through the Platform, including but not limited to product sales, customer support, and delivery coordination."
            />
            <DefinitionTerm
              term="Shipping"
              definition="The process of dispatching and transporting Products from the Company facilities to the Customer Delivery Address."
            />
            <DefinitionTerm
              term="Third-Party Services"
              definition="Services provided by parties other than the Company, including payment gateways, courier services, and external websites linked from the Platform."
            />
            <DefinitionTerm
              term="Transaction"
              definition="Any commercial exchange between the Customer and Company, including purchases, payments, and related activities."
            />
            <DefinitionTerm
              term="User Content"
              definition="Any content submitted, uploaded, or posted by Users, including reviews, ratings, comments, images, and feedback."
            />
          </dl>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-brand" />
            2.2 Rules of Interpretation
          </h4>
          <LegalList
            type="numbered"
            items={[
              "Words importing the singular shall include the plural and vice versa.",
              "Words importing any gender shall include all genders.",
              "References to 'person' shall include individuals, corporations, partnerships, trusts, and other legal entities.",
              "Headings are for convenience only and shall not affect interpretation.",
              "The words 'include,' 'includes,' and 'including' shall be deemed to be followed by 'without limitation.'",
              "References to statutes or statutory provisions include any amendments, re-enactments, or replacements.",
              "References to 'writing' include any mode of reproducing words in legible form, including electronic communication.",
              "References to 'days' mean calendar days unless otherwise specified as 'Business Days.'",
              "In case of conflict between provisions, the more specific provision shall prevail.",
              "Any provision that is held to be illegal or unenforceable shall be severed without affecting other provisions."
            ]}
          />
        </div>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 3: ELIGIBILITY AND USER REPRESENTATIONS
   * ========================================================================
   */
  {
    id: "eligibility",
    number: "3",
    title: "Eligibility and User Representations",
    icon: <UserCheck className="w-5 h-5" />,
    iconColor: "text-green-600 dark:text-green-400",
    severity: "info",
    summary: "Requirements for using this Platform and representations made by users.",
    legalReferences: [
      "Indian Contract Act, 1872 - Sections 11, 12",
      "Indian Majority Act, 1875 - Section 3"
    ],
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-bold text-lg">3.1 Eligibility Requirements</h4>
          <p className="text-muted-foreground">
            To use this Platform and enter into transactions, you must satisfy the following
            eligibility criteria as mandated by Indian law:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h5 className="font-bold text-green-900 dark:text-green-100">Age Requirement</h5>
              </div>
              <p className="text-sm text-green-800 dark:text-green-200">
                You must be at least 18 years of age, or have attained the age of majority
                as determined by the law applicable to you (Indian Majority Act, 1875).
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h5 className="font-bold text-green-900 dark:text-green-100">Mental Capacity</h5>
              </div>
              <p className="text-sm text-green-800 dark:text-green-200">
                You must be of sound mind and capable of understanding the nature and
                consequences of your actions (Section 12, Indian Contract Act, 1872).
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h5 className="font-bold text-green-900 dark:text-green-100">Legal Standing</h5>
              </div>
              <p className="text-sm text-green-800 dark:text-green-200">
                You must not be disqualified from contracting by any law to which you
                are subject, including insolvency or legal incapacity.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h5 className="font-bold text-green-900 dark:text-green-100">Valid Intent</h5>
              </div>
              <p className="text-sm text-green-800 dark:text-green-200">
                Your consent to transact must be free from coercion, undue influence,
                fraud, misrepresentation, or mistake.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">3.2 User Representations and Warranties</h4>
          <p className="text-muted-foreground">
            By using the Platform, you represent, warrant, and covenant that:
          </p>
          <LegalList
            type="numbered"
            items={[
              "All registration information you submit is truthful, accurate, current, and complete.",
              "You will maintain the accuracy of such information and promptly update it as necessary.",
              "You have the legal capacity and authority to agree to these Terms.",
              "You are not a minor in the jurisdiction in which you reside, or if a minor, you have received parental permission to use this Platform.",
              "You will not access the Platform through automated or non-human means, whether through a bot, script, or otherwise.",
              "You will not use the Platform for any illegal, unauthorized, or fraudulent purpose.",
              "Your use of the Platform will not violate any applicable law or regulation.",
              "You have not been previously suspended or removed from the Platform.",
              "You are not located in a country that is subject to a government embargo or that has been designated as a 'terrorist-supporting' country.",
              "You are not listed on any government list of prohibited or restricted parties.",
              "The payment method you provide is valid and you have authorization to use it.",
              "The delivery address you provide is accurate and you are authorized to receive deliveries at that location."
            ]}
          />
        </div>

        <LegalHighlight type="warning">
          <strong>FALSE REPRESENTATIONS:</strong> Any false representation shall constitute a material
          breach of these Terms and may result in immediate termination of your access, cancellation
          of orders, and legal action for damages including but not limited to costs incurred due to
          your misrepresentation.
        </LegalHighlight>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">3.3 Prohibited Users</h4>
          <p className="text-muted-foreground">
            The following categories of persons are expressly prohibited from using the Platform:
          </p>
          <LegalList
            items={[
              "Persons who have been previously banned, suspended, or restricted from using the Platform",
              "Persons involved in fraudulent activities or chargebacks against the Company",
              "Persons using false identities or impersonating others",
              "Competitors engaging in unauthorized data collection or competitive intelligence",
              "Persons accessing from jurisdictions where the Platform's services are prohibited",
              "Resellers or commercial buyers unless expressly authorized in writing",
              "Persons subject to economic sanctions or trade restrictions",
              "Persons with outstanding debts or disputes with the Company"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">3.4 Account Security</h4>
          <p className="text-muted-foreground">
            You are responsible for maintaining the confidentiality of your account credentials
            and for all activities that occur under your account:
          </p>
          <LegalList
            items={[
              "You must not share your login credentials with any third party.",
              "You must use strong, unique passwords and enable additional security features when available.",
              "You must immediately notify us of any unauthorized use of your account.",
              "You must log out from shared or public devices after each session.",
              "You are liable for all activities conducted through your account, whether authorized or not.",
              "We reserve the right to disable any account that we believe has been compromised."
            ]}
          />
        </div>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 4: PRODUCTS AND SERVICES
   * ========================================================================
   */
  {
    id: "products",
    number: "4",
    title: "Products, Descriptions, and Availability",
    icon: <Package className="w-5 h-5" />,
    iconColor: "text-purple-600 dark:text-purple-400",
    severity: "info",
    summary: "Information about products, accuracy of descriptions, and availability.",
    legalReferences: [
      "Consumer Protection Act, 2019 - Section 2(11)",
      "Legal Metrology Act, 2009",
      "Sale of Goods Act, 1930 - Sections 14-17"
    ],
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-bold text-lg">4.1 Product Descriptions</h4>
          <p className="text-muted-foreground">
            We endeavor to be as accurate as possible in our product descriptions. However,
            we do not warrant that product descriptions, pricing, or other content on the
            Platform is accurate, complete, reliable, current, or error-free.
          </p>
          <LegalList
            items={[
              "Colors displayed on screen may vary from actual product colors due to monitor settings, lighting conditions, and manufacturing variations.",
              "Product dimensions and measurements are approximate and may vary slightly.",
              "Product images may include styling elements, accessories, or props not included with the product.",
              "Material compositions and care instructions are provided for guidance only.",
              "Product availability is subject to change without notice.",
              "Product specifications may be updated by manufacturers without prior notice."
            ]}
          />
        </div>

        <LegalHighlight type="info">
          <strong>BUYER'S RESPONSIBILITY:</strong> It is your sole responsibility to carefully
          review all product details, descriptions, sizes, colors, materials, and specifications
          before placing an order. We strongly recommend reviewing size charts and measurement
          guides where provided.
        </LegalHighlight>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">4.2 Pricing</h4>
          <p className="text-muted-foreground">
            All prices displayed on the Platform are in Indian Rupees (INR) unless otherwise stated.
          </p>
          <LegalList
            items={[
              "Prices are subject to change at any time without prior notice.",
              "Promotional prices are valid only for the specified duration.",
              "Prices may or may not include applicable taxes; this will be clearly indicated.",
              "Delivery fees and other charges, if applicable, will be displayed before checkout.",
              "We reserve the right to correct pricing errors and cancel orders placed at erroneous prices.",
              "Price matching or adjustment for previous purchases is not offered.",
              "Prices displayed at the time of order placement shall apply to that order."
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">4.3 Availability and Stock</h4>
          <p className="text-muted-foreground">
            Product availability is displayed in real-time but cannot be guaranteed:
          </p>
          <LegalList
            items={[
              "Products may become unavailable after you add them to cart but before checkout.",
              "We reserve the right to limit quantities sold to any customer.",
              "We may refuse or cancel orders for products that are out of stock.",
              "Pre-orders and backorders are subject to estimated availability dates which may change.",
              "Displaying a product on the Platform does not guarantee its availability.",
              "We may discontinue products at any time without prior notice."
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">4.4 Product Quality Standards</h4>
          <p className="text-muted-foreground">
            All products sold on the Platform are intended to meet the following standards:
          </p>
          <LegalList
            items={[
              "Products are of merchantable quality as per Section 14(b) of the Sale of Goods Act, 1930.",
              "Products are fit for the purposes for which they are commonly used.",
              "Products correspond to the descriptions provided on the Platform.",
              "Products are free from defects not disclosed at the time of sale.",
              "Products comply with applicable safety and quality standards under Indian law."
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">4.5 Third-Party Products</h4>
          <p className="text-muted-foreground">
            If the Platform features products from third-party sellers or brands:
          </p>
          <LegalList
            items={[
              "Ravenius acts as the seller unless otherwise indicated.",
              "Product warranties, if any, are provided by the respective manufacturers.",
              "Claims regarding product quality should be directed to the appropriate party.",
              "We are not responsible for third-party product claims or representations.",
              "Manufacturer contact information will be provided where applicable."
            ]}
          />
        </div>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 5: ORDERS AND TRANSACTIONS
   * ========================================================================
   */
  {
    id: "orders",
    number: "5",
    title: "Orders, Purchases, and Transactions",
    icon: <ShoppingCart className="w-5 h-5" />,
    iconColor: "text-teal-600 dark:text-teal-400",
    severity: "info",
    summary: "Complete process for placing orders and completing transactions.",
    legalReferences: [
      "Indian Contract Act, 1872 - Sections 2-10",
      "Information Technology Act, 2000 - Section 10A",
      "Consumer Protection (E-Commerce) Rules, 2020"
    ],
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-bold text-lg">5.1 Order Process</h4>
          <p className="text-muted-foreground">
            The order process involves the following stages:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
              <div className="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
              <div>
                <h5 className="font-bold">Product Selection</h5>
                <p className="text-sm text-muted-foreground">Browse products, select size/variants, and add to cart. This does not create a binding commitment.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
              <div className="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
              <div>
                <h5 className="font-bold">Checkout Initiation</h5>
                <p className="text-sm text-muted-foreground">Review cart contents, enter delivery address, and select payment method. This constitutes an offer to purchase.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
              <div className="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
              <div>
                <h5 className="font-bold">Payment Processing</h5>
                <p className="text-sm text-muted-foreground">Complete payment through selected method. For COD, this is deferred until delivery.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
              <div className="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
              <div>
                <h5 className="font-bold">Order Confirmation</h5>
                <p className="text-sm text-muted-foreground">Receipt of Order Confirmation constitutes our acceptance and forms a binding contract.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
              <div className="w-8 h-8 bg-brand text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">5</div>
              <div>
                <h5 className="font-bold">Order Fulfillment</h5>
                <p className="text-sm text-muted-foreground">Order is processed, packed, and dispatched. Tracking information is provided.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">5.2 Order Acceptance</h4>
          <p className="text-muted-foreground">
            Your order constitutes an offer to purchase products. We reserve the right to accept
            or reject any order at our sole discretion. An order is only accepted when we send
            the Order Confirmation.
          </p>
          <LegalHighlight type="info">
            Receipt of an automated order acknowledgment does not constitute acceptance. Only
            the Order Confirmation email with the Order ID and order details constitutes our
            acceptance of your offer.
          </LegalHighlight>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">5.3 Order Cancellation by Company</h4>
          <p className="text-muted-foreground">
            We reserve the right to cancel any order before dispatch for the following reasons:
          </p>
          <LegalList
            items={[
              "Product unavailability or stock issues",
              "Pricing errors or typographical mistakes",
              "Suspected fraudulent or unauthorized transactions",
              "Failure to verify payment or delivery information",
              "Violation of purchase limits or terms",
              "Unusual or suspicious ordering patterns",
              "Inability to deliver to the specified address",
              "Legal or regulatory compliance requirements",
              "Force majeure events affecting fulfillment",
              "Discovery of false information provided by the customer"
            ]}
          />
          <p className="text-muted-foreground">
            In case of cancellation, any prepaid amount will be refunded within 7-10 business days.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">5.4 Order Verification</h4>
          <p className="text-muted-foreground">
            To protect against fraud, we may implement verification measures:
          </p>
          <LegalList
            items={[
              "Phone verification to confirm order details",
              "OTP verification for Cash on Delivery orders",
              "Address verification through third-party services",
              "Payment verification with issuing banks",
              "Identity verification for high-value orders",
              "IP address and device fingerprint analysis",
              "Cross-referencing with fraud databases",
              "Review of order history and account activity"
            ]}
          />
          <LegalHighlight type="warning">
            Failure to respond to verification requests within 24 hours may result in order
            cancellation. Providing false information during verification will result in
            permanent account suspension and legal action.
          </LegalHighlight>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">5.5 Order Modifications</h4>
          <p className="text-muted-foreground">
            Once an order is placed:
          </p>
          <LegalList
            items={[
              "Modifications to order items, quantities, or sizes cannot be guaranteed.",
              "Address changes may be possible before dispatch if requested immediately.",
              "Color or variant changes require order cancellation and re-ordering.",
              "Modification requests are subject to operational feasibility.",
              "We are not obligated to accommodate modification requests.",
              "Any approved modifications may affect delivery timelines."
            ]}
          />
        </div>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 6: PRICING, PAYMENTS, AND TAXES
   * ========================================================================
   */
  {
    id: "payments",
    number: "6",
    title: "Pricing, Payments, and Taxation",
    icon: <CreditCard className="w-5 h-5" />,
    iconColor: "text-emerald-600 dark:text-emerald-400",
    severity: "info",
    summary: "Payment methods, processing, and applicable taxes.",
    legalReferences: [
      "Payment and Settlement Systems Act, 2007",
      "Goods and Services Tax Act, 2017",
      "RBI Guidelines on Digital Payments",
      "Prevention of Money Laundering Act, 2002"
    ],
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-bold text-lg">6.1 Accepted Payment Methods</h4>
          <p className="text-muted-foreground">
            We accept the following payment methods, subject to availability and verification:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <CreditCard className="w-5 h-5 text-brand" />
                <h5 className="font-bold">Credit/Debit Cards</h5>
              </div>
              <p className="text-sm text-muted-foreground">
                Visa, Mastercard, Rupay, American Express, and other major cards issued by RBI-regulated banks.
              </p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <Wallet className="w-5 h-5 text-brand" />
                <h5 className="font-bold">UPI</h5>
              </div>
              <p className="text-sm text-muted-foreground">
                All UPI-enabled apps including Google Pay, PhonePe, Paytm, and bank UPI apps.
              </p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <Building2 className="w-5 h-5 text-brand" />
                <h5 className="font-bold">Net Banking</h5>
              </div>
              <p className="text-sm text-muted-foreground">
                Direct bank transfers through supported Indian banks' internet banking services.
              </p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <HandCoins className="w-5 h-5 text-brand" />
                <h5 className="font-bold">Cash on Delivery</h5>
              </div>
              <p className="text-sm text-muted-foreground">
                Available for eligible orders, locations, and order values (subject to restrictions).
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">6.2 Payment Processing</h4>
          <p className="text-muted-foreground">
            All electronic payments are processed through PCI-DSS compliant payment gateways:
          </p>
          <LegalList
            items={[
              "Payment information is encrypted using industry-standard SSL/TLS protocols.",
              "We do not store complete credit/debit card numbers on our servers.",
              "Payment processing is subject to additional verification by issuing banks.",
              "Failed transactions may require retry or alternative payment methods.",
              "Payment confirmation may take up to 24 hours in some cases.",
              "International cards may be subject to additional verification or restrictions."
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">6.3 Cash on Delivery (COD) Terms</h4>
          <LegalHighlight type="warning">
            <strong>COD POLICY:</strong> Cash on Delivery is a privilege, not a right. Abuse of COD
            services will result in permanent disqualification and may lead to legal action.
          </LegalHighlight>
          <LegalList
            items={[
              "COD is available only for orders within India to serviceable pin codes.",
              "COD may be restricted based on order value (minimum and maximum limits apply).",
              "OTP verification is mandatory for COD orders to confirm customer intent.",
              "Multiple failed delivery attempts will result in return to origin and potential charges.",
              "Refusing COD delivery without valid reason constitutes order abuse.",
              "COD abusers will be blacklisted and may face legal action for damages.",
              "COD availability may be revoked for customers with poor delivery acceptance history.",
              "Exact change is appreciated; delivery personnel may not carry change for large denominations."
            ]}
          />
        </div>

        <PenaltyBox
          title="COD Abuse Warning"
          description="Repeatedly placing COD orders and refusing delivery, providing false addresses, or using COD to harass the Company constitutes fraud and civil wrong."
          penalty="Blacklisting, recovery of shipping costs, and legal action for damages up to ₹50,000 per incident."
          statute="Indian Contract Act, 1872 - Section 73"
        />

        <div className="space-y-4">
          <h4 className="font-bold text-lg">6.4 Taxes and Duties</h4>
          <p className="text-muted-foreground">
            All applicable taxes are included in the displayed prices or calculated at checkout:
          </p>
          <LegalList
            items={[
              "Goods and Services Tax (GST) is applicable as per the GST Act, 2017.",
              "Tax rates vary based on product category and applicable HSN/SAC codes.",
              "GST invoice will be provided with all orders.",
              "GSTIN can be provided for B2B orders to claim input tax credit.",
              "Customs duties and import taxes apply to international shipments (if offered).",
              "We are not responsible for additional taxes or duties levied by authorities."
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">6.5 Pricing Errors</h4>
          <p className="text-muted-foreground">
            In the event of a pricing error:
          </p>
          <LegalList
            items={[
              "We reserve the right to cancel orders placed at incorrect prices.",
              "We will notify you of the error and offer the option to reorder at the correct price.",
              "Obvious pricing errors (e.g., ₹10 instead of ₹1,000) do not constitute valid offers.",
              "Attempting to exploit pricing errors may result in account suspension.",
              "Refunds for cancelled orders due to pricing errors will be processed within 7-10 business days."
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">6.6 Chargebacks and Disputes</h4>
          <LegalHighlight type="critical">
            <strong>WARNING:</strong> Initiating fraudulent chargebacks or payment disputes
            is a criminal offense under Indian law and will be prosecuted to the fullest extent.
          </LegalHighlight>
          <LegalList
            items={[
              "Contact our customer service before initiating any payment dispute.",
              "Provide all relevant information for dispute resolution.",
              "Fraudulent chargebacks will be contested with evidence and documentation.",
              "Chargeback abuse will result in permanent account termination.",
              "Legal action will be initiated for fraudulent payment disputes.",
              "We reserve the right to report fraudulent activity to law enforcement and credit bureaus."
            ]}
          />
        </div>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 7: NO RETURNS, NO EXCHANGES, NO REFUNDS POLICY
   * ========================================================================
   */
  {
    id: "no-returns",
    number: "7",
    title: "No Returns, No Exchanges, No Refunds Policy",
    icon: <XCircle className="w-5 h-5" />,
    iconColor: "text-red-600 dark:text-red-400",
    severity: "critical",
    summary: "CRITICAL: Our strict policy on returns, exchanges, and refunds.",
    legalReferences: [
      "Consumer Protection Act, 2019 - Section 2(9)",
      "Indian Contract Act, 1872 - Section 23",
      "Sale of Goods Act, 1930"
    ],
    content: (
      <div className="space-y-6">
        <CriticalWarning>
          <p className="text-lg mb-2">
            ALL SALES ARE FINAL. RAVENIUS DOES NOT ACCEPT RETURNS, EXCHANGES, OR REFUNDS
            UNDER ANY CIRCUMSTANCES EXCEPT AS EXPLICITLY STATED HEREIN.
          </p>
          <p className="text-sm opacity-90">
            By placing an order, you acknowledge and accept this policy in its entirety.
            This policy is clearly disclosed before purchase and constitutes a material term
            of the contract.
          </p>
        </CriticalWarning>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">7.1 Policy Statement</h4>
          <p className="text-muted-foreground">
            Ravenius maintains a strict NO RETURNS, NO EXCHANGES, NO REFUNDS policy for the
            following business and operational reasons:
          </p>
          <LegalList
            items={[
              "Hygiene and safety concerns with clothing and personal items",
              "Prevention of abuse and fraudulent return schemes",
              "Operational efficiency and cost management",
              "Protection of inventory quality for all customers",
              "Compliance with fashion industry standards",
              "Mitigation of 'wardrobing' and wear-and-return fraud"
            ]}
          />
        </div>

        <div className="bg-red-50 dark:bg-red-950/30 border-2 border-red-300 dark:border-red-800 rounded-2xl p-6 space-y-4">
          <h4 className="font-bold text-lg text-red-900 dark:text-red-100 flex items-center gap-3">
            <Ban className="w-6 h-6" />
            7.2 What This Policy Means
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-red-900/30 rounded-xl p-4 text-center">
              <XCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
              <h5 className="font-bold text-red-900 dark:text-red-100">No Returns</h5>
              <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                Products cannot be sent back after delivery for any reason.
              </p>
            </div>
            <div className="bg-white dark:bg-red-900/30 rounded-xl p-4 text-center">
              <RefreshCw className="w-10 h-10 text-red-500 mx-auto mb-2" />
              <h5 className="font-bold text-red-900 dark:text-red-100">No Exchanges</h5>
              <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                Products cannot be exchanged for different sizes, colors, or items.
              </p>
            </div>
            <div className="bg-white dark:bg-red-900/30 rounded-xl p-4 text-center">
              <Banknote className="w-10 h-10 text-red-500 mx-auto mb-2" />
              <h5 className="font-bold text-red-900 dark:text-red-100">No Refunds</h5>
              <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                Payments will not be refunded after order processing.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">7.3 Scenarios NOT Eligible for Return/Refund</h4>
          <p className="text-muted-foreground">
            The following situations explicitly DO NOT qualify for returns, exchanges, or refunds:
          </p>
          <LegalList
            items={[
              "Change of mind after purchase",
              "Product does not match expectations based on images",
              "Incorrect size ordered by customer",
              "Color variation from screen display",
              "Buyer's remorse or financial constraints",
              "Product not required anymore",
              "Ordered by mistake or duplicate orders",
              "Preference for different style or design",
              "Minor variations in product appearance",
              "Gifted item not liked by recipient",
              "Found cheaper elsewhere after purchase",
              "Delayed delivery (within reasonable timeframe)",
              "Shipping damage due to customer-provided incorrect address",
              "Product was used, worn, washed, or altered"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">7.4 Limited Exceptions</h4>
          <p className="text-muted-foreground">
            In extremely rare cases, Ravenius may, at its sole discretion, consider resolution
            for the following situations ONLY if reported within 24 hours of delivery with
            photographic evidence:
          </p>
          <LegalList
            items={[
              "Receipt of a completely different product than ordered",
              "Product received with severe manufacturing defects (not minor imperfections)",
              "Product received in damaged condition due to transit (packaging damage visible)",
              "Wrong size shipped despite correct size being ordered (with proof)"
            ]}
          />
          <LegalHighlight type="warning">
            <strong>STRICT REQUIREMENTS FOR CLAIMS:</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Report must be made within 24 hours of delivery</li>
              <li>Clear photographs of product, tags, packaging, and defect must be provided</li>
              <li>Product must be unused, unwashed, and with all tags attached</li>
              <li>Original packaging must be intact</li>
              <li>Order confirmation and delivery proof must be available</li>
              <li>Claim is subject to verification and inspection</li>
              <li>Resolution is entirely at Company's discretion</li>
            </ul>
          </LegalHighlight>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">7.5 Resolution Options (If Exception Applies)</h4>
          <p className="text-muted-foreground">
            If an exception is granted after verification, the following options may be offered:
          </p>
          <LegalList
            type="numbered"
            items={[
              "Store credit for future purchase (preferred option)",
              "Replacement of the same product (subject to availability)",
              "Partial credit adjustment",
              "Refund to original payment method (rare, processing time 14-21 days)"
            ]}
          />
          <p className="text-sm text-muted-foreground italic">
            Note: The Company reserves the right to choose the resolution method at its sole discretion.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">7.6 Consumer Rights Clarification</h4>
          <p className="text-muted-foreground">
            This policy is disclosed clearly before purchase and agreed upon by the customer.
            Under the Consumer Protection Act, 2019, consumers have the right to be informed
            of terms before purchase. By completing a purchase after reviewing these terms,
            you consent to this policy.
          </p>
          <StatuteReference
            statute="Consumer Protection Act, 2019"
            section="Section 2(9)"
            description="Definition of Defect"
          />
        </div>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 8: SHIPPING AND DELIVERY
   * ========================================================================
   */
  {
    id: "shipping",
    number: "8",
    title: "Shipping, Delivery, and Risk Transfer",
    icon: <Truck className="w-5 h-5" />,
    iconColor: "text-blue-600 dark:text-blue-400",
    severity: "info",
    summary: "Shipping processes, delivery timelines, and transfer of risk.",
    legalReferences: [
      "Sale of Goods Act, 1930 - Sections 26-36",
      "Carriage by Road Act, 2007",
      "Consumer Protection (E-Commerce) Rules, 2020"
    ],
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-bold text-lg">8.1 Shipping Coverage</h4>
          <p className="text-muted-foreground">
            Ravenius currently ships to locations within India only. Delivery availability
            depends on serviceability of the pin code by our courier partners.
          </p>
          <LegalList
            items={[
              "Shipping is available to most pin codes across India",
              "Certain remote or restricted areas may not be serviceable",
              "Delivery to P.O. Box addresses is not supported",
              "Military/defense installations may have special requirements",
              "International shipping is currently not offered"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">8.2 Delivery Timelines</h4>
          <p className="text-muted-foreground">
            Delivery timelines are estimates and not guarantees:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPinned className="w-5 h-5 text-brand" />
                <h5 className="font-bold">Metro Cities</h5>
              </div>
              <p className="text-2xl font-bold text-brand">3-5 Business Days</p>
              <p className="text-sm text-muted-foreground mt-1">Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-brand" />
                <h5 className="font-bold">Other Locations</h5>
              </div>
              <p className="text-2xl font-bold text-brand">5-10 Business Days</p>
              <p className="text-sm text-muted-foreground mt-1">Tier 2, Tier 3 cities and rural areas</p>
            </div>
          </div>

          <LegalHighlight type="info">
            Delivery timelines are calculated from dispatch date, not order date. Processing
            typically takes 1-3 business days before dispatch.
          </LegalHighlight>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">8.3 Factors Affecting Delivery</h4>
          <p className="text-muted-foreground">
            Delivery timelines may be affected by:
          </p>
          <LegalList
            items={[
              "Public holidays and festival seasons",
              "Weather conditions and natural disasters",
              "Civil unrest or security situations",
              "Courier operational issues",
              "Incorrect or incomplete address provided",
              "Recipient unavailability",
              "Remote location accessibility",
              "COVID-19 or pandemic-related restrictions",
              "Government-imposed lockdowns or curfews",
              "High order volumes during sales events"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">8.4 Risk Transfer</h4>
          <LegalHighlight type="legal">
            <strong>IMPORTANT:</strong> Risk of loss or damage to products transfers to you
            upon delivery to the first point of contact, which may be you, a family member,
            neighbor, building security, or any person at the delivery address.
          </LegalHighlight>
          <p className="text-muted-foreground">
            As per Sections 26-36 of the Sale of Goods Act, 1930:
          </p>
          <LegalList
            items={[
              "Once goods are delivered to the carrier, property passes to the buyer",
              "Risk of loss during transit is with the buyer unless otherwise specified",
              "Insurance, if purchased, provides coverage subject to carrier terms",
              "Claims for transit damage must be made to the carrier",
              "Company is not liable for delays or damages caused by carrier"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">8.5 Delivery Attempts</h4>
          <p className="text-muted-foreground">
            Our courier partners will make reasonable attempts to deliver:
          </p>
          <LegalList
            items={[
              "Typically 2-3 delivery attempts are made",
              "You will be notified of delivery attempts via SMS/call",
              "After failed attempts, package may be held at local hub",
              "Packages will be returned to origin after the holding period",
              "Return shipping costs may be deducted from any refund",
              "COD orders returned due to non-acceptance may incur charges",
              "Re-delivery charges may apply for repeated failed attempts"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">8.6 Delivery Verification</h4>
          <p className="text-muted-foreground">
            To ensure secure delivery:
          </p>
          <LegalList
            items={[
              "OTP verification may be required for certain orders",
              "Photo proof of delivery may be captured",
              "Signature or acknowledgment may be required",
              "ID verification may be requested for high-value orders",
              "Delivery cannot be made to unverified recipients"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">8.7 Customer Responsibilities</h4>
          <p className="text-muted-foreground">
            You are responsible for:
          </p>
          <LegalList
            items={[
              "Providing accurate and complete delivery address",
              "Including landmarks and contact numbers for easier delivery",
              "Ensuring someone is available to receive the package",
              "Checking package condition at time of delivery",
              "Reporting visible damage before signing/accepting",
              "Responding to delivery attempts and communications",
              "Paying applicable COD amount at delivery"
            ]}
          />
        </div>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 9: DAMAGED OR INCORRECT ORDERS
   * ========================================================================
   */
  {
    id: "damaged-orders",
    number: "9",
    title: "Damaged, Defective, or Incorrect Orders",
    icon: <AlertTriangle className="w-5 h-5" />,
    iconColor: "text-amber-600 dark:text-amber-400",
    severity: "warning",
    summary: "Procedures for reporting and resolving issues with orders.",
    content: (
      <div className="space-y-6">
        <ImportantNotice title="Strict Reporting Window">
          <p className="font-bold">
            All claims for damaged, defective, or incorrect products must be reported
            within 24 HOURS of delivery. Claims made after this window will NOT be entertained.
          </p>
        </ImportantNotice>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">9.1 Reporting Procedure</h4>
          <p className="text-muted-foreground">
            If you believe you have received a damaged, defective, or incorrect item,
            follow this procedure immediately:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
              <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">1</div>
              <div>
                <h5 className="font-bold">Do Not Use the Product</h5>
                <p className="text-sm text-muted-foreground">Keep the product unused, unwashed, and with all tags attached in original packaging.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
              <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">2</div>
              <div>
                <h5 className="font-bold">Document Everything</h5>
                <p className="text-sm text-muted-foreground">Take clear photographs of the product, damage/defect, labels, tags, and packaging from multiple angles.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
              <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">3</div>
              <div>
                <h5 className="font-bold">Contact Us Immediately</h5>
                <p className="text-sm text-muted-foreground">Email or contact customer support within 24 hours with Order ID, photos, and description of issue.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
              <div className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">4</div>
              <div>
                <h5 className="font-bold">Await Instructions</h5>
                <p className="text-sm text-muted-foreground">Do not dispose of or return the product until you receive specific instructions from us.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">9.2 Required Documentation</h4>
          <p className="text-muted-foreground">
            For any claim to be considered, you must provide:
          </p>
          <LegalList
            items={[
              "Order ID and order confirmation",
              "Clear photographs showing the issue",
              "Photo of product label/tag showing order details",
              "Photo of shipping label on package",
              "Photo of overall packaging condition",
              "Detailed written description of the issue",
              "Video evidence (if applicable for functionality issues)",
              "Any other documentation requested by support team"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">9.3 Verification Process</h4>
          <p className="text-muted-foreground">
            Upon receiving your claim:
          </p>
          <LegalList
            type="numbered"
            items={[
              "Our team will review the submitted documentation",
              "Additional information or photos may be requested",
              "We may arrange for physical inspection or pickup if needed",
              "Verification with warehouse/quality team will be conducted",
              "Decision will be communicated within 3-5 business days",
              "Resolution will be provided as per our policy and discretion"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">9.4 What Does NOT Qualify</h4>
          <p className="text-muted-foreground">
            The following do not constitute valid claims:
          </p>
          <LegalList
            items={[
              "Minor color variations from display",
              "Size not fitting as expected (if correct size was sent)",
              "Minor manufacturing variations within industry standards",
              "Wrinkles or folds from packaging (can be ironed out)",
              "Change in product material feel compared to expectations",
              "Damage caused by customer after delivery",
              "Products that have been worn, washed, or altered",
              "Claims made after the 24-hour reporting window"
            ]}
          />
        </div>

        <LegalHighlight type="critical">
          <strong>FRAUDULENT CLAIMS WARNING:</strong> Filing false claims, manipulating evidence,
          or attempting to deceive the Company will result in immediate account termination,
          blacklisting, and legal action under Section 420 of the Indian Penal Code (Cheating)
          and Section 463 (Forgery).
        </LegalHighlight>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 10: PROHIBITED CONDUCT AND FRAUD PREVENTION
   * ========================================================================
   */
  {
    id: "prohibited-conduct",
    number: "10",
    title: "Prohibited Conduct and Fraud Prevention",
    icon: <Ban className="w-5 h-5" />,
    iconColor: "text-red-600 dark:text-red-400",
    severity: "critical",
    summary: "Activities that are strictly prohibited and fraud prevention measures.",
    legalReferences: [
      "Indian Penal Code, 1860 - Sections 415, 420, 463, 465, 468",
      "Information Technology Act, 2000 - Sections 66, 66C, 66D",
      "Prevention of Money Laundering Act, 2002"
    ],
    content: (
      <div className="space-y-6">
        <CriticalWarning>
          <p>
            ENGAGING IN ANY PROHIBITED CONDUCT WILL RESULT IN IMMEDIATE ACCOUNT TERMINATION,
            PERMANENT BLACKLISTING, AND LEGAL ACTION INCLUDING CRIMINAL PROSECUTION.
          </p>
        </CriticalWarning>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">10.1 Prohibited Activities</h4>
          <p className="text-muted-foreground">
            The following activities are strictly prohibited on this Platform:
          </p>
          
          <div className="space-y-4">
            <LegalArticle number="A" title="Payment and Transaction Fraud">
              <LegalList
                items={[
                  "Using stolen, cloned, or unauthorized credit/debit cards",
                  "Making payments with insufficient funds or bounced checks",
                  "Initiating fraudulent chargebacks or payment disputes",
                  "Using fake or expired payment instruments",
                  "Money laundering or using the Platform for illegal fund transfers",
                  "Circumventing payment verification or security measures"
                ]}
              />
            </LegalArticle>

            <LegalArticle number="B" title="Identity and Account Fraud">
              <LegalList
                items={[
                  "Creating accounts with false or stolen identities",
                  "Impersonating another person or entity",
                  "Creating multiple accounts to circumvent restrictions",
                  "Using fake contact information or addresses",
                  "Providing false documentation for verification",
                  "Hacking or unauthorized access to other users' accounts"
                ]}
              />
            </LegalArticle>

            <LegalArticle number="C" title="Order and Delivery Abuse">
              <LegalList
                items={[
                  "Placing orders with no intention of accepting delivery",
                  "Repeatedly refusing COD deliveries",
                  "Providing false addresses to avoid delivery",
                  "Claiming non-delivery when delivery was made",
                  "Falsely claiming damaged or defective products",
                  "Wardrobing (wearing and returning products)",
                  "Abusing promotional codes or offers",
                  "Bulk purchasing for resale without authorization"
                ]}
              />
            </LegalArticle>

            <LegalArticle number="D" title="Technical and Security Violations">
              <LegalList
                items={[
                  "Attempting to hack, breach, or compromise Platform security",
                  "Introducing malware, viruses, or malicious code",
                  "Attempting to access unauthorized areas of the Platform",
                  "Scraping, crawling, or automated data extraction",
                  "Interfering with Platform operations or server stability",
                  "Reverse engineering or decompiling Platform software",
                  "Circumventing access controls or authentication",
                  "DDoS attacks or deliberate overloading of systems"
                ]}
              />
            </LegalArticle>

            <LegalArticle number="E" title="Abusive and Harmful Behavior">
              <LegalList
                items={[
                  "Harassment, threats, or abuse toward staff or other users",
                  "Posting false reviews or ratings",
                  "Defamation or spreading false information about the Company",
                  "Using the Platform for illegal activities",
                  "Violating intellectual property rights",
                  "Spamming or sending unsolicited communications"
                ]}
              />
            </LegalArticle>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">10.2 Fraud Detection and Prevention</h4>
          <p className="text-muted-foreground">
            We employ advanced fraud detection measures including:
          </p>
          <LegalList
            items={[
              "AI-powered transaction risk scoring",
              "Device fingerprinting and behavioral analysis",
              "IP geolocation and VPN/proxy detection",
              "Payment verification with issuing banks",
              "Address verification services",
              "Phone number verification and OTP",
              "Cross-referencing with fraud databases",
              "Machine learning pattern recognition",
              "Manual review of flagged transactions",
              "Collaboration with law enforcement agencies"
            ]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PenaltyBox
            title="Payment Fraud"
            description="Using stolen cards, fraudulent payments, or chargebacks"
            penalty="Criminal prosecution, up to 7 years imprisonment, and fine"
            statute="IPC Section 420 (Cheating)"
          />
          <PenaltyBox
            title="Identity Theft"
            description="Using another person's identity or personal information"
            penalty="Criminal prosecution, up to 3 years imprisonment, and ₹1 lakh fine"
            statute="IT Act Section 66C"
          />
          <PenaltyBox
            title="Computer Fraud"
            description="Hacking, unauthorized access, or system interference"
            penalty="Criminal prosecution, up to 3 years imprisonment, and ₹5 lakh fine"
            statute="IT Act Section 66"
          />
          <PenaltyBox
            title="Forgery"
            description="Creating or using fake documents or evidence"
            penalty="Criminal prosecution, up to 7 years imprisonment, and fine"
            statute="IPC Section 465"
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">10.3 Consequences of Violations</h4>
          <p className="text-muted-foreground">
            Violations of prohibited conduct will result in:
          </p>
          <LegalList
            type="numbered"
            items={[
              "Immediate and permanent account termination",
              "Cancellation of all pending orders without refund",
              "Blacklisting from all future transactions",
              "Recovery of any losses, damages, and legal costs",
              "Reporting to law enforcement agencies",
              "Filing of criminal complaints under applicable laws",
              "Civil litigation for damages",
              "Reporting to credit bureaus and fraud databases",
              "Sharing information with other merchants and platforms",
              "Any other remedies available under law"
            ]}
          />
        </div>

        <LegalHighlight type="legal">
          <strong>COOPERATION WITH AUTHORITIES:</strong> Ravenius fully cooperates with law
          enforcement agencies, cybercrime cells, and regulatory authorities. All fraudulent
          activities will be reported and evidence will be preserved for legal proceedings.
        </LegalHighlight>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 11: INTELLECTUAL PROPERTY RIGHTS
   * ========================================================================
   */
  {
    id: "intellectual-property",
    number: "11",
    title: "Intellectual Property Rights",
    icon: <Copyright className="w-5 h-5" />,
    iconColor: "text-purple-600 dark:text-purple-400",
    severity: "legal",
    summary: "Protection of intellectual property and usage rights.",
    legalReferences: [
      "Copyright Act, 1957",
      "Trade Marks Act, 1999",
      "Patents Act, 1970",
      "Designs Act, 2000",
      "Information Technology Act, 2000"
    ],
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-bold text-lg">11.1 Ownership</h4>
          <p className="text-muted-foreground">
            All intellectual property rights in and to the Platform, including but not limited to:
          </p>
          <LegalList
            items={[
              "The Ravenius brand name, logo, and trademarks",
              "Website design, layout, and visual elements",
              "Product photographs, descriptions, and content",
              "Software, source code, and proprietary technology",
              "Marketing materials and advertising content",
              "Database and customer information compilations",
              "Business methods and processes",
              "Trade secrets and confidential information"
            ]}
          />
          <p className="text-muted-foreground mt-3">
            are exclusively owned by or licensed to Ravenius and are protected under applicable
            Indian and international intellectual property laws.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">11.2 Limited License</h4>
          <p className="text-muted-foreground">
            Subject to these Terms, Ravenius grants you a limited, non-exclusive, non-transferable,
            revocable license to:
          </p>
          <LegalList
            items={[
              "Access and browse the Platform for personal, non-commercial use",
              "Place orders for products for personal consumption",
              "Download and print product information for personal reference",
              "Share product links for non-commercial purposes"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">11.3 Restrictions</h4>
          <p className="text-muted-foreground">
            You may NOT without prior written authorization:
          </p>
          <LegalList
            items={[
              "Copy, reproduce, or duplicate any Platform content",
              "Modify, adapt, or create derivative works",
              "Distribute, publish, or transmit Platform content",
              "Use Platform content for commercial purposes",
              "Remove or alter any copyright or trademark notices",
              "Frame or embed the Platform within other websites",
              "Use Platform trademarks in meta tags or hidden text",
              "Reverse engineer or decompile any software",
              "Create unauthorized links that imply endorsement",
              "Use content to train AI or machine learning models"
            ]}
          />
        </div>

        <LegalHighlight type="warning">
          <strong>COPYRIGHT INFRINGEMENT:</strong> Unauthorized use of Ravenius intellectual
          property constitutes infringement under the Copyright Act, 1957, and may result in
          civil liability (damages up to ₹50 lakhs) and criminal prosecution (imprisonment up
          to 3 years).
        </LegalHighlight>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">11.4 User Content</h4>
          <p className="text-muted-foreground">
            By submitting content to the Platform (reviews, photos, comments, etc.):
          </p>
          <LegalList
            items={[
              "You grant Ravenius a perpetual, worldwide, royalty-free license to use such content",
              "You warrant that you own or have rights to the content",
              "You warrant that the content does not infringe third-party rights",
              "We may edit, remove, or refuse to publish any user content",
              "You waive any moral rights in the content to the extent permitted by law"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">11.5 Reporting Infringement</h4>
          <p className="text-muted-foreground">
            If you believe your intellectual property rights have been infringed on our Platform,
            please contact us with:
          </p>
          <LegalList
            items={[
              "Identification of the copyrighted work or trademark claimed to be infringed",
              "Identification of the allegedly infringing material on our Platform",
              "Your contact information",
              "A statement of good faith belief that the use is not authorized",
              "A statement under penalty of perjury that the information is accurate",
              "Your signature (physical or electronic)"
            ]}
          />
        </div>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 12: PRIVACY AND DATA PROTECTION
   * ========================================================================
   */
  {
    id: "privacy",
    number: "12",
    title: "Privacy and Data Protection",
    icon: <Lock className="w-5 h-5" />,
    iconColor: "text-green-600 dark:text-green-400",
    severity: "info",
    summary: "How we collect, use, and protect your personal information.",
    legalReferences: [
      "Information Technology Act, 2000",
      "IT (Reasonable Security Practices) Rules, 2011",
      "Personal Data Protection Bill (when enacted)"
    ],
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-bold text-lg">12.1 Data Collection</h4>
          <p className="text-muted-foreground">
            We collect the following categories of information:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-xl p-4">
              <h5 className="font-bold mb-2 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-brand" />
                Personal Information
              </h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Name and contact details</li>
                <li>• Delivery addresses</li>
                <li>• Email address</li>
                <li>• Phone number</li>
                <li>• Date of birth (if provided)</li>
              </ul>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4">
              <h5 className="font-bold mb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-brand" />
                Financial Information
              </h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Partial card details (last 4 digits)</li>
                <li>• UPI IDs (masked)</li>
                <li>• Transaction history</li>
                <li>• Billing addresses</li>
              </ul>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4">
              <h5 className="font-bold mb-2 flex items-center gap-2">
                <MonitorSmartphone className="w-4 h-4 text-brand" />
                Technical Information
              </h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• IP address</li>
                <li>• Device information</li>
                <li>• Browser type and version</li>
                <li>• Operating system</li>
                <li>• Cookies and identifiers</li>
              </ul>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4">
              <h5 className="font-bold mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand" />
                Usage Information
              </h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Browsing history on Platform</li>
                <li>• Products viewed</li>
                <li>• Search queries</li>
                <li>• Purchase history</li>
                <li>• Interaction patterns</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">12.2 Purpose of Collection</h4>
          <p className="text-muted-foreground">
            We use collected information for:
          </p>
          <LegalList
            items={[
              "Processing and fulfilling orders",
              "Providing customer support",
              "Sending order updates and notifications",
              "Improving Platform functionality and user experience",
              "Fraud prevention and security",
              "Marketing and promotional communications (with consent)",
              "Legal compliance and dispute resolution",
              "Analytics and business insights"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">12.3 Data Sharing</h4>
          <p className="text-muted-foreground">
            We may share your information with:
          </p>
          <LegalList
            items={[
              "Courier partners for delivery fulfillment",
              "Payment processors for transaction processing",
              "Technology service providers",
              "Marketing and analytics partners (with consent)",
              "Legal and regulatory authorities as required by law",
              "Professional advisors (lawyers, accountants)",
              "Business partners with appropriate agreements"
            ]}
          />
          <LegalHighlight type="info">
            We do NOT sell your personal information to third parties for their marketing purposes.
          </LegalHighlight>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">12.4 Data Security</h4>
          <p className="text-muted-foreground">
            We implement reasonable security practices including:
          </p>
          <LegalList
            items={[
              "SSL/TLS encryption for data transmission",
              "Encryption of sensitive data at rest",
              "Access controls and authentication",
              "Regular security audits and assessments",
              "Employee training on data protection",
              "Incident response procedures",
              "Compliance with ISO 27001 standards"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">12.5 Your Rights</h4>
          <p className="text-muted-foreground">
            Under applicable Indian law, you have the right to:
          </p>
          <LegalList
            items={[
              "Access your personal information",
              "Correct inaccurate or incomplete information",
              "Withdraw consent for marketing communications",
              "Request deletion of your account and data",
              "Lodge complaints with relevant authorities",
              "Object to certain processing activities"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">12.6 Data Retention</h4>
          <p className="text-muted-foreground">
            We retain your personal information for:
          </p>
          <LegalList
            items={[
              "As long as your account is active",
              "As needed to provide services to you",
              "As required by applicable laws (typically 7 years for financial records)",
              "For legitimate business purposes such as fraud prevention",
              "Until you request deletion (subject to legal requirements)"
            ]}
          />
        </div>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 13: LIMITATION OF LIABILITY
   * ========================================================================
   */
  {
    id: "liability",
    number: "13",
    title: "Limitation of Liability",
    icon: <Shield className="w-5 h-5" />,
    iconColor: "text-slate-600 dark:text-slate-400",
    severity: "legal",
    summary: "Limits on the Company's liability and disclaimers.",
    legalReferences: [
      "Indian Contract Act, 1872 - Section 73",
      "Consumer Protection Act, 2019",
      "Sale of Goods Act, 1930"
    ],
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-bold text-lg">13.1 Disclaimer of Warranties</h4>
          <LegalHighlight type="legal">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE PLATFORM AND ALL PRODUCTS
            AND SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTY OF ANY KIND,
            EXPRESS OR IMPLIED.
          </LegalHighlight>
          <p className="text-muted-foreground">
            We specifically disclaim all warranties including:
          </p>
          <LegalList
            items={[
              "Implied warranties of merchantability and fitness for a particular purpose",
              "Warranties of non-infringement",
              "Warranties regarding security, reliability, timeliness, or performance",
              "Warranties that the Platform will be uninterrupted or error-free",
              "Warranties that defects will be corrected",
              "Warranties regarding accuracy of product information"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">13.2 Limitation of Damages</h4>
          <p className="text-muted-foreground">
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:
          </p>
          <LegalList
            items={[
              "Ravenius shall not be liable for any indirect, incidental, special, consequential, or punitive damages",
              "Ravenius shall not be liable for loss of profits, revenue, data, or business opportunities",
              "Ravenius shall not be liable for personal injury or property damage except as required by law",
              "Ravenius's total liability shall not exceed the amount paid for the specific product giving rise to the claim",
              "The foregoing limitations apply regardless of the form of action or theory of liability"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">13.3 Exclusions</h4>
          <p className="text-muted-foreground">
            Ravenius is not liable for:
          </p>
          <LegalList
            items={[
              "Third-party actions including courier delays or mishandling",
              "Payment gateway failures or processing errors",
              "Internet connectivity issues affecting access",
              "Actions of hackers or unauthorized third parties",
              "Natural disasters, pandemics, or force majeure events",
              "Government actions, lockdowns, or restrictions",
              "User errors in providing information or placing orders",
              "Compatibility issues with user devices or software",
              "Damages arising from misuse of products",
              "Loss or damage after product delivery"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">13.4 Essential Purpose</h4>
          <p className="text-muted-foreground">
            You acknowledge that the limitations of liability in this section are essential
            elements of the bargain between you and Ravenius, and form part of the basis of
            the prices charged for products and services. The limitations shall apply even if
            any remedy fails of its essential purpose.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">13.5 Consumer Protection</h4>
          <p className="text-muted-foreground">
            Nothing in these Terms limits or excludes liability that cannot be limited or
            excluded under applicable consumer protection laws. Where such limitations apply,
            our liability shall be limited to the extent permitted by law.
          </p>
          <StatuteReference
            statute="Consumer Protection Act, 2019"
            description="Consumer rights preserved"
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">13.6 Time Limitation</h4>
          <p className="text-muted-foreground">
            Any claim or cause of action arising from or relating to these Terms or the
            Platform must be filed within one (1) year after such claim or cause of action
            arose, or be forever barred, except where a longer limitation period is mandated
            by law.
          </p>
        </div>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 14: INDEMNIFICATION
   * ========================================================================
   */
  {
    id: "indemnification",
    number: "14",
    title: "Indemnification",
    icon: <ShieldAlert className="w-5 h-5" />,
    iconColor: "text-orange-600 dark:text-orange-400",
    severity: "warning",
    summary: "Your obligation to indemnify and hold the Company harmless.",
    legalReferences: [
      "Indian Contract Act, 1872 - Sections 124-147"
    ],
    content: (
      <div className="space-y-6">
        <LegalHighlight type="warning">
          <strong>INDEMNIFICATION OBLIGATION:</strong> By using this Platform, you agree to
          indemnify, defend, and hold harmless Ravenius and its affiliates from any claims,
          damages, losses, or expenses arising from your use of the Platform or violation
          of these Terms.
        </LegalHighlight>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">14.1 Scope of Indemnification</h4>
          <p className="text-muted-foreground">
            You agree to indemnify, defend, and hold harmless Ravenius, its parent companies,
            subsidiaries, affiliates, officers, directors, employees, agents, licensors, and
            suppliers from and against all:
          </p>
          <LegalList
            items={[
              "Claims, demands, and causes of action",
              "Losses, damages, and liabilities",
              "Costs, expenses, and fees (including reasonable attorneys' fees)",
              "Fines, penalties, and regulatory sanctions",
              "Settlement amounts and judgments"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">14.2 Triggering Events</h4>
          <p className="text-muted-foreground">
            This indemnification obligation applies to claims arising from or related to:
          </p>
          <LegalList
            items={[
              "Your use of the Platform or any breach of these Terms",
              "Your violation of any law, regulation, or third-party rights",
              "Any content you submit, post, or transmit through the Platform",
              "Your fraudulent, negligent, or wrongful conduct",
              "Your failure to comply with applicable laws",
              "Any misrepresentation made by you",
              "Your dispute with other users",
              "Any damage caused to the Platform or its users",
              "Your failure to pay for products or services",
              "Claims by third parties arising from your actions"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">14.3 Defense and Settlement</h4>
          <p className="text-muted-foreground">
            Regarding indemnified claims:
          </p>
          <LegalList
            items={[
              "We may assume exclusive defense and control of any indemnified matter",
              "You shall cooperate fully in the defense and not settle without our written consent",
              "We shall not settle any claim that admits liability on your behalf without your consent",
              "You shall provide reasonable assistance and information for defense",
              "You remain liable for any amounts payable under this indemnification"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">14.4 Survival</h4>
          <p className="text-muted-foreground">
            This indemnification obligation shall survive the termination of these Terms
            and your use of the Platform for any claims arising from events occurring during
            your use of the Platform.
          </p>
        </div>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 15: DISPUTE RESOLUTION AND ARBITRATION
   * ========================================================================
   */
  {
    id: "disputes",
    number: "15",
    title: "Dispute Resolution and Arbitration",
    icon: <Scale className="w-5 h-5" />,
    iconColor: "text-indigo-600 dark:text-indigo-400",
    severity: "legal",
    summary: "How disputes will be resolved, including mandatory arbitration.",
    legalReferences: [
      "Arbitration and Conciliation Act, 1996",
      "Code of Civil Procedure, 1908",
      "Consumer Protection Act, 2019 - Consumer Disputes Redressal"
    ],
    content: (
      <div className="space-y-6">
        <LegalHighlight type="legal">
          <strong>PLEASE READ THIS SECTION CAREFULLY.</strong> It affects your legal rights
          and requires you to arbitrate disputes and limits the manner in which you can
          seek relief.
        </LegalHighlight>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">15.1 Informal Resolution</h4>
          <p className="text-muted-foreground">
            Before initiating any formal dispute resolution:
          </p>
          <LegalList
            type="numbered"
            items={[
              "You must first contact our customer support to attempt informal resolution",
              "Provide complete details of your complaint in writing",
              "Allow 30 days for us to investigate and respond",
              "Engage in good faith negotiations to resolve the dispute",
              "Document all communications for future reference"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">15.2 Binding Arbitration</h4>
          <p className="text-muted-foreground">
            If informal resolution fails, any dispute, controversy, or claim arising out
            of or relating to these Terms, including the validity, invalidity, breach, or
            termination thereof, shall be settled by arbitration in accordance with the
            Arbitration and Conciliation Act, 1996.
          </p>
          
          <div className="bg-secondary/50 rounded-xl p-5 space-y-3">
            <h5 className="font-bold">Arbitration Terms:</h5>
            <LegalList
              items={[
                "The seat and venue of arbitration shall be [Your City], India",
                "The arbitration shall be conducted in English",
                "The arbitral tribunal shall consist of a sole arbitrator",
                "The arbitrator shall be appointed by mutual consent, or failing agreement, by the Court",
                "The arbitration proceedings shall be confidential",
                "The decision of the arbitrator shall be final and binding",
                "Each party shall bear its own costs unless the arbitrator decides otherwise",
                "The arbitration award may be enforced in any court of competent jurisdiction"
              ]}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">15.3 Class Action Waiver</h4>
          <LegalHighlight type="critical">
            <strong>CLASS ACTION WAIVER:</strong> You agree that any dispute resolution
            proceedings will be conducted only on an individual basis and not in a class,
            consolidated, or representative action. You waive any right to participate in
            class actions against the Company.
          </LegalHighlight>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">15.4 Consumer Forum Rights</h4>
          <p className="text-muted-foreground">
            Notwithstanding the above, consumers may have recourse to consumer forums as
            provided under the Consumer Protection Act, 2019:
          </p>
          <LegalList
            items={[
              "District Consumer Disputes Redressal Forum (claims up to ₹1 crore)",
              "State Consumer Disputes Redressal Commission (claims ₹1-10 crore)",
              "National Consumer Disputes Redressal Commission (claims above ₹10 crore)",
              "Filing within the prescribed limitation period"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">15.5 Jurisdiction</h4>
          <p className="text-muted-foreground">
            For any matters not subject to arbitration, or for enforcement of arbitral
            awards, the courts of [Your City], India shall have exclusive jurisdiction.
          </p>
          <StatuteReference
            statute="Code of Civil Procedure, 1908"
            section="Section 20"
            description="Jurisdiction of courts"
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">15.6 Time Limit for Claims</h4>
          <p className="text-muted-foreground">
            You must initiate any claim or dispute within ONE (1) YEAR of the event giving
            rise to the claim. Claims initiated after this period shall be time-barred.
          </p>
        </div>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 16: GOVERNING LAW
   * ========================================================================
   */
  {
    id: "governing-law",
    number: "16",
    title: "Governing Law",
    icon: <Gavel className="w-5 h-5" />,
    iconColor: "text-blue-600 dark:text-blue-400",
    severity: "legal",
    summary: "The laws that govern this agreement.",
    legalReferences: [
      "Constitution of India",
      "Indian Contract Act, 1872",
      "All applicable Central and State laws of India"
    ],
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-bold text-lg">16.1 Choice of Law</h4>
          <p className="text-muted-foreground">
            These Terms and any disputes arising out of or related to them or the Platform
            shall be governed by and construed in accordance with the laws of the Republic
            of India, without regard to its conflict of law provisions.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">16.2 Applicable Statutes</h4>
          <p className="text-muted-foreground">
            The following Indian laws, among others, apply to these Terms and your use of
            the Platform:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-xl p-4">
              <h5 className="font-bold mb-2">Contract & Commerce</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Indian Contract Act, 1872</li>
                <li>• Sale of Goods Act, 1930</li>
                <li>• Consumer Protection Act, 2019</li>
                <li>• Legal Metrology Act, 2009</li>
              </ul>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4">
              <h5 className="font-bold mb-2">Technology & Data</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Information Technology Act, 2000</li>
                <li>• IT Rules, 2011</li>
                <li>• E-Commerce Rules, 2020</li>
                <li>• Personal Data Protection Bill</li>
              </ul>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4">
              <h5 className="font-bold mb-2">Payments & Finance</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Payment & Settlement Systems Act, 2007</li>
                <li>• Prevention of Money Laundering Act, 2002</li>
                <li>• RBI Guidelines</li>
                <li>• GST Act, 2017</li>
              </ul>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4">
              <h5 className="font-bold mb-2">Criminal & Civil</h5>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Indian Penal Code, 1860</li>
                <li>• Code of Civil Procedure, 1908</li>
                <li>• Arbitration & Conciliation Act, 1996</li>
                <li>• Limitation Act, 1963</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">16.3 International Users</h4>
          <p className="text-muted-foreground">
            If you access the Platform from outside India:
          </p>
          <LegalList
            items={[
              "You are responsible for compliance with local laws",
              "Indian law shall still govern these Terms",
              "You consent to the jurisdiction of Indian courts",
              "You acknowledge that the Platform is operated from India"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">16.4 Regulatory Compliance</h4>
          <p className="text-muted-foreground">
            Ravenius operates in compliance with applicable regulatory requirements including:
          </p>
          <LegalList
            items={[
              "DPIIT Guidelines for E-commerce",
              "Consumer Protection (E-Commerce) Rules, 2020",
              "RBI Payment Regulations",
              "GST and indirect tax requirements",
              "MEITY guidelines on intermediary liability"
            ]}
          />
        </div>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 17: FORCE MAJEURE
   * ========================================================================
   */
  {
    id: "force-majeure",
    number: "17",
    title: "Force Majeure",
    icon: <AlertOctagon className="w-5 h-5" />,
    iconColor: "text-amber-600 dark:text-amber-400",
    severity: "warning",
    summary: "Events beyond our control that may affect service delivery.",
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-bold text-lg">17.1 Definition</h4>
          <p className="text-muted-foreground">
            Neither party shall be liable for any failure or delay in performing their
            obligations where such failure or delay results from Force Majeure, meaning
            any event or circumstance beyond the reasonable control of the affected party.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">17.2 Force Majeure Events</h4>
          <p className="text-muted-foreground">
            Force Majeure events include, but are not limited to:
          </p>
          <LegalList
            items={[
              "Natural disasters (earthquakes, floods, cyclones, tsunamis)",
              "Epidemics, pandemics, or public health emergencies",
              "War, armed conflict, terrorism, or civil unrest",
              "Government actions, lockdowns, or restrictions",
              "Strikes, labor disputes, or industrial action",
              "Failure of utilities (power, telecommunications)",
              "Cyber attacks or internet infrastructure failures",
              "Shortage of materials, fuel, or transportation",
              "Acts of third parties beyond our control",
              "Any other event beyond reasonable control of the parties"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">17.3 Effect of Force Majeure</h4>
          <p className="text-muted-foreground">
            Upon occurrence of a Force Majeure event:
          </p>
          <LegalList
            items={[
              "Affected obligations shall be suspended for the duration of the event",
              "Delivery timelines shall be extended accordingly",
              "We will make reasonable efforts to resume services",
              "We will notify customers of significant disruptions",
              "Neither party shall be liable for delays or non-performance",
              "Extended delays may result in order cancellation with refund"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">17.4 Mitigation</h4>
          <p className="text-muted-foreground">
            The affected party shall:
          </p>
          <LegalList
            items={[
              "Use reasonable efforts to mitigate the impact",
              "Keep the other party informed of developments",
              "Resume obligations as soon as reasonably practicable",
              "Explore alternative means of performance where possible"
            ]}
          />
        </div>

        <LegalHighlight type="info">
          Force Majeure does not excuse payment obligations for products already delivered
          or services already rendered.
        </LegalHighlight>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 18: THIRD-PARTY SERVICES
   * ========================================================================
   */
  {
    id: "third-party",
    number: "18",
    title: "Third-Party Services and Links",
    icon: <ExternalLink className="w-5 h-5" />,
    iconColor: "text-gray-600 dark:text-gray-400",
    severity: "info",
    summary: "Use of third-party services and external links.",
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-bold text-lg">18.1 Third-Party Services</h4>
          <p className="text-muted-foreground">
            The Platform integrates with various third-party services including:
          </p>
          <LegalList
            items={[
              "Payment gateways (Razorpay, PayU, etc.)",
              "Courier and logistics partners",
              "Analytics and tracking services",
              "Customer support tools",
              "Marketing and advertising platforms",
              "Cloud hosting and infrastructure services"
            ]}
          />
          <p className="text-muted-foreground mt-3">
            Your use of these services is subject to their respective terms and privacy policies.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">18.2 External Links</h4>
          <p className="text-muted-foreground">
            The Platform may contain links to external websites or resources:
          </p>
          <LegalList
            items={[
              "We do not control external websites and are not responsible for their content",
              "Links do not imply endorsement of the linked site",
              "You access external sites at your own risk",
              "External sites have their own terms and privacy policies",
              "We are not liable for any damages from using external sites"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">18.3 Disclaimer</h4>
          <LegalHighlight type="warning">
            RAVENIUS IS NOT RESPONSIBLE FOR ANY LOSS OR DAMAGE ARISING FROM YOUR USE OF
            THIRD-PARTY SERVICES OR EXTERNAL WEBSITES. YOUR INTERACTIONS WITH THIRD PARTIES
            ARE SOLELY BETWEEN YOU AND THE THIRD PARTY.
          </LegalHighlight>
        </div>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 19: COMMUNICATIONS
   * ========================================================================
   */
  {
    id: "communications",
    number: "19",
    title: "Communications and Notices",
    icon: <MessageSquare className="w-5 h-5" />,
    iconColor: "text-blue-600 dark:text-blue-400",
    severity: "info",
    summary: "How we communicate with you and how you can contact us.",
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-bold text-lg">19.1 Electronic Communications</h4>
          <p className="text-muted-foreground">
            By using the Platform, you consent to receive electronic communications from us.
            These may include:
          </p>
          <LegalList
            items={[
              "Order confirmations and updates",
              "Shipping and delivery notifications",
              "Account-related alerts and security notices",
              "Customer service responses",
              "Promotional offers and marketing (if opted-in)",
              "Legal notices and policy updates",
              "Surveys and feedback requests"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">19.2 Communication Channels</h4>
          <p className="text-muted-foreground">
            We may communicate with you through:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-xl p-4 flex items-center gap-3">
              <Mail className="w-5 h-5 text-brand" />
              <span>Email to your registered address</span>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 flex items-center gap-3">
              <PhoneCall className="w-5 h-5 text-brand" />
              <span>SMS to your registered phone</span>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 flex items-center gap-3">
              <Bell className="w-5 h-5 text-brand" />
              <span>Push notifications (if enabled)</span>
            </div>
            <div className="bg-secondary/50 rounded-xl p-4 flex items-center gap-3">
              <Globe className="w-5 h-5 text-brand" />
              <span>Notices posted on the Platform</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">19.3 Opting Out</h4>
          <p className="text-muted-foreground">
            You may opt out of promotional communications:
          </p>
          <LegalList
            items={[
              "Click 'unsubscribe' in marketing emails",
              "Reply 'STOP' to SMS marketing messages",
              "Adjust notification preferences in your account",
              "Contact customer support to update preferences"
            ]}
          />
          <LegalHighlight type="info">
            You cannot opt out of transactional communications related to your orders,
            account security, or legal notices.
          </LegalHighlight>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">19.4 Contacting Us</h4>
          <p className="text-muted-foreground">
            For questions or concerns about these Terms or the Platform:
          </p>
          <div className="bg-secondary/50 rounded-xl p-5">
            <h5 className="font-bold mb-3">Customer Support</h5>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Email: support@ravenius.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>Phone: [Support Number]</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Hours: Monday-Saturday, 10 AM - 6 PM IST</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 20: SEVERABILITY
   * ========================================================================
   */
  {
    id: "severability",
    number: "20",
    title: "Severability",
    icon: <Scissors className="w-5 h-5" />,
    iconColor: "text-gray-600 dark:text-gray-400",
    severity: "info",
    summary: "Effect of invalid or unenforceable provisions.",
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-bold text-lg">20.1 Partial Invalidity</h4>
          <p className="text-muted-foreground">
            If any provision of these Terms is held to be invalid, illegal, or unenforceable
            by any court or tribunal of competent jurisdiction:
          </p>
          <LegalList
            items={[
              "Such provision shall be severed from the Terms",
              "The remaining provisions shall continue in full force and effect",
              "The invalid provision shall be modified to the minimum extent necessary to make it valid",
              "If modification is not possible, the provision shall be deleted",
              "The parties shall negotiate in good faith to replace the invalid provision"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">20.2 Preservation of Intent</h4>
          <p className="text-muted-foreground">
            The invalidity of any provision shall not affect the validity of the remaining
            provisions, and the Terms shall be construed as if such invalid provision had
            never been contained herein.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">20.3 Essential Terms</h4>
          <p className="text-muted-foreground">
            Notwithstanding the above, if any essential term (including but not limited to
            the no-refund policy, arbitration clause, or limitation of liability) is found
            unenforceable, we reserve the right to terminate the Agreement.
          </p>
        </div>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 21: WAIVER
   * ========================================================================
   */
  {
    id: "waiver",
    number: "21",
    title: "Waiver",
    icon: <HandshakeIcon className="w-5 h-5" />,
    iconColor: "text-teal-600 dark:text-teal-400",
    severity: "info",
    summary: "Non-enforcement does not waive rights.",
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-bold text-lg">21.1 No Implied Waiver</h4>
          <p className="text-muted-foreground">
            No failure or delay by Ravenius in exercising any right, power, or privilege
            under these Terms shall operate as a waiver thereof. No waiver shall be
            effective unless in writing and signed by an authorized representative.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">21.2 Single or Partial Exercise</h4>
          <p className="text-muted-foreground">
            A single or partial exercise of any right, power, or privilege shall not
            preclude further exercise of that right or any other right. Rights and
            remedies under these Terms are cumulative and not exclusive.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">21.3 Course of Dealing</h4>
          <p className="text-muted-foreground">
            No course of dealing between the parties shall be deemed to modify these
            Terms or operate as a waiver of any rights thereunder.
          </p>
        </div>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 22: ENTIRE AGREEMENT
   * ========================================================================
   */
  {
    id: "entire-agreement",
    number: "22",
    title: "Entire Agreement",
    icon: <FileCheck className="w-5 h-5" />,
    iconColor: "text-green-600 dark:text-green-400",
    severity: "info",
    summary: "This is the complete agreement between parties.",
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-bold text-lg">22.1 Complete Agreement</h4>
          <p className="text-muted-foreground">
            These Terms, together with the Privacy Policy and any other policies
            incorporated by reference, constitute the entire agreement between you
            and Ravenius regarding the use of the Platform and supersede all prior
            agreements, representations, and understandings.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">22.2 Incorporated Documents</h4>
          <p className="text-muted-foreground">
            The following documents are incorporated by reference:
          </p>
          <LegalList
            items={[
              "Privacy Policy",
              "Cookie Policy",
              "Shipping Policy",
              "Return/Refund Policy (No Returns)",
              "Acceptable Use Policy",
              "Any product-specific terms displayed on the Platform"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">22.3 Representations</h4>
          <p className="text-muted-foreground">
            You acknowledge that you have not relied on any representation, promise,
            or warranty not expressly set forth in these Terms. No employee or agent
            of Ravenius is authorized to make representations beyond these Terms.
          </p>
        </div>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 23: ASSIGNMENT
   * ========================================================================
   */
  {
    id: "assignment",
    number: "23",
    title: "Assignment",
    icon: <Users className="w-5 h-5" />,
    iconColor: "text-blue-600 dark:text-blue-400",
    severity: "info",
    summary: "Transfer of rights and obligations.",
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-bold text-lg">23.1 Assignment by You</h4>
          <p className="text-muted-foreground">
            You may not assign, transfer, or sublicense any of your rights or obligations
            under these Terms without the prior written consent of Ravenius. Any attempted
            assignment without consent shall be null and void.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">23.2 Assignment by Company</h4>
          <p className="text-muted-foreground">
            Ravenius may assign, transfer, or delegate any of its rights and obligations
            under these Terms without restriction, including in connection with:
          </p>
          <LegalList
            items={[
              "Merger, acquisition, or sale of assets",
              "Corporate restructuring",
              "Assignment to affiliates or subsidiaries",
              "Outsourcing of services to third parties"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">23.3 Binding Effect</h4>
          <p className="text-muted-foreground">
            These Terms shall be binding upon and inure to the benefit of the parties
            and their respective successors and permitted assigns.
          </p>
        </div>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 24: AMENDMENTS AND MODIFICATIONS
   * ========================================================================
   */
  {
    id: "amendments",
    number: "24",
    title: "Amendments and Modifications",
    icon: <FilePen className="w-5 h-5" />,
    iconColor: "text-orange-600 dark:text-orange-400",
    severity: "warning",
    summary: "How these Terms may be changed.",
    content: (
      <div className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-bold text-lg">24.1 Right to Amend</h4>
          <p className="text-muted-foreground">
            Ravenius reserves the right to modify, amend, or update these Terms at any
            time at its sole discretion. We may do so for reasons including:
          </p>
          <LegalList
            items={[
              "Changes in our services or business practices",
              "Legal or regulatory requirements",
              "Security enhancements",
              "Clarification of existing provisions",
              "Addition of new features or services",
              "Response to user feedback"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">24.2 Notice of Changes</h4>
          <p className="text-muted-foreground">
            When we make material changes to these Terms:
          </p>
          <LegalList
            items={[
              "We will update the 'Last Updated' date at the top of these Terms",
              "We may send email notification for significant changes",
              "We may display a prominent notice on the Platform",
              "Changes are effective immediately upon posting unless otherwise stated"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">24.3 Your Responsibility</h4>
          <LegalHighlight type="warning">
            It is your responsibility to review these Terms periodically for changes.
            Your continued use of the Platform after changes are posted constitutes
            acceptance of the modified Terms.
          </LegalHighlight>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">24.4 No Oral Modifications</h4>
          <p className="text-muted-foreground">
            These Terms may not be modified orally. No representative of Ravenius has
            authority to modify these Terms verbally or through informal communications.
          </p>
        </div>
      </div>
    )
  },

  /**
   * ========================================================================
   * SECTION 25: ACKNOWLEDGMENT AND ACCEPTANCE
   * ========================================================================
   */
  {
    id: "acknowledgment",
    number: "25",
    title: "Acknowledgment and Acceptance",
    icon: <CheckCircle className="w-5 h-5" />,
    iconColor: "text-green-600 dark:text-green-400",
    severity: "legal",
    summary: "Your acknowledgment and acceptance of these Terms.",
    content: (
      <div className="space-y-6">
        <CriticalWarning>
          <p className="text-lg mb-3">
            BY USING THIS PLATFORM, YOU ACKNOWLEDGE THAT:
          </p>
          <ul className="space-y-2 text-sm">
            <li>• You have READ these Terms of Service in their entirety</li>
            <li>• You UNDERSTAND the rights and obligations set forth herein</li>
            <li>• You AGREE to be legally bound by these Terms</li>
            <li>• You are of LEGAL AGE and capacity to enter this agreement</li>
            <li>• You ACCEPT the no-refund, no-return, no-exchange policy</li>
            <li>• You CONSENT to binding arbitration for dispute resolution</li>
            <li>• You WAIVE your right to participate in class actions</li>
          </ul>
        </CriticalWarning>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">25.1 Binding Agreement</h4>
          <p className="text-muted-foreground">
            Your use of the Platform, whether by browsing, creating an account, or placing
            an order, constitutes your electronic signature and acceptance of these Terms,
            creating a legally binding contract under the Information Technology Act, 2000.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">25.2 Deemed Acceptance</h4>
          <p className="text-muted-foreground">
            Acceptance of these Terms is deemed to occur when you:
          </p>
          <LegalList
            items={[
              "Access or browse the Platform",
              "Create an account or register",
              "Add products to your cart",
              "Proceed to checkout",
              "Complete a purchase",
              "Contact customer support",
              "Submit any content to the Platform"
            ]}
          />
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-lg">25.3 No Oral Agreements</h4>
          <p className="text-muted-foreground">
            No verbal agreements, promises, or representations made by any representative
            of Ravenius shall be binding unless expressly incorporated in these written Terms.
          </p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-6 text-center">
          <div className="flex justify-center mb-4">
            <Lottie
              animationData={legalShieldLottie}
              loop
              className="w-24 h-24"
            />
          </div>
          <h3 className="text-2xl font-bold text-indigo-900 dark:text-indigo-100 mb-2">
            Thank You for Reviewing Our Terms
          </h3>
          <p className="text-indigo-700 dark:text-indigo-300">
            These Terms are designed to protect both you and Ravenius while ensuring
            a fair and transparent shopping experience. If you have any questions,
            please contact our customer support team.
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <StatuteReference
            statute="Indian Contract Act, 1872"
            description="Legal framework"
          />
          <StatuteReference
            statute="IT Act, 2000"
            description="Electronic contracts"
          />
          <StatuteReference
            statute="Consumer Protection Act, 2019"
            description="Consumer rights"
          />
        </div>
      </div>
    )
  }
];

/**
 * ============================================================================
 * MAIN COMPONENT
 * ============================================================================
 */

export default function TermsOfService() {
  const prefersReduced = useReducedMotion();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showTableOfContents, setShowTableOfContents] = useState(true);

  const lastUpdated = useMemo(() => {
    return new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, []);

  const handleSectionClick = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
      setActiveSection(id);
    }
  }, [prefersReduced]);

  const toggleSection = useCallback((id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const sectionAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-16 md:py-24">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOGM5Ljk0MSAwIDE4LTguMDU5IDE4LTE4cy04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L2c+PC9zdmc+')] opacity-50" />
          
          <div className="container relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex justify-center mb-6"
              >
                <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Lottie
                    animationData={legalShieldLottie}
                    loop={!prefersReduced}
                    className="w-16 h-16"
                  />
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4"
              >
                Terms of Service
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-white/70 mb-6"
              >
                Legally Binding Agreement Under Indian Law
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap justify-center gap-4 text-sm"
              >
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <CalendarClock className="w-4 h-4" />
                  <span>Last Updated: {lastUpdated}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <ScrollText className="w-4 h-4" />
                  <span>25 Comprehensive Sections</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                  <Landmark className="w-4 h-4" />
                  <span>Indian Law Compliant</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </section>

        {/* Important Notice Banner */}
        <section className="bg-red-600 text-white py-4">
          <div className="container">
            <div className="flex items-center justify-center gap-3 text-center">
              <AlertTriangle className="w-6 h-6 flex-shrink-0 animate-pulse" />
              <span className="font-bold text-sm md:text-base">
                ALL SALES ARE FINAL. NO RETURNS, NO EXCHANGES, NO REFUNDS. READ CAREFULLY BEFORE ORDERING.
              </span>
              <AlertTriangle className="w-6 h-6 flex-shrink-0 animate-pulse" />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="container py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Table of Contents - Desktop Sidebar */}
            <aside className="hidden lg:block lg:w-80 flex-shrink-0">
              <TableOfContents
                sections={TERMS_SECTIONS}
                activeSection={activeSection}
                onSectionClick={handleSectionClick}
              />
            </aside>

            {/* Mobile Table of Contents Toggle */}
            <div className="lg:hidden mb-6">
              <Button
                variant="outline"
                onClick={() => setShowTableOfContents(!showTableOfContents)}
                className="w-full justify-between"
              >
                <span className="flex items-center gap-2">
                  <ListChecks className="w-4 h-4" />
                  Table of Contents
                </span>
                {showTableOfContents ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
              <AnimatePresence>
                {showTableOfContents && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 bg-card border rounded-xl p-4 max-h-96 overflow-y-auto"
                  >
                    <ul className="space-y-1">
                      {TERMS_SECTIONS.map((section) => (
                        <li key={section.id}>
                          <button
                            onClick={() => {
                              handleSectionClick(section.id);
                              setShowTableOfContents(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-colors"
                          >
                            <span className="font-mono text-xs mr-2">{section.number}</span>
                            {section.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sections Content */}
            <main className="flex-1 min-w-0">
              <div className="space-y-8">
                {TERMS_SECTIONS.map((section, index) => (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={sectionAnimation}
                    className={cn(
                      "bg-card border rounded-2xl overflow-hidden shadow-sm",
                      section.severity === "critical" && "border-red-300 dark:border-red-800",
                      section.severity === "warning" && "border-amber-300 dark:border-amber-800",
                      section.severity === "legal" && "border-indigo-300 dark:border-indigo-800"
                    )}
                  >
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full px-6 py-5 flex items-center gap-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div className={cn(
                        "p-3 rounded-xl flex-shrink-0",
                        section.severity === "critical" && "bg-red-100 dark:bg-red-900/30",
                        section.severity === "warning" && "bg-amber-100 dark:bg-amber-900/30",
                        section.severity === "legal" && "bg-indigo-100 dark:bg-indigo-900/30",
                        section.severity === "info" && "bg-secondary"
                      )}>
                        <span className={section.iconColor}>{section.icon}</span>
                      </div>
                      <div className="flex-1 text-left">
                        <h2 className="font-bold text-lg md:text-xl flex items-center gap-2">
                          <span className="text-muted-foreground font-mono text-sm">
                            §{section.number}
                          </span>
                          {section.title}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">{section.summary}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {expandedSections.has(section.id) ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {/* Section Content */}
                    <AnimatePresence>
                      {expandedSections.has(section.id) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t"
                        >
                          <div className="p-6 space-y-6">
                            {/* Legal References */}
                            {section.legalReferences && section.legalReferences.length > 0 && (
                              <div className="flex flex-wrap gap-2 pb-4 border-b">
                                {section.legalReferences.map((ref, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded"
                                  >
                                    {ref}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Main Content */}
                            <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-p:text-muted-foreground prose-li:text-muted-foreground">
                              {section.content}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.section>
                ))}
              </div>
            </main>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t bg-secondary/30 py-12">
          <div className="container">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="flex justify-center">
                <Shield className="w-12 h-12 text-brand" />
              </div>
              <h3 className="text-2xl font-bold">Ravenius Terms of Service</h3>
              <p className="text-muted-foreground">
                This document is legally binding under the laws of India. By using our Platform,
                you agree to all terms and conditions stated herein.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <StatuteReference statute="Indian Contract Act, 1872" />
                <StatuteReference statute="IT Act, 2000" />
                <StatuteReference statute="Consumer Protection Act, 2019" />
              </div>
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Ravenius. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
