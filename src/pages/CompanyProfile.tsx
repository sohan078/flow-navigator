import { useParams, useNavigate } from "react-router-dom";
import { companies } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, Download, ExternalLink, Linkedin, Twitter,
  GitBranch, Star, XCircle, Users, MapPin, Globe, Calendar,
} from "lucide-react";

const ScoreBar = ({ label, score }: { label: string; score: number }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span>{label}</span>
      <span className="font-semibold">{score}/100</span>
    </div>
    <Progress value={score} className="h-2" />
  </div>
);

const CompanyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const company = companies.find((c) => c.id === id);

  if (!company) {
    return (
      <div className="p-6">
        <p>Company not found.</p>
        <Button variant="ghost" onClick={() => navigate(-1)}>Back</Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="text-5xl">{company.logo}</div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{company.name}</h1>
          <p className="text-sm text-muted-foreground mt-1">{company.description}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {company.hq}</span>
            <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {company.people} employees</span>
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Founded {company.founded}</span>
            <a href={company.website} className="flex items-center gap-1 text-primary hover:underline">
              <Globe className="h-3.5 w-3.5" /> Website <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {company.socialLinks.linkedin && (
              <Button variant="ghost" size="icon" className="h-7 w-7"><Linkedin className="h-3.5 w-3.5" /></Button>
            )}
            {company.socialLinks.twitter && (
              <Button variant="ghost" size="icon" className="h-7 w-7"><Twitter className="h-3.5 w-3.5" /></Button>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><GitBranch className="h-3.5 w-3.5 mr-1" /> Pipeline</Button>
          <Button variant="outline" size="sm"><Star className="h-3.5 w-3.5 mr-1" /> Shortlist</Button>
          <Button variant="outline" size="sm"><XCircle className="h-3.5 w-3.5 mr-1" /> Decline</Button>
          <Button size="sm"><Download className="h-3.5 w-3.5 mr-1" /> Download</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* M&A Score */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">M&A Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full border-4 border-primary">
                <span className="text-2xl font-bold">{company.maScore}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Overall Score</p>
            </div>
            <ScoreBar label="Founder Liquidity" score={company.maScores.founderLiquidity} />
            <ScoreBar label="Stagnation" score={company.maScores.stagnation} />
            <ScoreBar label="Activity" score={company.maScores.activity} />
            <ScoreBar label="Partner Acquisition" score={company.maScores.partnerAcquisition} />
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="profile">Company Profile</TabsTrigger>
              <TabsTrigger value="management">Management</TabsTrigger>
              <TabsTrigger value="intent">M&A Intent</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <Card>
                <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                    <p className="font-semibold">{company.revenue}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Employees</p>
                    <p className="font-semibold">{company.people}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">HQ</p>
                    <p className="font-semibold">{company.hq}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Founded</p>
                    <p className="font-semibold">{company.founded}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="text-sm">{company.description}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="mt-4 space-y-4">
              {[
                { title: "Capabilities", items: company.capabilities },
                { title: "Technology Partners", items: company.partners },
                { title: "Verticals", items: company.verticals },
                { title: "Delivery Geography", items: company.deliveryGeo },
                { title: "Revenue Geography", items: company.revenueGeo },
                { title: "Skills", items: company.skills },
                { title: "Customers", items: company.customers },
                { title: "Investors", items: company.investors },
              ].map((section) => (
                <Card key={section.title}>
                  <CardContent className="p-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">{section.title}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {section.items.map((item) => (
                        <Badge key={item} variant="secondary">{item}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="management" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.management.map((person) => (
                  <Card key={person.name}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary">
                        {person.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{person.name}</p>
                        <p className="text-sm text-muted-foreground">{person.title}</p>
                      </div>
                      {person.linkedin && (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Linkedin className="h-4 w-4" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="intent" className="mt-4 space-y-4">
              {[
                { label: "Founder Liquidity", score: company.maScores.founderLiquidity, desc: "Indicates the likelihood of founders seeking an exit based on tenure, funding rounds, and market conditions." },
                { label: "Stagnation", score: company.maScores.stagnation, desc: "Measures signs of growth plateau including declining hiring, flat revenue, and reduced product updates." },
                { label: "Activity", score: company.maScores.activity, desc: "Tracks recent corporate activity such as partnerships, fundraising, and market expansion initiatives." },
                { label: "Partner Acquisition", score: company.maScores.partnerAcquisition, desc: "Evaluates the strategic value of partnerships and likelihood of being acquired for partner ecosystem access." },
              ].map((item) => (
                <Card key={item.label}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">{item.label}</p>
                      <Badge className={item.score >= 80 ? "bg-success/10 text-success border-0" : item.score >= 60 ? "bg-warning/10 text-warning border-0" : "bg-destructive/10 text-destructive border-0"}>
                        {item.score}/100
                      </Badge>
                    </div>
                    <Progress value={item.score} className="h-2 mb-2" />
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
