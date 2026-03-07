import { notifications } from "@/data/mockData";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, GitBranch, User, Package, Eye } from "lucide-react";

const typeIcon = {
  mandate: FileText,
  pipeline: GitBranch,
  profile: User,
  deliverable: Package,
  watchlist: Eye,
};

const typeColor = {
  mandate: 'bg-primary/10 text-primary',
  pipeline: 'bg-success/10 text-success',
  profile: 'bg-warning/10 text-warning',
  deliverable: 'bg-chart-4/10 text-chart-4',
  watchlist: 'bg-destructive/10 text-destructive',
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationPanel({ open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[380px] sm:max-w-[380px]">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-80px)] mt-4">
          <div className="space-y-3 pr-2">
            {notifications.map((n) => {
              const Icon = typeIcon[n.type];
              return (
                <div
                  key={n.id}
                  className={`p-3 rounded-lg border ${!n.read ? 'bg-primary/5 border-primary/20' : 'bg-card'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-md ${typeColor[n.type]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{n.title}</p>
                        {!n.read && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{n.description}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                          {n.action}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{n.user}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
