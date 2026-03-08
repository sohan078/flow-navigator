import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { companies } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Search, GitBranch, StickyNote, Star, XCircle, CheckCircle2,
  FileText, Users, Eye, Mail, Phone, Calendar, Filter,
  ArrowRight, Clock,
} from "lucide-react";

type ActivityType = "stage_change" | "note" | "meeting" | "document" | "outreach" | "action" | "watchlist";

interface TimelineEvent {
  id: string;
  companyId: string;
  type: ActivityType;
  title: string;
  description: string;
  user: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

const typeConfig: Record<ActivityType, { label: string; icon: React.ElementType; color: string }> = {
  stage_change: { label: "Stage Change", icon: GitBranch, color: "bg-primary/10 text-primary" },
  note: { label: "Note", icon: StickyNote, color: "bg-chart-3/10 text-chart-3" },
  meeting: { label: "Meeting", icon: Users, color: "bg-chart-4/10 text-chart-4" },
  document: { label: "Document", icon: FileText, color: "bg-success/10 text-success" },
  outreach: { label: "Outreach", icon: Mail, color: "bg-chart-5/10 text-chart-5" },
  action: { label: "Action Item", icon: CheckCircle2, color: "bg-chart-2/10 text-chart-2" },
  watchlist: { label: "Watchlist", icon: Eye, color: "bg-accent text-accent-foreground" },
};

const mockTimeline: TimelineEvent[] = [
  { id: "t1", companyId: "1", type: "stage_change", title: "Moved to Recommended", description: "TechNova Solutions added to recommended companies based on mandate criteria match", user: "System", timestamp: "2026-03-07T14:30:00", metadata: { from: "New", to: "Recommended" } },
  { id: "t2", companyId: "4", type: "note", title: "Note added", description: "AI team is exceptional. Founder open to acquisition conversation.", user: "Mike Chen", timestamp: "2026-03-07T11:15:00" },
  { id: "t3", companyId: "1", type: "meeting", title: "Management presentation scheduled", description: "Introductory call with CEO Sarah Chen and CTO Raj Patel", user: "John Smith", timestamp: "2026-03-07T09:00:00", metadata: { date: "2026-03-12", attendees: "Sarah Chen, Raj Patel" } },
  { id: "t4", companyId: "4", type: "stage_change", title: "Moved to Shortlisted", description: "NeuralEdge AI promoted from Pipeline to Shortlisted after positive initial review", user: "Sarah Johnson", timestamp: "2026-03-06T16:45:00", metadata: { from: "Pipeline", to: "Shortlisted" } },
  { id: "t5", companyId: "3", type: "outreach", title: "Initial outreach sent", description: "Introduction email sent to Michael Torres, CEO of CloudBridge Systems", user: "John Smith", timestamp: "2026-03-06T14:20:00" },
  { id: "t6", companyId: "1", type: "document", title: "Financial review completed", description: "Audited financial statements for FY2025 reviewed and filed", user: "Sarah Johnson", timestamp: "2026-03-06T11:30:00", metadata: { document: "TechNova_Financials_FY2025.pdf" } },
  { id: "t7", companyId: "5", type: "note", title: "Note added", description: "Regulatory landscape in APAC needs further diligence before proceeding", user: "Sarah Johnson", timestamp: "2026-03-06T10:00:00" },
  { id: "t8", companyId: "4", type: "action", title: "Action item created", description: "Prepare term sheet draft for NeuralEdge AI acquisition", user: "Mike Chen", timestamp: "2026-03-05T15:30:00", metadata: { assignee: "Mike Chen", dueDate: "2026-03-15" } },
  { id: "t9", companyId: "7", type: "watchlist", title: "Added to watchlist", description: "GreenStack Energy added to watchlist for Growth and Funding monitoring", user: "John Smith", timestamp: "2026-03-05T12:00:00" },
  { id: "t10", companyId: "1", type: "note", title: "Note added", description: "Strong cloud capabilities, good cultural fit. Schedule deep-dive with CTO.", user: "John Smith", timestamp: "2026-03-05T09:45:00" },
  { id: "t11", companyId: "3", type: "stage_change", title: "Moved to Pipeline", description: "CloudBridge Systems moved from Recommended to Pipeline after initial screening", user: "John Smith", timestamp: "2026-03-04T16:00:00", metadata: { from: "Recommended", to: "Pipeline" } },
  { id: "t12", companyId: "6", type: "meeting", title: "Due diligence call", description: "Technical deep-dive with CyberShield Corp engineering team", user: "Mike Chen", timestamp: "2026-03-04T14:00:00", metadata: { attendees: "David Katz, Emily Rodriguez" } },
  { id: "t13", companyId: "2", type: "action", title: "Action item created", description: "Coordinate technical due diligence for DataPulse Analytics", user: "Mike Chen", timestamp: "2026-03-04T10:30:00", metadata: { assignee: "Mike Chen", dueDate: "2026-03-14" } },
  { id: "t14", companyId: "8", type: "stage_change", title: "Moved to Declined", description: "HealthSync Digital declined — stagnation concerns and low M&A score", user: "Sarah Johnson", timestamp: "2026-03-03T15:20:00", metadata: { from: "Pipeline", to: "Declined" } },
  { id: "t15", companyId: "5", type: "outreach", title: "Follow-up call", description: "Second call with Wei Lin, CEO of FinCore Technologies regarding APAC expansion", user: "John Smith", timestamp: "2026-03-03T11:00:00" },
  { id: "t16", companyId: "7", type: "document", title: "Investment memo drafted", description: "Initial investment memo created for GreenStack Energy based on CleanTech thesis", user: "Sarah Johnson", timestamp: "2026-03-02T16:30:00", metadata: { document: "GreenStack_InvestmentMemo_Draft.pdf" } },
];

const formatDate = (ts: string) => {
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const formatTime = (ts: string) => {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const groupByDate = (events: TimelineEvent[]) => {
  const groups: Record<string, TimelineEvent[]> = {};
  events.forEach((e) => {
    const date = formatDate(e.timestamp);
    if (!groups[date]) groups[date] = [];
    groups[date].push(e);
  });
  return Object.entries(groups);
};

const ActivityTimeline = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [companyFilter, setCompanyFilter] = useState<string>("all");

  const filteredEvents = mockTimeline.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || e.type === typeFilter;
    const matchesCompany = companyFilter === "all" || e.companyId === companyFilter;
    return matchesSearch && matchesType && matchesCompany;
  });

  const grouped = groupByDate(filteredEvents);

  // Activity type counts for filters
  const typeCounts = Object.keys(typeConfig).reduce((acc, type) => {
    acc[type] = mockTimeline.filter((e) => e.type === type).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Activity Timeline</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Chronological log of all deal activities across your pipeline
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search activities..."
            className="pl-8 h-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44 h-9">
            <Filter className="h-3.5 w-3.5 mr-1.5" />
            <SelectValue placeholder="Activity type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activities</SelectItem>
            {Object.entries(typeConfig).map(([key, config]) => (
              <SelectItem key={key} value={key}>
                {config.label} ({typeCounts[key] || 0})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={companyFilter} onValueChange={setCompanyFilter}>
          <SelectTrigger className="w-52 h-9">
            <SelectValue placeholder="All companies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {companies.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.logo} {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Activity type pills */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={typeFilter === "all" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => setTypeFilter("all")}
        >
          All ({mockTimeline.length})
        </Badge>
        {Object.entries(typeConfig).map(([key, config]) => (
          <Badge
            key={key}
            variant={typeFilter === key ? "default" : "outline"}
            className={`cursor-pointer ${typeFilter === key ? "" : config.color}`}
            onClick={() => setTypeFilter(typeFilter === key ? "all" : key)}
          >
            {config.label} ({typeCounts[key] || 0})
          </Badge>
        ))}
      </div>

      {/* Timeline */}
      {grouped.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            No activities found matching your filters.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {grouped.map(([date, events]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-muted-foreground">{date}</span>
                <div className="flex-1 border-t border-border" />
              </div>
              <div className="space-y-0 ml-2">
                {events.map((event, i) => {
                  const config = typeConfig[event.type];
                  const Icon = config.icon;
                  const company = companies.find((c) => c.id === event.companyId);
                  return (
                    <div key={event.id} className="flex gap-4">
                      {/* Timeline line */}
                      <div className="flex flex-col items-center">
                        <div className={`p-1.5 rounded-full ${config.color}`}>
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        {i < events.length - 1 && (
                          <div className="w-px flex-1 bg-border my-1" />
                        )}
                      </div>
                      {/* Content */}
                      <Card className="flex-1 mb-3">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                <Badge className={`${config.color} border-0 text-[10px]`}>{config.label}</Badge>
                                <button
                                  className="flex items-center gap-1 text-xs hover:text-primary transition-colors"
                                  onClick={() => company && navigate(`/companies/${company.id}`)}
                                >
                                  <span>{company?.logo}</span>
                                  <span className="font-medium">{company?.name}</span>
                                </button>
                              </div>
                              <p className="text-sm font-medium">{event.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                              {/* Metadata */}
                              {event.type === "stage_change" && event.metadata && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline" className="text-[10px]">{event.metadata.from}</Badge>
                                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                  <Badge variant="secondary" className="text-[10px]">{event.metadata.to}</Badge>
                                </div>
                              )}
                              {event.type === "meeting" && event.metadata && (
                                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                                  {event.metadata.date && (
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" /> {event.metadata.date}
                                    </span>
                                  )}
                                  {event.metadata.attendees && (
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" /> {event.metadata.attendees}
                                    </span>
                                  )}
                                </div>
                              )}
                              {event.type === "action" && event.metadata && (
                                <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                                  <span>Assigned: {event.metadata.assignee}</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> Due: {event.metadata.dueDate}
                                  </span>
                                </div>
                              )}
                              {event.type === "document" && event.metadata && (
                                <div className="flex items-center gap-1 mt-2 text-[10px] text-primary">
                                  <FileText className="h-3 w-3" /> {event.metadata.document}
                                </div>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[10px] text-muted-foreground">{formatTime(event.timestamp)}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{event.user}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;
