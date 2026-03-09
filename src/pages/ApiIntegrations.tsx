import { useState } from "react";
import {
  Search, Shield, Database, Brain, Mail, CreditCard, FileText,
  Globe, MessageSquare, BarChart3, Users, Zap, Lock, Cloud,
  ArrowUpRight, CheckCircle2, AlertCircle, Star, Layers,
  Activity, Eye, Webhook, Key, Server, GitBranch, FolderOpen,
  Package, Bell, Upload, ListFilter, ClipboardList, Route
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

type Priority = "critical" | "high" | "medium" | "nice-to-have";
type Category = "data" | "ai" | "communication" | "payments" | "auth" | "infrastructure" | "analytics" | "compliance" | "backend";

interface ApiIntegration {
  name: string;
  provider: string;
  category: Category;
  priority: Priority;
  icon: React.ElementType;
  description: string;
  whyNeeded: string;
  features: string[];
  estimatedCost: string;
  docsUrl: string;
  alternativesNote?: string;
}

const priorityConfig: Record<Priority, { label: string; color: string; order: number }> = {
  critical: { label: "Critical", color: "bg-destructive text-destructive-foreground", order: 0 },
  high: { label: "High", color: "bg-orange-500 text-white", order: 1 },
  medium: { label: "Medium", color: "bg-primary text-primary-foreground", order: 2 },
  "nice-to-have": { label: "Nice to Have", color: "bg-muted text-muted-foreground", order: 3 },
};

const categoryConfig: Record<Category, { label: string; icon: React.ElementType; color: string }> = {
  data: { label: "Data & Enrichment", icon: Database, color: "text-emerald-600" },
  ai: { label: "AI & Intelligence", icon: Brain, color: "text-violet-600" },
  communication: { label: "Communication", icon: MessageSquare, color: "text-sky-600" },
  payments: { label: "Payments & Billing", icon: CreditCard, color: "text-amber-600" },
  auth: { label: "Auth & Security", icon: Shield, color: "text-red-600" },
  infrastructure: { label: "Infrastructure", icon: Server, color: "text-slate-600" },
  analytics: { label: "Analytics & Monitoring", icon: BarChart3, color: "text-indigo-600" },
  compliance: { label: "Compliance & Legal", icon: FileText, color: "text-teal-600" },
  backend: { label: "Internal Backend APIs", icon: Route, color: "text-pink-600" },
};

const apis: ApiIntegration[] = [
  // DATA & ENRICHMENT
  {
    name: "Crunchbase API",
    provider: "Crunchbase",
    category: "data",
    priority: "critical",
    icon: Database,
    description: "Company data, funding rounds, acquisitions, key people, and industry classifications.",
    whyNeeded: "Core to the platform — provides real company profiles, M&A history, financials, and leadership data instead of mock data. Essential for accurate company scoring and mandate matching.",
    features: ["Company profiles & financials", "Funding history & investors", "Acquisitions & IPO data", "Key people & board members", "Industry & category taxonomy"],
    estimatedCost: "$499–$6,000/mo (Enterprise)",
    docsUrl: "https://data.crunchbase.com/docs",
  },
  {
    name: "PitchBook API",
    provider: "PitchBook",
    category: "data",
    priority: "high",
    icon: Layers,
    description: "Private market data covering PE, VC, and M&A transactions.",
    whyNeeded: "Provides deeper M&A transaction data, deal multiples, and private company valuations that Crunchbase may not cover. Critical for accurate deal benchmarking.",
    features: ["Deal multiples & valuations", "PE & VC fund data", "M&A transaction history", "Company financials (private)", "Limited partner data"],
    estimatedCost: "Custom pricing (Enterprise)",
    docsUrl: "https://pitchbook.com/data",
    alternativesNote: "Alternatives: Dealogic, Refinitiv, S&P Capital IQ",
  },
  {
    name: "Clearbit / Apollo API",
    provider: "Clearbit (HubSpot) / Apollo.io",
    category: "data",
    priority: "high",
    icon: Users,
    description: "Company enrichment, tech stack detection, employee data, and contact info.",
    whyNeeded: "Enriches company profiles with real-time tech stack, employee count, revenue estimates, and decision-maker contacts for outreach in the Pipeline/CRM module.",
    features: ["Company enrichment", "Tech stack detection", "Employee directory", "Contact discovery", "Revenue estimation"],
    estimatedCost: "$99–$999/mo",
    docsUrl: "https://dashboard.clearbit.com/docs",
  },
  {
    name: "LinkedIn API / Sales Navigator",
    provider: "LinkedIn (Microsoft)",
    category: "data",
    priority: "high",
    icon: Globe,
    description: "Professional network data for management team profiles and company pages.",
    whyNeeded: "Validates management team data, provides leadership backgrounds, and enables warm introductions — key for the M&A due diligence process and the Management tab in Company Profile.",
    features: ["Company page data", "Employee profiles", "Organizational insights", "Shared connections", "InMail outreach"],
    estimatedCost: "$99–$1,600/mo (Sales Navigator)",
    docsUrl: "https://docs.microsoft.com/linkedin/",
  },
  // AI & INTELLIGENCE
  {
    name: "OpenAI API",
    provider: "OpenAI",
    category: "ai",
    priority: "critical",
    icon: Brain,
    description: "GPT-4 for intelligent mandate matching, company scoring, report generation, and natural language queries.",
    whyNeeded: "Powers the intelligence layer — automated M&A score calculation, mandate-company matching algorithms, natural language search across deals, and auto-generated deal memos and reports.",
    features: ["M&A score computation", "Mandate-company matching", "Deal memo generation", "Natural language search", "Sentiment analysis on news"],
    estimatedCost: "$50–$500/mo (usage-based)",
    docsUrl: "https://platform.openai.com/docs",
    alternativesNote: "Alternatives: Anthropic Claude, Google Gemini, Cohere",
  },
  {
    name: "Perplexity API",
    provider: "Perplexity AI",
    category: "ai",
    priority: "medium",
    icon: Search,
    description: "AI-powered search engine for real-time company research and competitive intelligence.",
    whyNeeded: "Enables real-time research on target companies — pulling latest news, market analysis, and competitive positioning directly into the Watchlist and Company Profile modules.",
    features: ["Real-time web search", "Cited answers", "Company research", "Market trend analysis", "Competitive intelligence"],
    estimatedCost: "$50–$200/mo",
    docsUrl: "https://docs.perplexity.ai",
  },
  {
    name: "Firecrawl API",
    provider: "Firecrawl",
    category: "ai",
    priority: "medium",
    icon: Globe,
    description: "AI-powered web scraping for extracting structured data from company websites.",
    whyNeeded: "Automates data collection from target company websites — extracting product info, team pages, tech stack, and other structured data to enrich company profiles.",
    features: ["Structured data extraction", "Website crawling", "Content parsing", "Batch processing", "API-first scraping"],
    estimatedCost: "$19–$199/mo",
    docsUrl: "https://docs.firecrawl.dev",
  },
  // COMMUNICATION
  {
    name: "SendGrid / Resend API",
    provider: "Twilio SendGrid / Resend",
    category: "communication",
    priority: "high",
    icon: Mail,
    description: "Transactional and marketing email delivery for outreach, notifications, and reports.",
    whyNeeded: "Powers email notifications (mandate updates, watchlist alerts), outreach sequences in the Pipeline/CRM, and scheduled deliverable reports sent to stakeholders.",
    features: ["Transactional emails", "Email templates", "Delivery tracking", "Outreach sequences", "Scheduled reports"],
    estimatedCost: "$0–$89/mo",
    docsUrl: "https://docs.sendgrid.com",
  },
  {
    name: "Slack API",
    provider: "Slack (Salesforce)",
    category: "communication",
    priority: "medium",
    icon: MessageSquare,
    description: "Real-time notifications and team collaboration via Slack channels.",
    whyNeeded: "Delivers real-time deal alerts to team channels — new company matches, stage changes, watchlist triggers, and mandate updates — keeping the M&A team in sync.",
    features: ["Channel notifications", "Deal alerts", "Slash commands", "Interactive messages", "Workflow automation"],
    estimatedCost: "Free (API)",
    docsUrl: "https://api.slack.com/docs",
  },
  // PAYMENTS
  {
    name: "Stripe API",
    provider: "Stripe",
    category: "payments",
    priority: "high",
    icon: CreditCard,
    description: "Payment processing, subscription management, and billing for SaaS monetization.",
    whyNeeded: "Monetizes the platform with subscription tiers (Free, Pro, Enterprise), usage-based billing for API calls, and handles invoicing for enterprise clients.",
    features: ["Subscription billing", "Usage metering", "Invoice generation", "Payment links", "Customer portal"],
    estimatedCost: "2.9% + 30¢ per transaction",
    docsUrl: "https://stripe.com/docs/api",
  },
  // AUTH & SECURITY
  {
    name: "Supabase Auth (Lovable Cloud)",
    provider: "Supabase / Lovable",
    category: "auth",
    priority: "critical",
    icon: Lock,
    description: "Authentication, authorization, Row-Level Security, and user management.",
    whyNeeded: "Secures the platform with user authentication (email, Google, SSO), role-based access control (admin, analyst, viewer), and row-level security to ensure data isolation between teams.",
    features: ["Email/password auth", "OAuth (Google, Microsoft)", "Role-based access", "Row-Level Security", "Session management"],
    estimatedCost: "Included with Lovable Cloud",
    docsUrl: "https://supabase.com/docs/guides/auth",
  },
  {
    name: "Auth0 / Okta SSO",
    provider: "Auth0 (Okta)",
    category: "auth",
    priority: "nice-to-have",
    icon: Key,
    description: "Enterprise SSO with SAML/OIDC for large organization onboarding.",
    whyNeeded: "Enterprise clients require SSO integration with their identity providers (Azure AD, Okta). Essential for enterprise sales and SOC 2 compliance.",
    features: ["SAML 2.0 SSO", "OIDC integration", "Multi-factor auth", "Directory sync", "Audit logs"],
    estimatedCost: "$23–$240/mo",
    docsUrl: "https://auth0.com/docs",
  },
  // INFRASTRUCTURE
  {
    name: "Supabase Database (Lovable Cloud)",
    provider: "Supabase / Lovable",
    category: "infrastructure",
    priority: "critical",
    icon: Database,
    description: "PostgreSQL database with real-time subscriptions, storage, and edge functions.",
    whyNeeded: "Replaces all mock data with persistent storage — mandates, companies, pipeline stages, activity logs, notes, watchlists, and deliverables need a real database.",
    features: ["PostgreSQL database", "Real-time subscriptions", "File storage", "Edge functions", "Database backups"],
    estimatedCost: "Included with Lovable Cloud",
    docsUrl: "https://supabase.com/docs",
  },
  {
    name: "Upstash / Redis",
    provider: "Upstash",
    category: "infrastructure",
    priority: "nice-to-have",
    icon: Zap,
    description: "Serverless Redis for caching, rate limiting, and job queues.",
    whyNeeded: "Caches frequently accessed company data, rate-limits API calls to expensive data providers, and manages background job queues for data enrichment.",
    features: ["Response caching", "Rate limiting", "Job queues", "Session storage", "Pub/Sub messaging"],
    estimatedCost: "$0–$100/mo",
    docsUrl: "https://upstash.com/docs",
  },
  {
    name: "Webhooks / Event Bus",
    provider: "Custom / Inngest",
    category: "infrastructure",
    priority: "medium",
    icon: Webhook,
    description: "Event-driven architecture for async workflows like enrichment pipelines and notification dispatch.",
    whyNeeded: "Orchestrates background workflows — when a company is added to a mandate, trigger enrichment, score calculation, team notification, and activity logging asynchronously.",
    features: ["Event routing", "Retry logic", "Workflow orchestration", "Scheduled jobs", "Dead letter queues"],
    estimatedCost: "$0–$50/mo",
    docsUrl: "https://www.inngest.com/docs",
  },
  // ANALYTICS
  {
    name: "PostHog / Mixpanel",
    provider: "PostHog",
    category: "analytics",
    priority: "medium",
    icon: Activity,
    description: "Product analytics, session replay, and feature flags for understanding user behavior.",
    whyNeeded: "Tracks how deal teams use the platform — which features drive engagement, where users drop off, and which mandates get the most attention. Critical for product iteration.",
    features: ["Event tracking", "Session replay", "Funnels & retention", "Feature flags", "A/B testing"],
    estimatedCost: "$0–$450/mo",
    docsUrl: "https://posthog.com/docs",
  },
  {
    name: "Sentry",
    provider: "Sentry",
    category: "analytics",
    priority: "high",
    icon: AlertCircle,
    description: "Error tracking, performance monitoring, and crash reporting.",
    whyNeeded: "Catches runtime errors before users report them — critical for a data-intensive platform where API failures, data parsing errors, and edge cases are common.",
    features: ["Error tracking", "Performance monitoring", "Release tracking", "Source maps", "Alert routing"],
    estimatedCost: "$0–$80/mo",
    docsUrl: "https://docs.sentry.io",
  },
  // COMPLIANCE
  {
    name: "DocuSign / PandaDoc API",
    provider: "DocuSign / PandaDoc",
    category: "compliance",
    priority: "nice-to-have",
    icon: FileText,
    description: "Digital document signing for NDAs, LOIs, and deal-related legal documents.",
    whyNeeded: "M&A workflows involve NDA signing before sharing confidential data, LOIs after due diligence, and other legal docs — digital signing streamlines the Deliverables module.",
    features: ["E-signatures", "Document templates", "Audit trails", "Workflow automation", "Compliance tracking"],
    estimatedCost: "$25–$65/mo per user",
    docsUrl: "https://developers.docusign.com",
  },
  {
    name: "Google Drive / OneDrive API",
    provider: "Google / Microsoft",
    category: "compliance",
    priority: "medium",
    icon: Cloud,
    description: "Cloud storage integration for deal room documents, reports, and shared files.",
    whyNeeded: "Deal teams store due diligence documents, financial models, and reports in cloud drives — integration lets users attach and access these directly from the Projects & Deliverables modules.",
    features: ["File sync", "Shared drives", "Version history", "Permission management", "Search across files"],
    estimatedCost: "Free (API) / $6–$18/mo per user (storage)",
    docsUrl: "https://developers.google.com/drive",
  },
];

const allCategories = Object.keys(categoryConfig) as Category[];

export default function ApiIntegrations() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [activePriority, setActivePriority] = useState<Priority | "all">("all");

  const filtered = apis.filter((api) => {
    const matchesSearch =
      api.name.toLowerCase().includes(search.toLowerCase()) ||
      api.description.toLowerCase().includes(search.toLowerCase()) ||
      api.provider.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || api.category === activeCategory;
    const matchesPriority = activePriority === "all" || api.priority === activePriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const sortedFiltered = [...filtered].sort(
    (a, b) => priorityConfig[a.priority].order - priorityConfig[b.priority].order
  );

  const stats = {
    total: apis.length,
    critical: apis.filter((a) => a.priority === "critical").length,
    high: apis.filter((a) => a.priority === "high").length,
    medium: apis.filter((a) => a.priority === "medium").length,
    niceToHave: apis.filter((a) => a.priority === "nice-to-have").length,
  };

  const readiness = Math.round(
    (apis.filter((a) => a.priority === "critical" || a.priority === "high").length / apis.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">API Integrations Roadmap</h1>
        <p className="text-muted-foreground mt-1">
          All APIs and services needed to make GrowthPal DataVision an industry-standard M&A intelligence platform.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total APIs</p>
          </CardContent>
        </Card>
        <Card className="border-destructive/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-destructive">{stats.critical}</p>
            <p className="text-xs text-muted-foreground">Critical</p>
          </CardContent>
        </Card>
        <Card className="border-orange-400/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-orange-500">{stats.high}</p>
            <p className="text-xs text-muted-foreground">High Priority</p>
          </CardContent>
        </Card>
        <Card className="border-primary/30">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats.medium}</p>
            <p className="text-xs text-muted-foreground">Medium</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-muted-foreground">{stats.niceToHave}</p>
            <p className="text-xs text-muted-foreground">Nice to Have</p>
          </CardContent>
        </Card>
      </div>

      {/* Readiness Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Core Integration Readiness</span>
            <span className="text-sm text-muted-foreground">{readiness}% of APIs are Critical/High priority</span>
          </div>
          <Progress value={readiness} className="h-2" />
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search APIs, providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            activeCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
        >
          All Categories
        </button>
        {allCategories.map((cat) => {
          const cfg = categoryConfig[cat];
          const Icon = cfg.icon;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              <Icon className="h-3 w-3" />
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Priority Filter */}
      <div className="flex gap-2">
        <span className="text-xs text-muted-foreground self-center mr-1">Priority:</span>
        {(["all", "critical", "high", "medium", "nice-to-have"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setActivePriority(p)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activePriority === p
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            }`}
          >
            {p === "all" ? "All" : priorityConfig[p].label}
          </button>
        ))}
      </div>

      {/* API Cards */}
      <div className="grid gap-4">
        {sortedFiltered.map((api) => {
          const CatIcon = categoryConfig[api.category].icon;
          return (
            <Card key={api.name} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-muted ${categoryConfig[api.category].color}`}>
                      <api.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {api.name}
                        <Badge className={`text-[10px] ${priorityConfig[api.priority].color}`}>
                          {priorityConfig[api.priority].label}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-0.5">{api.provider}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">Est. Cost</p>
                    <p className="text-sm font-medium text-foreground">{api.estimatedCost}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-foreground">{api.description}</p>

                <div className="bg-accent/50 rounded-lg p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Star className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-xs font-semibold text-foreground">Why It's Needed</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{api.whyNeeded}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">Key Features</p>
                  <div className="flex flex-wrap gap-1.5">
                    {api.features.map((f) => (
                      <Badge key={f} variant="secondary" className="text-[11px] font-normal">
                        <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-500" />
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>

                {api.alternativesNote && (
                  <p className="text-xs text-muted-foreground italic">{api.alternativesNote}</p>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <CatIcon className={`h-3.5 w-3.5 ${categoryConfig[api.category].color}`} />
                    <span className="text-xs text-muted-foreground">{categoryConfig[api.category].label}</span>
                  </div>
                  <a
                    href={api.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    View Docs <ArrowUpRight className="h-3 w-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sortedFiltered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No APIs match your filters.</p>
        </div>
      )}
    </div>
  );
}
