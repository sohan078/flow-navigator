import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { toast } from "@/hooks/use-toast";
import {
  listMandates, deleteMandates, listMandateActivities,
  type MandateRecord, type MandateActivityRecord, type MandateActivityType,
} from "@/lib/api/mandates";

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
  const [mandates, setMandates] = useState<MandateRecord[]>([]);
  const [latestByMandate, setLatestByMandate] = useState<Record<string, MandateActivityRecord | undefined>>({});
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [timelineDialog, setTimelineDialog] = useState<string | null>(null);
  const [dialogActivities, setDialogActivities] = useState<MandateActivityRecord[]>([]);

  const refresh = async () => {
    setLoading(true);
    try {
      const list = await listMandates();
      setMandates(list);
      // Fetch latest activity per mandate in parallel.
      const entries = await Promise.all(
        list.map(async (m) => {
          const acts = await listMandateActivities(m.id);
          return [m.id, acts[0]] as const;
        })
      );
      setLatestByMandate(Object.fromEntries(entries));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to load mandates";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  useEffect(() => {
    if (!timelineDialog) return;
    listMandateActivities(timelineDialog).then(setDialogActivities).catch(() => setDialogActivities([]));
  }, [timelineDialog]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Delete ${selectedIds.length} mandate(s)? This cannot be undone.`)) return;
    try {
      await deleteMandates(selectedIds);
      toast({ title: "Deleted", description: `${selectedIds.length} mandate(s) removed.` });
      setSelectedIds([]);
      refresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Delete failed";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  };

  const funnelSteps = useMemo(() => {
    const totalMatches = mandates.reduce((sum, m) => sum + (m.matching_companies || 0), 0);
    return [
      { label: "Total Universe", value: 12500, color: "bg-primary" },
      { label: "Geo Filtered", value: 4200, color: "bg-chart-1" },
      { label: "Vertical Match", value: 1800, color: "bg-chart-2" },
      { label: "Capability Match", value: 680, color: "bg-chart-3" },
      { label: "Revenue Fit", value: 354, color: "bg-chart-4" },
      { label: "Final Matches", value: Math.max(totalMatches, 1), color: "bg-success" },
    ];
  }, [mandates]);

  const selectedMandate = timelineDialog ? mandates.find((m) => m.id === timelineDialog) : null;

  const groupByDate = (events: MandateActivityRecord[]) => {
    const groups: Record<string, MandateActivityRecord[]> = {};
    events.forEach((e) => {
      const date = formatDate(e.created_at);
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
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-1" /> Delete ({selectedIds.length})
            </Button>
          )}
          <Button onClick={() => navigate("/mandates/create")}>
            <Plus className="h-4 w-4 mr-1" /> Create Mandate
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={mandates.length > 0 && selectedIds.length === mandates.length}
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
              {loading ? (
                <TableRow><TableCell colSpan={10} className="text-center text-sm text-muted-foreground py-8">Loading…</TableCell></TableRow>
              ) : mandates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-sm text-muted-foreground py-12">
                    No mandates yet. Click <strong>Create Mandate</strong> to add your first one.
                  </TableCell>
                </TableRow>
              ) : mandates.map((m) => {
                const latestActivity = latestByMandate[m.id];
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
                      {m.strategy && <Badge variant="secondary" className="text-xs">{m.strategy}</Badge>}
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
                      <span className="text-xs">{m.revenue_geo.join(", ")}</span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-xs">{m.people_scale}</TableCell>
                    <TableCell className="hidden md:table-cell text-xs">{m.est_revenue}</TableCell>
                    <TableCell>
                      <Badge className="bg-success/10 text-success border-0">{m.matching_companies}</Badge>
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
                            {timeAgo(latestActivity.created_at)}
                          </span>
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost" size="icon" className="h-8 w-8"
                          title="View Activity" onClick={() => setTimelineDialog(m.id)}
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

      <Dialog open={!!timelineDialog} onOpenChange={(open) => !open && setTimelineDialog(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              {selectedMandate?.title} — Activity History
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-3 text-xs text-muted-foreground border-b border-border pb-3">
            <span>{dialogActivities.length} activities</span>
            {selectedMandate && (
              <>
                <span>·</span>
                <span>Created {formatDate(selectedMandate.created_at)}</span>
              </>
            )}
            {selectedMandate?.strategy && (
              <>
                <span>·</span>
                <Badge variant="secondary" className="text-[10px]">{selectedMandate.strategy}</Badge>
              </>
            )}
          </div>
          <div className="overflow-y-auto flex-1 pr-1 -mr-1">
            {dialogActivities.length === 0 ? (
              <div className="text-center text-xs text-muted-foreground py-8">No activity yet.</div>
            ) : groupByDate(dialogActivities).map(([date, events]) => (
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
                          {i < events.length - 1 && <div className="w-px flex-1 bg-border my-0.5" />}
                        </div>
                        <div className="flex-1 pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <Badge className={`${config.color} border-0 text-[9px] px-1.5 py-0`}>{config.label}</Badge>
                              </div>
                              <p className="text-xs font-medium">{event.description}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[10px] text-muted-foreground">{formatTime(event.created_at)}</p>
                              {event.actor_name && <p className="text-[10px] text-muted-foreground">{event.actor_name}</p>}
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
            <Button size="sm" variant="outline" onClick={() => { const id = timelineDialog; setTimelineDialog(null); if (id) navigate(`/mandates/${id}`); }}>
              View Full Mandate <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MandatesDashboard;
