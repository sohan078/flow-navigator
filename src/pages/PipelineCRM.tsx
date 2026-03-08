import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { companies, type Company } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search, Eye, MoreHorizontal, StickyNote, CheckCircle2,
  Clock, ArrowRight, Users, Star, XCircle, GitBranch, Filter,
} from "lucide-react";

type Stage = "pipeline" | "shortlisted" | "declined" | "recommended";

interface Note {
  id: string;
  companyId: string;
  text: string;
  author: string;
  createdAt: string;
}

interface ActionItem {
  id: string;
  companyId: string;
  text: string;
  assignee: string;
  dueDate: string;
  completed: boolean;
}

const initialNotes: Note[] = [
  { id: "n1", companyId: "1", text: "Strong cloud capabilities, good cultural fit. Schedule deep-dive with CTO.", author: "John Smith", createdAt: "2026-03-06" },
  { id: "n2", companyId: "1", text: "Financials reviewed — healthy margins, low churn.", author: "Sarah Johnson", createdAt: "2026-03-05" },
  { id: "n3", companyId: "4", text: "AI team is exceptional. Founder open to acquisition conversation.", author: "Mike Chen", createdAt: "2026-03-07" },
  { id: "n4", companyId: "3", text: "Initial outreach completed, awaiting response from CEO.", author: "John Smith", createdAt: "2026-03-04" },
  { id: "n5", companyId: "5", text: "Regulatory landscape in APAC needs further diligence.", author: "Sarah Johnson", createdAt: "2026-03-06" },
];

const initialActions: ActionItem[] = [
  { id: "a1", companyId: "1", text: "Schedule management presentation", assignee: "John Smith", dueDate: "2026-03-12", completed: false },
  { id: "a2", companyId: "1", text: "Request audited financial statements", assignee: "Sarah Johnson", dueDate: "2026-03-10", completed: true },
  { id: "a3", companyId: "4", text: "Prepare term sheet draft", assignee: "Mike Chen", dueDate: "2026-03-15", completed: false },
  { id: "a4", companyId: "3", text: "Send NDA for review", assignee: "John Smith", dueDate: "2026-03-09", completed: false },
  { id: "a5", companyId: "5", text: "Complete regulatory compliance review", assignee: "Sarah Johnson", dueDate: "2026-03-18", completed: false },
  { id: "a6", companyId: "2", text: "Coordinate technical due diligence", assignee: "Mike Chen", dueDate: "2026-03-14", completed: false },
];

const stageConfig: Record<Stage, { label: string; color: string; icon: React.ElementType }> = {
  recommended: { label: "Recommended", color: "bg-primary/10 text-primary", icon: Star },
  pipeline: { label: "Pipeline", color: "bg-chart-3/10 text-chart-3", icon: GitBranch },
  shortlisted: { label: "Shortlisted", color: "bg-success/10 text-success", icon: CheckCircle2 },
  declined: { label: "Declined", color: "bg-destructive/10 text-destructive", icon: XCircle },
};

const PipelineCRM = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeStage, setActiveStage] = useState<string>("all");
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [actions, setActions] = useState<ActionItem[]>(initialActions);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [newAction, setNewAction] = useState({ text: "", assignee: "", dueDate: "" });

  const stages: Stage[] = ["recommended", "pipeline", "shortlisted", "declined"];

  const stageCounts = stages.reduce((acc, stage) => {
    acc[stage] = companies.filter((c) => c.status === stage).length;
    return acc;
  }, {} as Record<Stage, number>);

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    if (activeStage === "all") return matchesSearch;
    return matchesSearch && c.status === activeStage;
  });

  const getCompanyNotes = (companyId: string) => notes.filter((n) => n.companyId === companyId);
  const getCompanyActions = (companyId: string) => actions.filter((a) => a.companyId === companyId);

  const handleAddNote = () => {
    if (!selectedCompany || !newNote.trim()) return;
    setNotes([
      ...notes,
      { id: `n${Date.now()}`, companyId: selectedCompany.id, text: newNote, author: "You", createdAt: new Date().toISOString().split("T")[0] },
    ]);
    setNewNote("");
    setNoteDialogOpen(false);
  };

  const handleAddAction = () => {
    if (!selectedCompany || !newAction.text.trim()) return;
    setActions([
      ...actions,
      { id: `a${Date.now()}`, companyId: selectedCompany.id, ...newAction, completed: false },
    ]);
    setNewAction({ text: "", assignee: "", dueDate: "" });
    setActionDialogOpen(false);
  };

  const toggleAction = (actionId: string) => {
    setActions(actions.map((a) => (a.id === actionId ? { ...a, completed: !a.completed } : a)));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pipeline / CRM</h1>
          <p className="text-sm text-muted-foreground mt-1">Track companies through your acquisition funnel</p>
        </div>
      </div>

      {/* Funnel Stage Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stages.map((stage, i) => {
          const config = stageConfig[stage];
          const Icon = config.icon;
          return (
            <Card
              key={stage}
              className={`cursor-pointer transition-all hover:shadow-md ${activeStage === stage ? "ring-2 ring-primary" : ""}`}
              onClick={() => setActiveStage(activeStage === stage ? "all" : stage)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${config.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {i < stages.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />
                  )}
                </div>
                <p className="text-2xl font-bold">{stageCounts[stage]}</p>
                <p className="text-xs text-muted-foreground">{config.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Funnel Visualization */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Acquisition Funnel</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-1">
            {stages.map((stage, i) => {
              const config = stageConfig[stage];
              const total = companies.length;
              const count = stageCounts[stage];
              const widthPct = Math.max(20, ((stages.length - i) / stages.length) * 100);
              return (
                <div
                  key={stage}
                  className={`relative rounded-md flex items-center justify-between px-4 py-2.5 text-sm transition-all ${config.color}`}
                  style={{ width: `${widthPct}%` }}
                >
                  <span className="font-medium">{config.label}</span>
                  <span className="font-bold">{count}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="companies">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="companies">
              <Users className="h-3.5 w-3.5 mr-1.5" /> Companies
            </TabsTrigger>
            <TabsTrigger value="notes">
              <StickyNote className="h-3.5 w-3.5 mr-1.5" /> Notes
            </TabsTrigger>
            <TabsTrigger value="actions">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Action Items
            </TabsTrigger>
          </TabsList>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8 h-8 w-48 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Companies Tab */}
        <TabsContent value="companies">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead className="hidden md:table-cell">HQ</TableHead>
                    <TableHead className="hidden lg:table-cell">Capabilities</TableHead>
                    <TableHead className="hidden md:table-cell">People</TableHead>
                    <TableHead className="hidden md:table-cell">Revenue</TableHead>
                    <TableHead>M&A Score</TableHead>
                    <TableHead className="hidden lg:table-cell">Notes</TableHead>
                    <TableHead className="hidden lg:table-cell">Actions</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((c) => {
                    const config = stageConfig[c.status];
                    const companyNotes = getCompanyNotes(c.id);
                    const companyActions = getCompanyActions(c.id);
                    const pendingActions = companyActions.filter((a) => !a.completed).length;
                    return (
                      <TableRow key={c.id}>
                        <TableCell>
                          <button
                            className="flex items-center gap-2 hover:text-primary transition-colors"
                            onClick={() => navigate(`/companies/${c.id}`)}
                          >
                            <span className="text-lg">{c.logo}</span>
                            <span className="font-medium text-sm">{c.name}</span>
                          </button>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${config.color} border-0 text-[10px]`}>{config.label}</Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{c.hq}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {c.capabilities.slice(0, 2).map((cap) => (
                              <Badge key={cap} variant="outline" className="text-[10px]">{cap}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs">{c.people}</TableCell>
                        <TableCell className="hidden md:table-cell text-xs">{c.revenue}</TableCell>
                        <TableCell>
                          <Badge className="bg-success/10 text-success border-0">{c.maScore}</Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-xs text-muted-foreground">{companyNotes.length} notes</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {pendingActions > 0 ? (
                            <Badge variant="outline" className="text-[10px] border-chart-3/30 text-chart-3">
                              {pendingActions} pending
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/companies/${c.id}`)}>
                                <Eye className="h-3.5 w-3.5 mr-2" /> View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelectedCompany(c); setNoteDialogOpen(true); }}>
                                <StickyNote className="h-3.5 w-3.5 mr-2" /> Add Note
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelectedCompany(c); setActionDialogOpen(true); }}>
                                <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Add Action
                              </DropdownMenuItem>
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

        {/* Notes Tab */}
        <TabsContent value="notes">
          <div className="grid gap-3">
            {notes.map((note) => {
              const company = companies.find((c) => c.id === note.companyId);
              return (
                <Card key={note.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{company?.logo}</span>
                        <button
                          className="font-medium text-sm hover:text-primary transition-colors"
                          onClick={() => company && navigate(`/companies/${company.id}`)}
                        >
                          {company?.name}
                        </button>
                        <Badge className={`${stageConfig[company?.status as Stage]?.color} border-0 text-[10px]`}>
                          {stageConfig[company?.status as Stage]?.label}
                        </Badge>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{note.createdAt}</span>
                    </div>
                    <p className="text-sm text-foreground">{note.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-2">— {note.author}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Action Items Tab */}
        <TabsContent value="actions">
          <div className="grid gap-3">
            {actions.map((action) => {
              const company = companies.find((c) => c.id === action.companyId);
              const isOverdue = !action.completed && new Date(action.dueDate) < new Date();
              return (
                <Card key={action.id} className={action.completed ? "opacity-60" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <button
                        className={`mt-0.5 rounded-full p-0.5 transition-colors ${action.completed ? "text-success" : "text-muted-foreground hover:text-success"}`}
                        onClick={() => toggleAction(action.id)}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{company?.logo}</span>
                          <button
                            className="font-medium text-sm hover:text-primary transition-colors"
                            onClick={() => company && navigate(`/companies/${company.id}`)}
                          >
                            {company?.name}
                          </button>
                        </div>
                        <p className={`text-sm ${action.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {action.text}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] text-muted-foreground">Assigned: {action.assignee}</span>
                          <span className={`text-[10px] flex items-center gap-1 ${isOverdue ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                            <Clock className="h-3 w-3" /> Due: {action.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Note Dialog */}
      <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Note — {selectedCompany?.name}</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Write your note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddNote}>Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Action — {selectedCompany?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Action item description"
              value={newAction.text}
              onChange={(e) => setNewAction({ ...newAction, text: e.target.value })}
            />
            <Input
              placeholder="Assignee"
              value={newAction.assignee}
              onChange={(e) => setNewAction({ ...newAction, assignee: e.target.value })}
            />
            <Input
              type="date"
              value={newAction.dueDate}
              onChange={(e) => setNewAction({ ...newAction, dueDate: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddAction}>Add Action</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PipelineCRM;
