import { formatDistanceToNow } from "date-fns";
import { IncomingLead } from "@/types/dashboard";

interface RecentLeadsTableProps {
  leads: IncomingLead[];
}

export function RecentLeadsTable({ leads }: RecentLeadsTableProps) {
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch {
      return "Invalid date";
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <i className="fas fa-inbox text-primary"></i>
        Recent Incoming Leads
      </h2>
      
      <div className="overflow-x-auto">
        <table className="w-full" data-testid="recent-leads-table">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Name
              </th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Location
              </th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Submitted
              </th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr data-testid="no-recent-leads">
                <td colSpan={3} className="py-8 text-center text-muted-foreground">
                  <i className="fas fa-inbox text-3xl mb-2 opacity-50"></i>
                  <p>No recent leads</p>
                </td>
              </tr>
            ) : (
              leads.map((lead, index) => (
                <tr 
                  key={index} 
                  className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                  data-testid={`lead-row-${index}`}
                >
                  <td className="py-3 px-2 text-sm font-medium text-foreground">
                    {lead.Name || "N/A"}
                  </td>
                  <td className="py-3 px-2 text-sm text-foreground">
                    <span className="flex items-center gap-1">
                      <i className="fas fa-map-marker-alt text-xs text-muted-foreground"></i>
                      {lead.location || "Unknown"}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-sm text-muted-foreground">
                    {formatDateTime(lead.submittedAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
