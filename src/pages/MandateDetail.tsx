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
} from "lucide-react";

const MandateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mandate = mandates.find((m) => m.id === id);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

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

      {/* Companies */}
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
    </div>
  );
};

export default MandateDetail;
