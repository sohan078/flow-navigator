import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { companies, mandates } from "@/data/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Area, AreaChart,
} from "recharts";
import {
  TrendingUp, Target, Users, BarChart3, PieChart as PieChartIcon,
  Activity, Briefcase, ArrowUpRight, ArrowDownRight,
} from "lucide-react";

// Pipeline stage data
const stageCounts = {
  recommended: companies.filter((c) => c.status === "recommended").length,
  pipeline: companies.filter((c) => c.status === "pipeline").length,
  shortlisted: companies.filter((c) => c.status === "shortlisted").length,
  declined: companies.filter((c) => c.status === "declined").length,
};

const pipelineData = [
  { name: "Recommended", value: stageCounts.recommended, fill: "hsl(var(--primary))" },
  { name: "Pipeline", value: stageCounts.pipeline, fill: "hsl(var(--chart-3))" },
  { name: "Shortlisted", value: stageCounts.shortlisted, fill: "hsl(var(--success))" },
  { name: "Declined", value: stageCounts.declined, fill: "hsl(var(--destructive))" },
];

// Deal velocity (mock weekly data)
const velocityData = [
  { week: "W1", added: 12, moved: 5, closed: 2 },
  { week: "W2", added: 8, moved: 7, closed: 1 },
  { week: "W3", added: 15, moved: 9, closed: 3 },
  { week: "W4", added: 10, moved: 12, closed: 4 },
  { week: "W5", added: 18, moved: 8, closed: 2 },
  { week: "W6", added: 14, moved: 11, closed: 5 },
  { week: "W7", added: 9, moved: 14, closed: 3 },
  { week: "W8", added: 22, moved: 10, closed: 6 },
];

// Mandate coverage
const mandateCoverage = mandates.map((m) => ({
  name: m.title.split(" ").slice(0, 2).join(" "),
  matches: m.matchingCompanies,
  shortlisted: Math.floor(m.matchingCompanies * 0.08),
  pipeline: Math.floor(m.matchingCompanies * 0.15),
}));

// Geo distribution
const geoData = [
  { name: "North America", companies: 4 },
  { name: "Europe", companies: 4 },
  { name: "Asia Pacific", companies: 2 },
  { name: "Middle East", companies: 1 },
];

// Score distribution
const scoreDistribution = [
  { range: "90-100", count: 0 },
  { range: "80-89", count: 2 },
  { range: "70-79", count: 3 },
  { range: "60-69", count: 2 },
  { range: "< 60", count: 1 },
];

// Monthly trend
const monthlyTrend = [
  { month: "Oct", deals: 12, score: 68 },
  { month: "Nov", deals: 18, score: 71 },
  { month: "Dec", deals: 15, score: 73 },
  { month: "Jan", deals: 22, score: 75 },
  { month: "Feb", deals: 28, score: 78 },
  { month: "Mar", deals: 35, score: 76 },
];

// Capability radar
const capabilityRadar = [
  { capability: "Cloud", score: 85 },
  { capability: "AI/ML", score: 78 },
  { capability: "Security", score: 65 },
  { capability: "Data", score: 90 },
  { capability: "Fintech", score: 72 },
  { capability: "Health IT", score: 55 },
];

const KPICard = ({
  title, value, change, changeType, icon: Icon,
}: {
  title: string; value: string; change: string; changeType: "up" | "down"; icon: React.ElementType;
}) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <Badge
          className={`border-0 text-[10px] ${changeType === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}
        >
          {changeType === "up" ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
          {change}
        </Badge>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{title}</p>
    </CardContent>
  </Card>
);

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--chart-3))",
  "hsl(var(--success))",
  "hsl(var(--destructive))",
];

const Analytics = () => {
  const avgScore = Math.round(companies.reduce((s, c) => s + c.maScore, 0) / companies.length);
  const totalMatches = mandates.reduce((s, m) => s + m.matchingCompanies, 0);
  const conversionRate = ((stageCounts.shortlisted / companies.length) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Pipeline health, deal velocity, and mandate performance metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard title="Total Companies" value={companies.length.toString()} change="+12%" changeType="up" icon={Users} />
        <KPICard title="Active Mandates" value={mandates.length.toString()} change="+1" changeType="up" icon={Target} />
        <KPICard title="Avg M&A Score" value={avgScore.toString()} change="+3.2" changeType="up" icon={TrendingUp} />
        <KPICard title="Conversion Rate" value={`${conversionRate}%`} change="-0.5%" changeType="down" icon={Activity} />
      </div>

      {/* Row 1: Pipeline + Deal Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" /> Pipeline Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pipelineData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pipelineData.map((entry, i) => (
                      <Cell key={entry.name} fill={COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {pipelineData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs text-muted-foreground">{d.name}</span>
                  <span className="text-xs font-semibold ml-auto">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4" /> Deal Velocity (Weekly)
            </CardTitle>
            <CardDescription className="text-xs">Companies added, moved through stages, and closed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={velocityData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="week" className="text-xs" tick={{ fontSize: 11 }} />
                  <YAxis className="text-xs" tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="added" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                  <Area type="monotone" dataKey="moved" stackId="1" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3) / 0.2)" />
                  <Area type="monotone" dataKey="closed" stackId="1" stroke="hsl(var(--success))" fill="hsl(var(--success) / 0.2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Mandate Coverage + Score Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4 w-4" /> Mandate Coverage
            </CardTitle>
            <CardDescription className="text-xs">Matching companies per mandate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mandateCoverage} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="matches" fill="hsl(var(--primary) / 0.3)" name="Total Matches" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="pipeline" fill="hsl(var(--chart-3))" name="Pipeline" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="shortlisted" fill="hsl(var(--success))" name="Shortlisted" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4" /> M&A Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" name="Companies" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Monthly Trend + Capability Radar + Geo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Monthly Deal Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="deals" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="score" stroke="hsl(var(--success))" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Capability Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={capabilityRadar}>
                  <PolarGrid className="stroke-border" />
                  <PolarAngleAxis dataKey="capability" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis tick={{ fontSize: 9 }} />
                  <Radar dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Geographic Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 pt-2">
              {geoData.map((g) => (
                <div key={g.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{g.name}</span>
                    <span className="font-semibold">{g.companies}</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${(g.companies / Math.max(...geoData.map((d) => d.companies))) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
