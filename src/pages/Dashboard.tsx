import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mandates, companies, newsItems } from "@/data/mockData";
import { ArrowRight, TrendingUp, Building2, Newspaper, Target } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back. Here's your M&A intelligence overview.</p>
      </div>

      {/* Active Mandates */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" /> Active Mandates
          </h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/mandates')}>
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mandates.map((m) => (
            <Card
              key={m.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/mandates/${m.id}`)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">{m.strategy}</Badge>
                  <span className="text-xs text-muted-foreground">{m.matchingCompanies} matches</span>
                </div>
                <CardTitle className="text-base mt-2">{m.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground line-clamp-2">{m.description}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {m.capabilities.slice(0, 2).map((c) => (
                    <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
                  ))}
                  {m.capabilities.length > 2 && (
                    <Badge variant="outline" className="text-[10px]">+{m.capabilities.length - 2}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Recommended Companies */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" /> Recommended Companies
          </h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {companies.filter(c => c.status === 'recommended').map((company) => (
            <Card
              key={company.id}
              className="min-w-[280px] cursor-pointer hover:shadow-md transition-shadow flex-shrink-0"
              onClick={() => navigate(`/companies/${company.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">{company.logo}</div>
                  <div>
                    <p className="font-semibold text-sm">{company.name}</p>
                    <p className="text-xs text-muted-foreground">{company.hq}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{company.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span className="text-xs font-medium">M&A Score: {company.maScore}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{company.people} people</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {company.capabilities.slice(0, 2).map((c) => (
                    <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Key News */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-primary" /> Key News
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {newsItems.map((news) => (
            <Card key={news.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-[10px]">{news.category}</Badge>
                  <span className="text-[10px] text-muted-foreground">{news.source}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">{news.date}</span>
                </div>
                <p className="text-sm font-medium mb-1">{news.title}</p>
                <p className="text-xs text-muted-foreground">{news.summary}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
