import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mandates, companies } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Edit, Download, Search, ArrowLeft, GitBranch, Star, XCircle, Eye,
  Clock, FileText, Users, StickyNote, CheckCircle2, Settings,
  ArrowRight, Calendar, Mail, Target,
} from "lucide-react";

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

// Generate mandate-specific timeline based on mandate id
const getMandateTimeline = (mandateId: string): MandateActivity[] => {
  const timelines: Record<string, MandateActivity[]> = {
    "1": [
      { id: "m1-1", type: "document", title: "Investment memo drafted", description: "Initial investment memo created for top 5 matching companies", user: "Sarah Johnson", timestamp: "2026-03-07T15:00:00" },
      { id: "m1-2", type: "company_moved", title: "TechNova moved to Pipeline", description: "TechNova Solutions promoted from Recommended to Pipeline after initial screening call", user: "John Smith", timestamp: "2026-03-07T11:30:00", metadata: { company: "TechNova Solutions", from: "Recommended", to: "Pipeline" } },
      { id: "m1-3", type: "meeting", title: "Screening call with DataPulse", description: "30-min introductory call with DataPulse Analytics CEO James Wright", user: "John Smith", timestamp: "2026-03-06T14:00:00", metadata: { company: "DataPulse Analytics" } },
      { id: "m1-4", type: "note", title: "Financial review note", description: "TechNova financials reviewed — healthy margins at 22%, low churn rate of 3.5%. Strong candidate for revenue acquisition.", user: "Sarah Johnson", timestamp: "2026-03-05T16:30:00", metadata: { company: "TechNova Solutions" } },
      { id: "m1-5", type: "company_added", title: "3 new companies matched", description: "Algorithm identified 3 new companies matching updated criteria: CloudBridge Systems, DataPulse Analytics, HealthSync Digital", user: "System", timestamp: "2026-03-05T09:00:00" },
      { id: "m1-6", type: "criteria_update", title: "Added Snowflake to partners", description: "Snowflake added as required technology partner to refine matching criteria", user: "John Smith", timestamp: "2026-03-04T10:15:00" },
      { id: "m1-7", type: "outreach", title: "Outreach to TechNova CEO", description: "Introduction email sent to Sarah Chen, CEO of TechNova Solutions", user: "John Smith", timestamp: "2026-03-03T11:00:00", metadata: { company: "TechNova Solutions" } },
      { id: "m1-8", type: "criteria_update", title: "Revenue range updated", description: "Estimated revenue range changed from $5M-$30M to $10M-$50M based on board feedback", user: "Sarah Johnson", timestamp: "2026-03-01T14:20:00" },
      { id: "m1-9", type: "company_added", title: "Initial matching completed", description: "156 companies identified matching mandate criteria from universe of 12,500", user: "System", timestamp: "2026-02-16T08:00:00" },
      { id: "m1-10", type: "created", title: "Mandate created", description: "Cloud & Data Analytics Acquisition mandate created with initial criteria targeting North America and Europe", user: "John Smith", timestamp: "2026-02-15T09:30:00" },
    ],
    "2": [
      { id: "m2-1", type: "company_moved", title: "NeuralEdge AI shortlisted", description: "NeuralEdge AI moved to Shortlisted after exceptional technical assessment", user: "Sarah Johnson", timestamp: "2026-03-06T16:45:00", metadata: { company: "NeuralEdge AI", from: "Pipeline", to: "Shortlisted" } },
      { id: "m2-2", type: "document", title: "Term sheet draft prepared", description: "Initial term sheet drafted for NeuralEdge AI acquisition", user: "Mike Chen", timestamp: "2026-03-05T15:30:00", metadata: { company: "NeuralEdge AI" } },
      { id: "m2-3", type: "meeting", title: "Technical deep-dive with NeuralEdge", description: "3-hour technical assessment with NeuralEdge AI engineering team — ML pipeline and model quality evaluated", user: "Mike Chen", timestamp: "2026-03-04T10:00:00", metadata: { company: "NeuralEdge AI" } },
      { id: "m2-4", type: "note", title: "AI team assessment", description: "NeuralEdge AI team is exceptional — 40 ML engineers with strong publication record. Founder open to acquisition conversation.", user: "Mike Chen", timestamp: "2026-03-03T14:00:00", metadata: { company: "NeuralEdge AI" } },
      { id: "m2-5", type: "outreach", title: "Contacted NeuralEdge CEO", description: "Initial outreach to Dr. Anna Müller regarding potential team acquisition", user: "John Smith", timestamp: "2026-02-28T11:30:00", metadata: { company: "NeuralEdge AI" } },
      { id: "m2-6", type: "criteria_update", title: "Added Hugging Face partnership", description: "Hugging Face added as key partner criteria for NLP talent identification", user: "Mike Chen", timestamp: "2026-02-25T09:00:00" },
      { id: "m2-7", type: "company_added", title: "Initial matching completed", description: "89 companies identified matching European AI talent criteria", user: "System", timestamp: "2026-01-21T08:00:00" },
      { id: "m2-8", type: "created", title: "Mandate created", description: "European AI Talent Acqui-hire mandate created targeting ML and CV engineering teams", user: "Mike Chen", timestamp: "2026-01-20T10:00:00" },
    ],
    "3": [
      { id: "m3-1", type: "meeting", title: "Due diligence call with CyberShield", description: "Technical deep-dive with CyberShield Corp engineering team on threat detection platform", user: "Mike Chen", timestamp: "2026-03-04T14:00:00", metadata: { company: "CyberShield Corp" } },
      { id: "m3-2", type: "note", title: "Market analysis complete", description: "Cybersecurity M&A landscape analysis shows 15B+ in deals in 2025. Strong roll-up opportunity.", user: "Sarah Johnson", timestamp: "2026-03-03T10:00:00" },
      { id: "m3-3", type: "outreach", title: "NDA sent to CyberShield", description: "Mutual NDA sent to CyberShield Corp legal team for review", user: "John Smith", timestamp: "2026-02-28T16:00:00", metadata: { company: "CyberShield Corp" } },
      { id: "m3-4", type: "company_added", title: "Initial matching completed", description: "42 cybersecurity companies identified matching roll-up criteria", user: "System", timestamp: "2026-02-02T08:00:00" },
      { id: "m3-5", type: "created", title: "Mandate created", description: "Cybersecurity Platform Roll-up mandate created for comprehensive security platform build-out", user: "Sarah Johnson", timestamp: "2026-02-01T11:00:00" },
    ],
    "4": [
      { id: "m4-1", type: "note", title: "Regulatory landscape review", description: "APAC regulatory landscape needs further diligence — Singapore MAS and Indonesian OJK requirements documented", user: "Sarah Johnson", timestamp: "2026-03-06T10:00:00" },
      { id: "m4-2", type: "outreach", title: "Follow-up with FinCore CEO", description: "Second call with Wei Lin regarding APAC expansion strategy and potential acquisition interest", user: "John Smith", timestamp: "2026-03-03T11:00:00", metadata: { company: "FinCore Technologies" } },
      { id: "m4-3", type: "company_added", title: "Initial matching completed", description: "67 APAC fintech companies identified matching geographic expansion criteria", user: "System", timestamp: "2026-03-02T08:00:00" },
      { id: "m4-4", type: "created", title: "Mandate created", description: "APAC Fintech Expansion mandate created targeting payment and compliance technology in Asia-Pacific", user: "John Smith", timestamp: "2026-03-01T09:00:00" },
    ],
  };
  return timelines[mandateId] || [];
};

const formatDate = (ts: string) => new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
const formatTime = (ts: string) => new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

const groupByDate = (events: MandateActivity[]) => {
  const groups: Record<string, MandateActivity[]> = {};
  events.forEach((e) => {
    const date = formatDate(e.timestamp);
    if (!groups[date]) groups[date] = [];
    groups[date].push(e);
  });
  return Object.entries(groups);
};

const MandateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mandate = mandates.find((m) => m.id === id);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [mainTab, setMainTab] = useState("companies");

  if (!mandate) {
    return (
      <div className="p-6">
        <p>Mandate not found.</p>
        <Button variant="ghost" onClick={() => navigate("/mandates")}>Back</Button>
      </div>
    );
  }

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "pipeline") return matchesSearch && c.status === "pipeline";
    if (activeTab === "shortlisted") return matchesSearch && c.status === "shortlisted";
    if (activeTab === "declined") return matchesSearch && c.status === "declined";
    return matchesSearch;
  });

  const filterSections = [
    { label: "Capabilities", items: mandate.capabilities },
    { label: "Partners", items: mandate.partners },
    { label: "Verticals", items: mandate.verticals },
    { label: "Revenue Geo", items: mandate.revenueGeo },
    { label: "Delivery Geo", items: mandate.deliveryGeo },
  ];

  const timeline = getMandateTimeline(mandate.id);
  const grouped = groupByDate(timeline);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/mandates")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{mandate.title}</h1>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant="secondary">{mandate.strategy}</Badge>
            <span className="text-sm text-muted-foreground">
              Created {mandate.createdAt} · Updated {mandate.updatedAt}
            </span>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">{mandate.description}</p>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {filterSections.map((section) => (
          <Card key={section.label}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground">{section.label}</span>
                <Button variant="ghost" size="sm" className="h-6 px-1.5">
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {section.items.map((item) => (
                  <Badge key={item} variant="outline" className="text-[10px]">{item}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional filters */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3">
            <span className="text-xs font-medium text-muted-foreground">People Scale</span>
            <p className="text-sm font-medium mt-1">{mandate.peopleScale}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <span className="text-xs font-medium text-muted-foreground">Est. Revenue</span>
            <p className="text-sm font-medium mt-1">{mandate.estRevenue}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3">
            <span className="text-xs font-medium text-muted-foreground">Go-to-Market</span>
            <p className="text-sm font-medium mt-1">{mandate.goToMarket}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs: Companies + Activity Timeline */}
      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList>
          <TabsTrigger value="companies">
            <Users className="h-3.5 w-3.5 mr-1.5" /> Companies
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Clock className="h-3.5 w-3.5 mr-1.5" /> Activity Timeline
            <Badge variant="secondary" className="ml-1.5 text-[10px] px-1.5">{timeline.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Companies Tab */}
        <TabsContent value="companies">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Company Recommendations</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Search companies..."
                      className="pl-8 h-8 w-48 text-sm"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-3.5 w-3.5 mr-1" /> Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All ({companies.length})</TabsTrigger>
                  <TabsTrigger value="pipeline">Pipeline ({companies.filter(c => c.status === 'pipeline').length})</TabsTrigger>
                  <TabsTrigger value="shortlisted">Shortlisted ({companies.filter(c => c.status === 'shortlisted').length})</TabsTrigger>
                  <TabsTrigger value="declined">Declined ({companies.filter(c => c.status === 'declined').length})</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead className="hidden md:table-cell">HQ</TableHead>
                        <TableHead className="hidden lg:table-cell">Capabilities</TableHead>
                        <TableHead className="hidden lg:table-cell">Partners</TableHead>
                        <TableHead className="hidden md:table-cell">People</TableHead>
                        <TableHead className="hidden md:table-cell">Revenue</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCompanies.map((c) => (
                        <TableRow key={c.id}>
                          <TableCell>
                            <button
                              className="flex items-center gap-2 hover:text-primary"
                              onClick={() => navigate(`/companies/${c.id}`)}
                            >
                              <span className="text-lg">{c.logo}</span>
                              <span className="font-medium text-sm">{c.name}</span>
                            </button>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs">{c.hq}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {c.capabilities.slice(0, 2).map((cap) => (
                                <Badge key={cap} variant="outline" className="text-[10px]">{cap}</Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {c.partners.slice(0, 2).map((p) => (
                                <Badge key={p} variant="outline" className="text-[10px]">{p}</Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs">{c.people}</TableCell>
                          <TableCell className="hidden md:table-cell text-xs">{c.revenue}</TableCell>
                          <TableCell>
                            <Badge className="bg-success/10 text-success border-0">{c.maScore}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7" title="Pipeline">
                                <GitBranch className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" title="Shortlist">
                                <Star className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" title="Decline">
                                <XCircle className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7" title="View">
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Timeline Tab */}
        <TabsContent value="timeline">
          {grouped.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-sm text-muted-foreground">
                No activity recorded for this mandate yet.
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6 mt-2">
              {grouped.map(([date, events]) => (
                <div key={date}>
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-muted-foreground">{date}</span>
                    <div className="flex-1 border-t border-border" />
                  </div>
                  <div className="space-y-0 ml-2">
                    {events.map((event, i) => {
                      const config = activityTypeConfig[event.type];
                      const Icon = config.icon;
                      return (
                        <div key={event.id} className="flex gap-4">
                          {/* Timeline connector */}
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
                                    {event.metadata?.company && (
                                      <span className="text-xs text-muted-foreground">
                                        · {event.metadata.company}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm font-medium">{event.title}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">{event.description}</p>
                                  {/* Stage change metadata */}
                                  {event.type === "company_moved" && event.metadata && (
                                    <div className="flex items-center gap-2 mt-2">
                                      <Badge variant="outline" className="text-[10px]">{event.metadata.from}</Badge>
                                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                      <Badge variant="secondary" className="text-[10px]">{event.metadata.to}</Badge>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MandateDetail;
