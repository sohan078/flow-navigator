import { useState } from "react";
import { companies, mandates } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Search, FileText, Download, Plus, Copy, Clock, CheckCircle2,
  Send, MoreHorizontal, Eye, Trash2, Package,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Deliverable {
  id: string;
  name: string;
  type: string;
  companyId: string;
  mandateId: string;
  status: "draft" | "in-review" | "approved" | "sent";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  type: string;
  sections: string[];
}

const deliverableStatusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  draft: { label: "Draft", color: "bg-muted text-muted-foreground", icon: FileText },
  "in-review": { label: "In Review", color: "bg-chart-3/10 text-chart-3", icon: Clock },
  approved: { label: "Approved", color: "bg-success/10 text-success", icon: CheckCircle2 },
  sent: { label: "Sent", color: "bg-primary/10 text-primary", icon: Send },
};

const mockDeliverables: Deliverable[] = [
  { id: "del1", name: "TechNova Investment Memo", type: "Investment Memo", companyId: "1", mandateId: "1", status: "in-review", createdBy: "John Smith", createdAt: "2026-03-05", updatedAt: "2026-03-07" },
  { id: "del2", name: "NeuralEdge Teaser Profile", type: "Teaser Profile", companyId: "4", mandateId: "2", status: "approved", createdBy: "Mike Chen", createdAt: "2026-03-04", updatedAt: "2026-03-06" },
  { id: "del3", name: "CyberShield Due Diligence Report", type: "Due Diligence Report", companyId: "6", mandateId: "3", status: "draft", createdBy: "Sarah Johnson", createdAt: "2026-03-06", updatedAt: "2026-03-07" },
  { id: "del4", name: "DataPulse Board Presentation", type: "Board Presentation", companyId: "2", mandateId: "1", status: "sent", createdBy: "John Smith", createdAt: "2026-02-25", updatedAt: "2026-02-28" },
  { id: "del5", name: "FinCore Valuation Model", type: "Valuation Model", companyId: "5", mandateId: "4", status: "draft", createdBy: "Sarah Johnson", createdAt: "2026-03-07", updatedAt: "2026-03-07" },
  { id: "del6", name: "GreenStack Company Profile", type: "Company Profile", companyId: "7", mandateId: "1", status: "in-review", createdBy: "Mike Chen", createdAt: "2026-03-03", updatedAt: "2026-03-06" },
  { id: "del7", name: "CloudBridge Synergy Analysis", type: "Synergy Analysis", companyId: "3", mandateId: "1", status: "approved", createdBy: "John Smith", createdAt: "2026-03-01", updatedAt: "2026-03-05" },
];

const mockTemplates: Template[] = [
  { id: "t1", name: "Investment Memo", description: "Comprehensive investment memo for board review and approval", type: "Document", sections: ["Executive Summary", "Company Overview", "Market Analysis", "Financial Analysis", "Valuation", "Risk Factors", "Recommendation"] },
  { id: "t2", name: "Teaser Profile", description: "One-page company teaser for initial stakeholder review", type: "Document", sections: ["Company Snapshot", "Key Metrics", "Strategic Fit", "Next Steps"] },
  { id: "t3", name: "Due Diligence Report", description: "Detailed due diligence findings across all workstreams", type: "Document", sections: ["Financial DD", "Legal DD", "Technical DD", "Commercial DD", "HR & Culture", "Summary & Findings"] },
  { id: "t4", name: "Board Presentation", description: "Executive presentation for board meetings on acquisition targets", type: "Presentation", sections: ["Agenda", "Deal Overview", "Strategic Rationale", "Financials", "Integration Plan", "Timeline", "Appendix"] },
  { id: "t5", name: "Valuation Model", description: "DCF and comparable analysis valuation template", type: "Spreadsheet", sections: ["Assumptions", "DCF Analysis", "Comparable Companies", "Precedent Transactions", "Summary Valuation"] },
  { id: "t6", name: "Synergy Analysis", description: "Revenue and cost synergy estimation framework", type: "Spreadsheet", sections: ["Revenue Synergies", "Cost Synergies", "Integration Costs", "Net Synergy Value", "Timeline"] },
];

const Deliverables = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const filteredDeliverables = mockDeliverables.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = Object.keys(deliverableStatusConfig).reduce((acc, status) => {
    acc[status] = mockDeliverables.filter((d) => d.status === status).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Deliverables</h1>
          <p className="text-sm text-muted-foreground mt-1">Create, manage, and share acquisition deliverables from templates</p>
        </div>
        <Button size="sm" onClick={() => setTemplateDialogOpen(true)}>
          <Plus className="h-3.5 w-3.5 mr-1.5" /> New Deliverable
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(deliverableStatusConfig).map(([status, config]) => {
          const Icon = config.icon;
          return (
            <Card
              key={status}
              className={`cursor-pointer transition-all hover:shadow-md ${statusFilter === status ? "ring-2 ring-primary" : ""}`}
              onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
            >
              <CardContent className="p-4">
                <div className={`inline-flex p-2 rounded-lg mb-2 ${config.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-2xl font-bold">{statusCounts[status]}</p>
                <p className="text-xs text-muted-foreground">{config.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="deliverables">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="deliverables">
              <Package className="h-3.5 w-3.5 mr-1.5" /> Deliverables
            </TabsTrigger>
            <TabsTrigger value="templates">
              <Copy className="h-3.5 w-3.5 mr-1.5" /> Templates
            </TabsTrigger>
          </TabsList>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8 h-8 w-48 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Deliverables Tab */}
        <TabsContent value="deliverables">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deliverable</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead>
                    <TableHead className="hidden md:table-cell">Created By</TableHead>
                    <TableHead className="hidden lg:table-cell">Updated</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeliverables.map((del) => {
                    const company = companies.find((c) => c.id === del.companyId);
                    const config = deliverableStatusConfig[del.status];
                    return (
                      <TableRow key={del.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{del.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">{del.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs">{company?.logo} {company?.name}</span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge className={`${config.color} border-0 text-[10px]`}>{config.label}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{del.createdBy}</TableCell>
                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">{del.updatedAt}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem><Eye className="h-3.5 w-3.5 mr-2" /> View</DropdownMenuItem>
                              <DropdownMenuItem><Download className="h-3.5 w-3.5 mr-2" /> Download</DropdownMenuItem>
                              <DropdownMenuItem><Send className="h-3.5 w-3.5 mr-2" /> Send</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive"><Trash2 className="h-3.5 w-3.5 mr-2" /> Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-all">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="text-sm font-semibold">{template.name}</h3>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{template.type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.sections.slice(0, 4).map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                    ))}
                    {template.sections.length > 4 && (
                      <Badge variant="secondary" className="text-[10px]">+{template.sections.length - 4}</Badge>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <Copy className="h-3.5 w-3.5 mr-1.5" /> Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* New Deliverable from Template Dialog */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New Deliverable</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Deliverable name" />
            <div className="grid grid-cols-2 gap-2">
              {mockTemplates.map((t) => (
                <button
                  key={t.id}
                  className="p-3 rounded-lg border text-left hover:bg-accent transition-colors text-sm"
                  onClick={() => { setTemplateDialogOpen(false); setSelectedTemplate(t); }}
                >
                  <p className="font-medium text-xs">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{t.type}</p>
                </button>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setTemplateDialogOpen(false)}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Preview Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTemplate?.name}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{selectedTemplate?.description}</p>
          <div className="space-y-2 mt-2">
            <p className="text-xs font-medium text-muted-foreground">Sections:</p>
            {selectedTemplate?.sections.map((section, i) => (
              <div key={section} className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                <span className="text-xs font-medium text-muted-foreground w-5">{i + 1}.</span>
                <span className="text-sm">{section}</span>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTemplate(null)}>Close</Button>
            <Button onClick={() => setSelectedTemplate(null)}>
              <Copy className="h-3.5 w-3.5 mr-1.5" /> Create from Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Deliverables;
