import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mandates } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus, Trash2, Edit, Filter, Clock, Target, Settings, Users,
  GitBranch, StickyNote, FileText, Mail, ArrowRight, Calendar,
} from "lucide-react";

// --- Mandate activity types & data (shared with MandateDetail) ---
type MandateActivityType = "created" | "criteria_update" | "company_added" | "company_moved" | "note" | "meeting" | "document" | "outreach";

interface MandateActivity {
  id: string;
  type: MandateActivityType;
  title: string;
  description: string;
  user: string;
  timestamp: string;
  metadata?: Record<string, string>;
}

const activityTypeConfig: Record<MandateActivityType, { label: string; icon: React.ElementType; color: string }> = {
  created: { label: "Created", icon: Target, color: "bg-primary/10 text-primary" },
  criteria_update: { label: "Criteria Updated", icon: Settings, color: "bg-chart-3/10 text-chart-3" },
  company_added: { label: "Company Added", icon: Users, color: "bg-success/10 text-success" },
  company_moved: { label: "Stage Change", icon: GitBranch, color: "bg-chart-4/10 text-chart-4" },
  note: { label: "Note", icon: StickyNote, color: "bg-chart-3/10 text-chart-3" },
  meeting: { label: "Meeting", icon: Users, color: "bg-chart-4/10 text-chart-4" },
  document: { label: "Document", icon: FileText, color: "bg-success/10 text-success" },
  outreach: { label: "Outreach", icon: Mail, color: "bg-chart-5/10 text-chart-5" },
};

const getMandateTimeline = (mandateId: string): MandateActivity[] => {
  const timelines: Record<string, MandateActivity[]> = {
    "1": [
      { id: "m1-1", type: "document", title: "Investment memo drafted", description: "Initial investment memo created for top 5 matching companies", user: "Sarah Johnson", timestamp: "2026-03-07T15:00:00" },
      { id: "m1-2", type: "company_moved", title: "TechNova moved to Pipeline", description: "TechNova Solutions promoted from Recommended to Pipeline", user: "John Smith", timestamp: "2026-03-07T11:30:00", metadata: { company: "TechNova Solutions", from: "Recommended", to: "Pipeline" } },
      { id: "m1-3", type: "meeting", title: "Screening call with DataPulse", description: "30-min introductory call with DataPulse Analytics CEO", user: "John Smith", timestamp: "2026-03-06T14:00:00", metadata: { company: "DataPulse Analytics" } },
      { id: "m1-4", type: "note", title: "Financial review note", description: "TechNova financials reviewed — healthy margins at 22%", user: "Sarah Johnson", timestamp: "2026-03-05T16:30:00", metadata: { company: "TechNova Solutions" } },
      { id: "m1-5", type: "company_added", title: "3 new companies matched", description: "Algorithm identified 3 new companies matching updated criteria", user: "System", timestamp: "2026-03-05T09:00:00" },
      { id: "m1-6", type: "criteria_update", title: "Added Snowflake to partners", description: "Snowflake added as required technology partner", user: "John Smith", timestamp: "2026-03-04T10:15:00" },
      { id: "m1-7", type: "outreach", title: "Outreach to TechNova CEO", description: "Introduction email sent to Sarah Chen, CEO", user: "John Smith", timestamp: "2026-03-03T11:00:00", metadata: { company: "TechNova Solutions" } },
      { id: "m1-8", type: "criteria_update", title: "Revenue range updated", description: "Revenue range changed from $5M-$30M to $10M-$50M", user: "Sarah Johnson", timestamp: "2026-03-01T14:20:00" },
      { id: "m1-9", type: "company_added", title: "Initial matching completed", description: "156 companies identified matching mandate criteria", user: "System", timestamp: "2026-02-16T08:00:00" },
      { id: "m1-10", type: "created", title: "Mandate created", description: "Cloud & Data Analytics Acquisition mandate created", user: "John Smith", timestamp: "2026-02-15T09:30:00" },
    ],
    "2": [
      { id: "m2-1", type: "company_moved", title: "NeuralEdge AI shortlisted", description: "NeuralEdge AI moved to Shortlisted after technical assessment", user: "Sarah Johnson", timestamp: "2026-03-06T16:45:00", metadata: { company: "NeuralEdge AI", from: "Pipeline", to: "Shortlisted" } },
      { id: "m2-2", type: "document", title: "Term sheet draft prepared", description: "Initial term sheet drafted for NeuralEdge AI", user: "Mike Chen", timestamp: "2026-03-05T15:30:00", metadata: { company: "NeuralEdge AI" } },
      { id: "m2-3", type: "meeting", title: "Technical deep-dive", description: "3-hour technical assessment with NeuralEdge AI engineering team", user: "Mike Chen", timestamp: "2026-03-04T10:00:00", metadata: { company: "NeuralEdge AI" } },
      { id: "m2-4", type: "note", title: "AI team assessment", description: "Team is exceptional — 40 ML engineers with strong publications", user: "Mike Chen", timestamp: "2026-03-03T14:00:00", metadata: { company: "NeuralEdge AI" } },
      { id: "m2-5", type: "outreach", title: "Contacted NeuralEdge CEO", description: "Initial outreach to Dr. Anna Müller", user: "John Smith", timestamp: "2026-02-28T11:30:00", metadata: { company: "NeuralEdge AI" } },
      { id: "m2-6", type: "criteria_update", title: "Added Hugging Face partnership", description: "Hugging Face added as key partner criteria", user: "Mike Chen", timestamp: "2026-02-25T09:00:00" },
      { id: "m2-7", type: "company_added", title: "Initial matching completed", description: "89 companies identified matching criteria", user: "System", timestamp: "2026-01-21T08:00:00" },
      { id: "m2-8", type: "created", title: "Mandate created", description: "European AI Talent Acqui-hire mandate created", user: "Mike Chen", timestamp: "2026-01-20T10:00:00" },
    ],
    "3": [
      { id: "m3-1", type: "meeting", title: "Due diligence call with CyberShield", description: "Technical deep-dive with CyberShield Corp engineering team", user: "Mike Chen", timestamp: "2026-03-04T14:00:00", metadata: { company: "CyberShield Corp" } },
      { id: "m3-2", type: "note", title: "Market analysis complete", description: "Cybersecurity M&A landscape shows 15B+ in deals in 2025", user: "Sarah Johnson", timestamp: "2026-03-03T10:00:00" },
      { id: "m3-3", type: "outreach", title: "NDA sent to CyberShield", description: "Mutual NDA sent to CyberShield Corp legal team", user: "John Smith", timestamp: "2026-02-28T16:00:00", metadata: { company: "CyberShield Corp" } },
      { id: "m3-4", type: "company_added", title: "Initial matching completed", description: "42 cybersecurity companies identified", user: "System", timestamp: "2026-02-02T08:00:00" },
      { id: "m3-5", type: "created", title: "Mandate created", description: "Cybersecurity Platform Roll-up mandate created", user: "Sarah Johnson", timestamp: "2026-02-01T11:00:00" },
    ],
    "4": [
      { id: "m4-1", type: "note", title: "Regulatory landscape review", description: "APAC regulatory needs further diligence — MAS and OJK requirements", user: "Sarah Johnson", timestamp: "2026-03-06T10:00:00" },
      { id: "m4-2", type: "outreach", title: "Follow-up with FinCore CEO", description: "Second call with Wei Lin regarding expansion strategy", user: "John Smith", timestamp: "2026-03-03T11:00:00", metadata: { company: "FinCore Technologies" } },
      { id: "m4-3", type: "company_added", title: "Initial matching completed", description: "67 APAC fintech companies identified", user: "System", timestamp: "2026-03-02T08:00:00" },
      { id: "m4-4", type: "created", title: "Mandate created", description: "APAC Fintech Expansion mandate created", user: "John Smith", timestamp: "2026-03-01T09:00:00" },
    ],
  };
  return timelines[mandateId] || [];
};

const formatDate = (ts: string) => new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const formatTime = (ts: string) => new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

const timeAgo = (ts: string) => {
  const diff = Date.now() - new Date(ts).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
};

const MandatesDashboard = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [timelineDialog, setTimelineDialog] = useState<string | null>(null);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const funnelSteps = [
    { label: "Total Universe", value: 12500, color: "bg-primary" },
    { label: "Geo Filtered", value: 4200, color: "bg-chart-1" },
    { label: "Vertical Match", value: 1800, color: "bg-chart-2" },
    { label: "Capability Match", value: 680, color: "bg-chart-3" },
    { label: "Revenue Fit", value: 354, color: "bg-chart-4" },
    { label: "Final Matches", value: 156, color: "bg-success" },
  ];

  const selectedMandate = timelineDialog ? mandates.find((m) => m.id === timelineDialog) : null;
  const selectedTimeline = timelineDialog ? getMandateTimeline(timelineDialog) : [];

  // Group timeline by date for dialog
  const groupByDate = (events: MandateActivity[]) => {
    const groups: Record<string, MandateActivity[]> = {};
    events.forEach((e) => {
      const date = formatDate(e.timestamp);
      if (!groups[date]) groups[date] = [];
      groups[date].push(e);
    });
    return Object.entries(groups);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mandates</h1>
          <p className="text-muted-foreground mt-1">Manage your acquisition mandates and criteria</p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-1" /> Delete ({selectedIds.length})
            </Button>
          )}
          <Button onClick={() => navigate("/mandates/create")}>
            <Plus className="h-4 w-4 mr-1" /> Create Mandate
          </Button>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selectedIds.length === mandates.length}
                    onChange={() =>
                      setSelectedIds(
                        selectedIds.length === mandates.length ? [] : mandates.map((m) => m.id)
                      )
                    }
                  />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Strategy</TableHead>
                <TableHead className="hidden lg:table-cell">Capabilities</TableHead>
                <TableHead className="hidden lg:table-cell">Revenue Geo</TableHead>
                <TableHead className="hidden md:table-cell">People</TableHead>
                <TableHead className="hidden md:table-cell">Revenue</TableHead>
                <TableHead>Matches</TableHead>
                <TableHead className="hidden md:table-cell">Last Activity</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mandates.map((m) => {
                const timeline = getMandateTimeline(m.id);
                const latestActivity = timeline[0];
                const latestConfig = latestActivity ? activityTypeConfig[latestActivity.type] : null;
                return (
                  <TableRow
                    key={m.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/mandates/${m.id}`)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        className="rounded"
                        checked={selectedIds.includes(m.id)}
                        onChange={() => toggleSelect(m.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{m.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{m.strategy}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {m.capabilities.slice(0, 2).map((c) => (
                          <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
                        ))}
                        {m.capabilities.length > 2 && (
                          <Badge variant="outline" className="text-[10px]">+{m.capabilities.length - 2}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <span className="text-xs">{m.revenueGeo.join(", ")}</span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs">{m.peopleScale}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs">{m.estRevenue}</TableCell>
                    <TableCell>
                      <Badge className="bg-success/10 text-success border-0">{m.matchingCompanies}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell" onClick={(e) => e.stopPropagation()}>
                      {latestActivity && latestConfig ? (
                        <button
                          className="flex items-center gap-1.5 group text-left"
                          onClick={() => setTimelineDialog(m.id)}
                        >
                          <Badge className={`${latestConfig.color} border-0 text-[10px] shrink-0`}>
                            {latestConfig.label}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground group-hover:text-primary transition-colors truncate max-w-[120px]">
                            {timeAgo(latestActivity.timestamp)}
                          </span>
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          title="View Activity"
                          onClick={() => setTimelineDialog(m.id)}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Funnel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" /> Company Matching Funnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-2 h-48">
            {funnelSteps.map((step) => (
              <div key={step.label} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-sm font-semibold">{step.value.toLocaleString()}</span>
                <div
                  className={`w-full ${step.color} rounded-t-md transition-all`}
                  style={{ height: `${(step.value / funnelSteps[0].value) * 100}%`, minHeight: '20px' }}
                />
                <span className="text-[10px] text-muted-foreground text-center leading-tight">
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline Dialog */}
      <Dialog open={!!timelineDialog} onOpenChange={(open) => !open && setTimelineDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {selectedMandate?.title} — Activity History
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-3 text-xs text-muted-foreground border-b border-border pb-3">
            <span>{selectedTimeline.length} activities</span>
            <span>·</span>
            <span>Created {selectedMandate?.createdAt}</span>
            <span>·</span>
            <Badge variant="secondary" className="text-[10px]">{selectedMandate?.strategy}</Badge>
          </div>
          <div className="overflow-y-auto flex-1 pr-1 -mr-1">
            {groupByDate(selectedTimeline).map(([date, events]) => (
              <div key={date} className="mb-4">
                <div className="flex items-center gap-3 mb-2 sticky top-0 bg-background py-1 z-10">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground">{date}</span>
                  <div className="flex-1 border-t border-border" />
                </div>
                <div className="space-y-0 ml-1">
                  {events.map((event, i) => {
                    const config = activityTypeConfig[event.type];
                    const Icon = config.icon;
                    return (
                      <div key={event.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`p-1 rounded-full ${config.color}`}>
                            <Icon className="h-3 w-3" />
                          </div>
                          {i < events.length - 1 && (
                            <div className="w-px flex-1 bg-border my-0.5" />
                          )}
                        </div>
                        <div className="flex-1 pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <Badge className={`${config.color} border-0 text-[9px] px-1.5 py-0`}>{config.label}</Badge>
                                {event.metadata?.company && (
                                  <span className="text-[10px] text-muted-foreground">· {event.metadata.company}</span>
                                )}
                              </div>
                              <p className="text-xs font-medium">{event.title}</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{event.description}</p>
                              {event.type === "company_moved" && event.metadata && (
                                <div className="flex items-center gap-1.5 mt-1">
                                  <Badge variant="outline" className="text-[9px] px-1.5 py-0">{event.metadata.from}</Badge>
                                  <ArrowRight className="h-2.5 w-2.5 text-muted-foreground" />
                                  <Badge variant="secondary" className="text-[9px] px-1.5 py-0">{event.metadata.to}</Badge>
                                </div>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[10px] text-muted-foreground">{formatTime(event.timestamp)}</p>
                              <p className="text-[10px] text-muted-foreground">{event.user}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-3 flex justify-end">
            <Button size="sm" variant="outline" onClick={() => { setTimelineDialog(null); navigate(`/mandates/${timelineDialog}`); }}>
              View Full Mandate <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MandatesDashboard;
