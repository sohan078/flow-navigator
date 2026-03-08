import { useState } from "react";
import { companies, mandates } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  FolderOpen, FileText, Upload, Plus, Search, Calendar, Users,
  MoreHorizontal, Download, Trash2, ChevronRight, ArrowLeft,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Project {
  id: string;
  mandateId: string;
  companyId: string;
  name: string;
  status: "active" | "completed" | "on-hold";
  progress: number;
  lead: string;
  createdAt: string;
  updatedAt: string;
  folders: Folder[];
}

interface Folder {
  id: string;
  name: string;
  files: ProjectFile[];
}

interface ProjectFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-success/10 text-success" },
  completed: { label: "Completed", color: "bg-primary/10 text-primary" },
  "on-hold": { label: "On Hold", color: "bg-chart-3/10 text-chart-3" },
};

const mockProjects: Project[] = [
  {
    id: "p1", mandateId: "1", companyId: "1", name: "TechNova Acquisition Analysis",
    status: "active", progress: 65, lead: "John Smith", createdAt: "2026-02-20", updatedAt: "2026-03-07",
    folders: [
      { id: "f1", name: "Financial Due Diligence", files: [
        { id: "d1", name: "Q4_2025_Financials.pdf", type: "pdf", size: "2.4 MB", uploadedBy: "Sarah Johnson", uploadedAt: "2026-03-05" },
        { id: "d2", name: "Revenue_Model.xlsx", type: "xlsx", size: "1.1 MB", uploadedBy: "John Smith", uploadedAt: "2026-03-04" },
      ]},
      { id: "f2", name: "Legal Documents", files: [
        { id: "d3", name: "NDA_Signed.pdf", type: "pdf", size: "540 KB", uploadedBy: "Mike Chen", uploadedAt: "2026-03-01" },
      ]},
      { id: "f3", name: "Technical Assessment", files: [
        { id: "d4", name: "Tech_Stack_Review.docx", type: "docx", size: "890 KB", uploadedBy: "Sarah Johnson", uploadedAt: "2026-03-06" },
        { id: "d5", name: "Architecture_Diagram.png", type: "png", size: "3.2 MB", uploadedBy: "Mike Chen", uploadedAt: "2026-03-03" },
      ]},
    ],
  },
  {
    id: "p2", mandateId: "2", companyId: "4", name: "NeuralEdge AI Acqui-hire",
    status: "active", progress: 40, lead: "Mike Chen", createdAt: "2026-03-01", updatedAt: "2026-03-07",
    folders: [
      { id: "f4", name: "Team Assessment", files: [
        { id: "d6", name: "Team_Profiles.pdf", type: "pdf", size: "1.8 MB", uploadedBy: "Mike Chen", uploadedAt: "2026-03-06" },
      ]},
      { id: "f5", name: "IP & Patents", files: [
        { id: "d7", name: "Patent_Portfolio.pdf", type: "pdf", size: "4.5 MB", uploadedBy: "John Smith", uploadedAt: "2026-03-05" },
      ]},
    ],
  },
  {
    id: "p3", mandateId: "3", companyId: "6", name: "CyberShield Security Roll-up",
    status: "on-hold", progress: 20, lead: "Sarah Johnson", createdAt: "2026-02-15", updatedAt: "2026-03-02",
    folders: [
      { id: "f6", name: "Market Analysis", files: [
        { id: "d8", name: "Competitive_Landscape.pptx", type: "pptx", size: "5.2 MB", uploadedBy: "Sarah Johnson", uploadedAt: "2026-02-28" },
      ]},
    ],
  },
  {
    id: "p4", mandateId: "1", companyId: "2", name: "DataPulse Analytics Review",
    status: "completed", progress: 100, lead: "John Smith", createdAt: "2026-01-10", updatedAt: "2026-02-28",
    folders: [
      { id: "f7", name: "Final Report", files: [
        { id: "d9", name: "Investment_Memo.pdf", type: "pdf", size: "3.8 MB", uploadedBy: "John Smith", uploadedAt: "2026-02-28" },
        { id: "d10", name: "Board_Presentation.pptx", type: "pptx", size: "7.1 MB", uploadedBy: "Sarah Johnson", uploadedAt: "2026-02-27" },
      ]},
    ],
  },
];

const fileTypeIcon = (type: string) => {
  return <FileText className="h-4 w-4" />;
};

const Projects = () => {
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const filteredProjects = mockProjects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalFiles = (p: Project) => p.folders.reduce((sum, f) => sum + f.files.length, 0);

  if (selectedProject) {
    const company = companies.find((c) => c.id === selectedProject.companyId);
    const mandate = mandates.find((m) => m.id === selectedProject.mandateId);
    const config = statusConfig[selectedProject.status];

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => { setSelectedProject(null); setOpenFolder(null); }}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{selectedProject.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <Badge className={`${config.color} border-0`}>{config.label}</Badge>
              <span className="text-xs text-muted-foreground">Lead: {selectedProject.lead}</span>
              <span className="text-xs text-muted-foreground">Updated {selectedProject.updatedAt}</span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload File
          </Button>
          <Button size="sm">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> New Folder
          </Button>
        </div>

        {/* Project Info */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Company</p>
              <p className="text-sm font-medium">{company?.logo} {company?.name}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Mandate</p>
              <p className="text-sm font-medium">{mandate?.title}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Progress</p>
              <div className="flex items-center gap-2">
                <Progress value={selectedProject.progress} className="flex-1 h-2" />
                <span className="text-sm font-medium">{selectedProject.progress}%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Folders */}
        <div className="space-y-3">
          {selectedProject.folders.map((folder) => (
            <Card key={folder.id}>
              <button
                className="w-full text-left"
                onClick={() => setOpenFolder(openFolder === folder.id ? null : folder.id)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FolderOpen className="h-5 w-5 text-chart-3" />
                    <div>
                      <p className="text-sm font-medium">{folder.name}</p>
                      <p className="text-[10px] text-muted-foreground">{folder.files.length} files</p>
                    </div>
                  </div>
                  <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${openFolder === folder.id ? "rotate-90" : ""}`} />
                </CardContent>
              </button>
              {openFolder === folder.id && (
                <div className="px-4 pb-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>File</TableHead>
                        <TableHead className="hidden md:table-cell">Size</TableHead>
                        <TableHead className="hidden md:table-cell">Uploaded By</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {folder.files.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {fileTypeIcon(file.type)}
                              <span className="text-sm">{file.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{file.size}</TableCell>
                          <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{file.uploadedBy}</TableCell>
                          <TableCell className="hidden md:table-cell text-xs text-muted-foreground">{file.uploadedAt}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-7 w-7">
                                <Download className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Upload Drop Zone */}
        <Card className="border-dashed border-2">
          <CardContent className="p-8 text-center">
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium">Drop files here or click to upload</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, XLSX, PPTX, PNG up to 20MB</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage acquisition projects and their associated documents</p>
        </div>
        <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-3.5 w-3.5 mr-1.5" /> New Project
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {(["active", "on-hold", "completed"] as const).map((status) => {
          const config = statusConfig[status];
          const count = mockProjects.filter((p) => p.status === status).length;
          return (
            <Card key={status}>
              <CardContent className="p-4">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">{config.label} Projects</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search projects..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => {
          const company = companies.find((c) => c.id === project.companyId);
          const mandate = mandates.find((m) => m.id === project.mandateId);
          const config = statusConfig[project.status];
          return (
            <Card key={project.id} className="cursor-pointer hover:shadow-md transition-all" onClick={() => setSelectedProject(project)}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold">{project.name}</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{mandate?.title}</p>
                  </div>
                  <Badge className={`${config.color} border-0 text-[10px]`}>{config.label}</Badge>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base">{company?.logo}</span>
                  <span className="text-xs text-muted-foreground">{company?.name}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Progress value={project.progress} className="flex-1 h-1.5" />
                  <span className="text-xs font-medium">{project.progress}%</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {project.lead}</span>
                  <span>{project.folders.length} folders · {totalFiles(project)} files</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {project.updatedAt}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create New Project</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Project name" />
            <Input placeholder="Lead assignee" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => setCreateDialogOpen(false)}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Projects;
