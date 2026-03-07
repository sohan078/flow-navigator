import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mandates } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit, Filter } from "lucide-react";

const MandatesDashboard = () => {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

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
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mandates.map((m) => (
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
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
            {funnelSteps.map((step, i) => (
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
    </div>
  );
};

export default MandatesDashboard;
