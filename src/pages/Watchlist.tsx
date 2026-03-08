import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { companies, newsItems, type Company } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Search, Eye, Plus, Trash2, Bell, BellOff, TrendingUp,
  Users, Briefcase, DollarSign, Newspaper, Filter,
} from "lucide-react";

interface WatchlistItem {
  companyId: string;
  addedAt: string;
  categories: string[];
  alertsEnabled: boolean;
}

interface WatchlistEvent {
  id: string;
  companyId: string;
  category: string;
  title: string;
  description: string;
  date: string;
  source: string;
}

const categories = ["M&A", "Hiring", "Growth", "Funding", "Leadership", "Product"];

const categoryConfig: Record<string, { color: string; icon: React.ElementType }> = {
  "M&A": { color: "bg-primary/10 text-primary", icon: Briefcase },
  Hiring: { color: "bg-chart-4/10 text-chart-4", icon: Users },
  Growth: { color: "bg-success/10 text-success", icon: TrendingUp },
  Funding: { color: "bg-chart-3/10 text-chart-3", icon: DollarSign },
  Leadership: { color: "bg-chart-5/10 text-chart-5", icon: Users },
  Product: { color: "bg-accent text-accent-foreground", icon: TrendingUp },
};

const initialWatchlist: WatchlistItem[] = [
  { companyId: "1", addedAt: "2026-02-20", categories: ["M&A", "Growth", "Hiring"], alertsEnabled: true },
  { companyId: "4", addedAt: "2026-02-25", categories: ["M&A", "Funding", "Product"], alertsEnabled: true },
  { companyId: "7", addedAt: "2026-03-01", categories: ["Growth", "Funding"], alertsEnabled: true },
  { companyId: "5", addedAt: "2026-03-02", categories: ["M&A", "Leadership"], alertsEnabled: false },
  { companyId: "3", addedAt: "2026-02-18", categories: ["Hiring", "Growth"], alertsEnabled: true },
];

const watchlistEvents: WatchlistEvent[] = [
  { id: "e1", companyId: "1", category: "M&A", title: "TechNova explores strategic partnership with Accenture", description: "Sources indicate TechNova Solutions is in early talks with Accenture for a strategic partnership or potential acquisition.", date: "2026-03-07", source: "Bloomberg" },
  { id: "e2", companyId: "7", category: "Funding", title: "GreenStack raises Series B at $120M valuation", description: "GreenStack Energy closed a $25M Series B round led by Northzone, valuing the company at $120M.", date: "2026-03-06", source: "TechCrunch" },
  { id: "e3", companyId: "4", category: "Hiring", title: "NeuralEdge AI hiring 50+ ML engineers", description: "NeuralEdge posted 50+ open positions for ML engineers across Berlin and Warsaw offices.", date: "2026-03-06", source: "LinkedIn" },
  { id: "e4", companyId: "1", category: "Growth", title: "TechNova wins $15M contract with Mayo Clinic", description: "TechNova Solutions announced a major healthcare analytics contract worth $15M over 3 years.", date: "2026-03-05", source: "Reuters" },
  { id: "e5", companyId: "5", category: "Leadership", title: "FinCore appoints new CFO from Goldman Sachs", description: "FinCore Technologies appointed Maria Santos, former Goldman Sachs VP, as their new Chief Financial Officer.", date: "2026-03-05", source: "Financial Times" },
  { id: "e6", companyId: "4", category: "Product", title: "NeuralEdge launches computer vision platform v3.0", description: "NeuralEdge AI released a major update to their computer vision platform with automotive-grade certifications.", date: "2026-03-04", source: "VentureBeat" },
  { id: "e7", companyId: "3", category: "M&A", title: "CloudBridge receives acquisition interest from mid-market PE firms", description: "Multiple private equity firms have approached CloudBridge Systems regarding a potential buyout.", date: "2026-03-04", source: "The Information" },
  { id: "e8", companyId: "7", category: "Growth", title: "GreenStack expands into UK market", description: "GreenStack Energy signed deals with three major UK utilities, marking their first expansion outside the Netherlands.", date: "2026-03-03", source: "Energy Monitor" },
  { id: "e9", companyId: "5", category: "M&A", title: "FinCore in talks to acquire Indonesian payments startup", description: "FinCore Technologies is reportedly in advanced negotiations to acquire Jakarta-based payments company PayLink.", date: "2026-03-02", source: "Nikkei Asia" },
  { id: "e10", companyId: "1", category: "Hiring", title: "TechNova opens new India engineering center", description: "TechNova Solutions announced a 200-person engineering center in Bangalore focused on AI/ML capabilities.", date: "2026-03-01", source: "Economic Times" },
];

const Watchlist = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [watchlist, setWatchlist] = useState(initialWatchlist);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const watchedCompanies = watchlist
    .map((w) => ({ ...w, company: companies.find((c) => c.id === w.companyId)! }))
    .filter((w) => w.company);

  const filteredCompanies = watchedCompanies.filter((w) =>
    w.company.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredEvents = watchlistEvents.filter((e) => {
    const isWatched = watchlist.some((w) => w.companyId === e.companyId);
    const matchesCategory = selectedCategory === "All" || e.category === selectedCategory;
    return isWatched && matchesCategory;
  });

  const toggleAlerts = (companyId: string) => {
    setWatchlist(watchlist.map((w) =>
      w.companyId === companyId ? { ...w, alertsEnabled: !w.alertsEnabled } : w
    ));
  };

  const removeFromWatchlist = (companyId: string) => {
    setWatchlist(watchlist.filter((w) => w.companyId !== companyId));
  };

  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = watchlistEvents.filter((e) =>
      e.category === cat && watchlist.some((w) => w.companyId === e.companyId)
    ).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Watchlist</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor competitors and track key events across your target companies</p>
        </div>
        <Button size="sm">
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Company
        </Button>
      </div>

      {/* Category Filter Cards */}
      <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${selectedCategory === "All" ? "ring-2 ring-primary" : ""}`}
          onClick={() => setSelectedCategory("All")}
        >
          <CardContent className="p-3 text-center">
            <p className="text-lg font-bold">{watchlistEvents.filter((e) => watchlist.some((w) => w.companyId === e.companyId)).length}</p>
            <p className="text-[10px] text-muted-foreground">All Events</p>
          </CardContent>
        </Card>
        {categories.map((cat) => {
          const config = categoryConfig[cat];
          const Icon = config.icon;
          return (
            <Card
              key={cat}
              className={`cursor-pointer transition-all hover:shadow-md ${selectedCategory === cat ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedCategory(selectedCategory === cat ? "All" : cat)}
            >
              <CardContent className="p-3 text-center">
                <div className={`inline-flex p-1.5 rounded-md mb-1 ${config.color}`}>
                  <Icon className="h-3 w-3" />
                </div>
                <p className="text-lg font-bold">{categoryCounts[cat]}</p>
                <p className="text-[10px] text-muted-foreground">{cat}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="feed">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="feed">
              <Newspaper className="h-3.5 w-3.5 mr-1.5" /> News Feed
            </TabsTrigger>
            <TabsTrigger value="companies">
              <Eye className="h-3.5 w-3.5 mr-1.5" /> Watched Companies
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

        {/* News Feed Tab */}
        <TabsContent value="feed">
          <div className="grid gap-3">
            {filteredEvents.length === 0 ? (
              <Card><CardContent className="p-6 text-center text-sm text-muted-foreground">No events found for this category.</CardContent></Card>
            ) : (
              filteredEvents.map((event) => {
                const company = companies.find((c) => c.id === event.companyId);
                const config = categoryConfig[event.category];
                return (
                  <Card key={event.id} className="hover:shadow-md transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Badge className={`${config.color} border-0 text-[10px]`}>{event.category}</Badge>
                            <span className="text-[10px] text-muted-foreground">{event.source} · {event.date}</span>
                          </div>
                          <h3 className="text-sm font-semibold mb-1">{event.title}</h3>
                          <p className="text-xs text-muted-foreground">{event.description}</p>
                        </div>
                        <button
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors shrink-0"
                          onClick={() => company && navigate(`/companies/${company.id}`)}
                        >
                          <span className="text-base">{company?.logo}</span>
                          <span>{company?.name}</span>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        {/* Watched Companies Tab */}
        <TabsContent value="companies">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Company</TableHead>
                    <TableHead className="hidden md:table-cell">HQ</TableHead>
                    <TableHead>Categories</TableHead>
                    <TableHead className="hidden md:table-cell">Added</TableHead>
                    <TableHead className="hidden lg:table-cell">Events</TableHead>
                    <TableHead>Alerts</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map(({ company, addedAt, categories: cats, alertsEnabled, companyId }) => {
                    const eventCount = watchlistEvents.filter((e) => e.companyId === companyId).length;
                    return (
                      <TableRow key={companyId}>
                        <TableCell>
                          <button
                            className="flex items-center gap-2 hover:text-primary transition-colors"
                            onClick={() => navigate(`/companies/${company.id}`)}
                          >
                            <span className="text-lg">{company.logo}</span>
                            <span className="font-medium text-sm">{company.name}</span>
                          </button>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{company.hq}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {cats.map((cat) => (
                              <Badge key={cat} className={`${categoryConfig[cat]?.color} border-0 text-[10px]`}>{cat}</Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{addedAt}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-xs font-medium">{eventCount} events</span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => toggleAlerts(companyId)}
                          >
                            {alertsEnabled ? (
                              <Bell className="h-3.5 w-3.5 text-primary" />
                            ) : (
                              <BellOff className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={() => removeFromWatchlist(companyId)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Watchlist;
