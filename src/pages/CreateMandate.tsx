import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { strategies, allCapabilities, allPartners, allVerticals, allGeos } from "@/data/mockData";
import { createMandate } from "@/lib/api/mandates";
import { listCompanies, matchCompanies } from "@/lib/api/companies";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, RotateCcw, Plus, X } from "lucide-react";

const MultiSelect = ({
  label, options, selected, onChange,
}: {
  label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void;
}) => {
  const [search, setSearch] = useState("");
  const filtered = options.filter(
    (o) => o.toLowerCase().includes(search.toLowerCase()) && !selected.includes(o)
  );

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex flex-wrap gap-1 mb-2">
        {selected.map((s) => (
          <Badge key={s} variant="secondary" className="gap-1 pr-1">
            {s}
            <button onClick={() => onChange(selected.filter((x) => x !== s))}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        placeholder={`Search ${label.toLowerCase()}...`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="text-sm"
      />
      {search && filtered.length > 0 && (
        <div className="border rounded-md max-h-32 overflow-y-auto">
          {filtered.slice(0, 8).map((o) => (
            <button
              key={o}
              className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent"
              onClick={() => { onChange([...selected, o]); setSearch(""); }}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CreateMandate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "", strategy: "", capabilities: [] as string[], partners: [] as string[],
    verticals: [] as string[], revenueGeo: [] as string[], deliveryGeo: [] as string[],
    peopleScale: "", estRevenue: "", goToMarket: "", description: "",
  });

  const funnelSteps = [
    { label: "Total", value: 12500 },
    { label: "Strategy", value: form.strategy ? 6200 : 12500 },
    { label: "Capabilities", value: form.capabilities.length ? 3100 : (form.strategy ? 6200 : 12500) },
    { label: "Partners", value: form.partners.length ? 1800 : (form.capabilities.length ? 3100 : (form.strategy ? 6200 : 12500)) },
    { label: "Geo", value: form.revenueGeo.length || form.deliveryGeo.length ? 890 : 1800 },
    { label: "Final", value: form.verticals.length ? 156 : 890 },
  ];

  const [submitting, setSubmitting] = useState(false);

  const reset = () =>
    setForm({ title: "", strategy: "", capabilities: [], partners: [], verticals: [], revenueGeo: [], deliveryGeo: [], peopleScale: "", estRevenue: "", goToMarket: "", description: "" });

  const submit = async () => {
    if (!form.title.trim()) {
      toast({ title: "Title required", description: "Please give the mandate a title.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      // Compute matching companies count from the live catalog.
      const catalog = await listCompanies();
      const matches = matchCompanies(catalog, {
        capabilities: form.capabilities,
        partners: form.partners,
        verticals: form.verticals,
        revenue_geo: form.revenueGeo,
        delivery_geo: form.deliveryGeo,
      });
      await createMandate({
        title: form.title.trim(),
        strategy: form.strategy || null,
        capabilities: form.capabilities,
        partners: form.partners,
        verticals: form.verticals,
        revenue_geo: form.revenueGeo,
        delivery_geo: form.deliveryGeo,
        people_scale: form.peopleScale || null,
        est_revenue: form.estRevenue || null,
        hq: null,
        go_to_market: form.goToMarket || null,
        description: form.description || null,
        matching_companies: matches.length,
      });
      toast({ title: "Mandate created", description: `${matches.length} matching companies found.` });
      navigate("/mandates");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Failed to create mandate";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create New Mandate</h1>
        <p className="text-muted-foreground mt-1">Define your acquisition criteria</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardContent className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Cloud Analytics Acquisition" />
                </div>
                <div className="space-y-2">
                  <Label>Strategic Goal</Label>
                  <Select value={form.strategy} onValueChange={(v) => setForm({ ...form, strategy: v })}>
                    <SelectTrigger><SelectValue placeholder="Select strategy" /></SelectTrigger>
                    <SelectContent>
                      {strategies.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <MultiSelect label="Capabilities" options={allCapabilities} selected={form.capabilities} onChange={(v) => setForm({ ...form, capabilities: v })} />
              <MultiSelect label="Technology Partners" options={allPartners} selected={form.partners} onChange={(v) => setForm({ ...form, partners: v })} />
              <MultiSelect label="Verticals" options={allVerticals} selected={form.verticals} onChange={(v) => setForm({ ...form, verticals: v })} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <MultiSelect label="Revenue Geography" options={allGeos} selected={form.revenueGeo} onChange={(v) => setForm({ ...form, revenueGeo: v })} />
                <MultiSelect label="Delivery Geography" options={allGeos} selected={form.deliveryGeo} onChange={(v) => setForm({ ...form, deliveryGeo: v })} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>People Scale</Label>
                  <Input value={form.peopleScale} onChange={(e) => setForm({ ...form, peopleScale: e.target.value })} placeholder="e.g. 100-500" />
                </div>
                <div className="space-y-2">
                  <Label>Est. Revenue</Label>
                  <Input value={form.estRevenue} onChange={(e) => setForm({ ...form, estRevenue: e.target.value })} placeholder="e.g. $10M-$50M" />
                </div>
                <div className="space-y-2">
                  <Label>Go-to-Market</Label>
                  <Select value={form.goToMarket} onValueChange={(v) => setForm({ ...form, goToMarket: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {["Direct Sales", "Partner-led", "Channel Partners", "Product-led", "Hybrid"].map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the mandate objectives..." rows={3} />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={reset}>
                  <RotateCcw className="h-4 w-4 mr-1" /> Reset Form
                </Button>
                <Button onClick={() => navigate("/mandates")}>
                  <Plus className="h-4 w-4 mr-1" /> Create Mandate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Funnel */}
        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Filter className="h-4 w-4" /> Live Funnel Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {funnelSteps.map((step, i) => (
                  <div key={step.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{step.label}</span>
                      <span className="font-medium">{step.value.toLocaleString()}</span>
                    </div>
                    <div className="h-6 bg-secondary rounded-md overflow-hidden">
                      <div
                        className="h-full bg-primary/70 rounded-md transition-all duration-500"
                        style={{ width: `${(step.value / funnelSteps[0].value) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateMandate;
