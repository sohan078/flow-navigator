import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { companies, type Company } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft, Plus, X, Users, MapPin, Calendar, DollarSign,
  TrendingUp, BarChart3, Zap, Handshake,
} from "lucide-react";

const MAX_COMPARE = 3;

const scoreLabels: Record<string, { label: string; icon: React.ElementType }> = {
  founderLiquidity: { label: "Founder Liquidity", icon: DollarSign },
  stagnation: { label: "Stagnation Risk", icon: BarChart3 },
  activity: { label: "Activity", icon: Zap },
  partnerAcquisition: { label: "Partner Acquisition", icon: Handshake },
};

const CompareCompanies = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>(["1", "4"]);

  const selectedCompanies = selectedIds
    .map((id) => companies.find((c) => c.id === id))
    .filter(Boolean) as Company[];

  const availableCompanies = companies.filter((c) => !selectedIds.includes(c.id));

  const addCompany = (id: string) => {
    if (selectedIds.length < MAX_COMPARE) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const removeCompany = (id: string) => {
    setSelectedIds(selectedIds.filter((i) => i !== id));
  };

  const getBestScore = (key: keyof Company["maScores"]) => {
    return Math.max(...selectedCompanies.map((c) => c.maScores[key]));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Compare Companies</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Side-by-side analysis of up to {MAX_COMPARE} target companies
          </p>
        </div>
        {selectedIds.length < MAX_COMPARE && (
          <Select onValueChange={addCompany}>
            <SelectTrigger className="w-56">
              <div className="flex items-center gap-2">
                <Plus className="h-3.5 w-3.5" />
                <SelectValue placeholder="Add company..." />
              </div>
            </SelectTrigger>
            <SelectContent>
              {availableCompanies.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <span className="flex items-center gap-2">
                    <span>{c.logo}</span> {c.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {selectedCompanies.length < 2 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Select at least 2 companies to compare</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Company Headers */}
          <div className={`grid gap-4`} style={{ gridTemplateColumns: `200px repeat(${selectedCompanies.length}, 1fr)` }}>
            <div />
            {selectedCompanies.map((c) => (
              <Card key={c.id} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={() => removeCompany(c.id)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
                <CardContent className="p-4 text-center">
                  <div className="text-4xl mb-2">{c.logo}</div>
                  <button
                    className="font-semibold text-sm hover:text-primary transition-colors"
                    onClick={() => navigate(`/companies/${c.id}`)}
                  >
                    {c.name}
                  </button>
                  <p className="text-xs text-muted-foreground mt-1">{c.hq}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Overview Metrics */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {[
                { label: "Revenue", icon: DollarSign, getValue: (c: Company) => c.revenue },
                { label: "Employees", icon: Users, getValue: (c: Company) => c.people.toLocaleString() },
                { label: "HQ", icon: MapPin, getValue: (c: Company) => c.hq },
                { label: "Founded", icon: Calendar, getValue: (c: Company) => c.founded.toString() },
                { label: "Status", icon: TrendingUp, getValue: (c: Company) => c.status },
              ].map((row, i) => {
                const Icon = row.icon;
                return (
                  <div
                    key={row.label}
                    className={`grid items-center py-3 ${i > 0 ? "border-t border-border" : ""}`}
                    style={{ gridTemplateColumns: `200px repeat(${selectedCompanies.length}, 1fr)` }}
                  >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" /> {row.label}
                    </div>
                    {selectedCompanies.map((c) => (
                      <div key={c.id} className="text-sm font-medium text-center">
                        {row.label === "Status" ? (
                          <Badge variant="secondary" className="text-xs capitalize">{row.getValue(c)}</Badge>
                        ) : (
                          row.getValue(c)
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* M&A Scores */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> M&A Scores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {/* Overall Score */}
              <div
                className="grid items-center py-3"
                style={{ gridTemplateColumns: `200px repeat(${selectedCompanies.length}, 1fr)` }}
              >
                <span className="text-sm font-semibold">Overall Score</span>
                {selectedCompanies.map((c) => {
                  const isBest = c.maScore === Math.max(...selectedCompanies.map((sc) => sc.maScore));
                  return (
                    <div key={c.id} className="flex justify-center">
                      <div className={`inline-flex items-center justify-center h-14 w-14 rounded-full border-[3px] ${isBest ? "border-primary" : "border-border"}`}>
                        <span className={`text-lg font-bold ${isBest ? "text-primary" : ""}`}>{c.maScore}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sub-scores */}
              {(Object.keys(scoreLabels) as Array<keyof Company["maScores"]>).map((key, i) => {
                const { label, icon: Icon } = scoreLabels[key];
                const best = getBestScore(key);
                return (
                  <div
                    key={key}
                    className="grid items-center py-3 border-t border-border"
                    style={{ gridTemplateColumns: `200px repeat(${selectedCompanies.length}, 1fr)` }}
                  >
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" /> {label}
                    </div>
                    {selectedCompanies.map((c) => {
                      const score = c.maScores[key];
                      const isBest = score === best && selectedCompanies.length > 1;
                      return (
                        <div key={c.id} className="px-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-sm font-semibold ${isBest ? "text-primary" : ""}`}>{score}</span>
                            {isBest && <Badge className="bg-primary/10 text-primary border-0 text-[10px]">Best</Badge>}
                          </div>
                          <Progress value={score} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Capabilities */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Capabilities</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="grid"
                style={{ gridTemplateColumns: `200px repeat(${selectedCompanies.length}, 1fr)` }}
              >
                <div />
                {selectedCompanies.map((c) => (
                  <div key={c.id} className="flex flex-wrap gap-1 px-2 pb-3">
                    {c.capabilities.map((cap) => {
                      const isShared = selectedCompanies.filter((sc) => sc.capabilities.includes(cap)).length > 1;
                      return (
                        <Badge
                          key={cap}
                          variant={isShared ? "default" : "outline"}
                          className={`text-[10px] ${isShared ? "bg-primary/10 text-primary border-0" : ""}`}
                        >
                          {cap}
                        </Badge>
                      );
                    })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Partners */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Technology Partners</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="grid"
                style={{ gridTemplateColumns: `200px repeat(${selectedCompanies.length}, 1fr)` }}
              >
                <div />
                {selectedCompanies.map((c) => (
                  <div key={c.id} className="flex flex-wrap gap-1 px-2 pb-3">
                    {c.partners.map((p) => {
                      const isShared = selectedCompanies.filter((sc) => sc.partners.includes(p)).length > 1;
                      return (
                        <Badge
                          key={p}
                          variant={isShared ? "default" : "outline"}
                          className={`text-[10px] ${isShared ? "bg-primary/10 text-primary border-0" : ""}`}
                        >
                          {p}
                        </Badge>
                      );
                    })}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Verticals & Geography */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Verticals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedCompanies.map((c) => (
                    <div key={c.id} className="flex items-center gap-3">
                      <span className="text-lg">{c.logo}</span>
                      <div className="flex flex-wrap gap-1">
                        {c.verticals.map((v) => (
                          <Badge key={v} variant="outline" className="text-[10px]">{v}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Revenue Geography</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedCompanies.map((c) => (
                    <div key={c.id} className="flex items-center gap-3">
                      <span className="text-lg">{c.logo}</span>
                      <div className="flex flex-wrap gap-1">
                        {c.revenueGeo.map((g) => (
                          <Badge key={g} variant="outline" className="text-[10px]">{g}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Management */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Leadership Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="grid gap-4"
                style={{ gridTemplateColumns: `200px repeat(${selectedCompanies.length}, 1fr)` }}
              >
                <div />
                {selectedCompanies.map((c) => (
                  <div key={c.id} className="space-y-2 px-2">
                    {c.management.map((m) => (
                      <div key={m.name} className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                          {m.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-medium">{m.name}</p>
                          <p className="text-[10px] text-muted-foreground">{m.title}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default CompareCompanies;
