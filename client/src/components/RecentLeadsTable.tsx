import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { IncomingLead } from "@/types/dashboard";
import { LeadDetailModal } from "./LeadDetailModal";

interface RecentLeadsTableProps {
  leads: IncomingLead[];
}

export function RecentLeadsTable({ leads }: RecentLeadsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<IncomingLead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === "all" || lead.location === locationFilter;
    return matchesSearch && matchesLocation;
  });
  
  const uniqueLocations = Array.from(new Set(leads.map(l => l.location)));
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
      
      {/* Search and Filters */}
      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Search by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          data-testid="search-leads"
        />
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          data-testid="filter-location"
        >
          <option value="all">All Locations</option>
          {uniqueLocations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
      </div>
      
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
            {filteredLeads.length === 0 ? (
              <tr data-testid="no-recent-leads">
                <td colSpan={3} className="py-8 text-center text-muted-foreground">
                  <i className="fas fa-inbox text-3xl mb-2 opacity-50"></i>
                  <p>{searchTerm || locationFilter !== "all" ? "No matching leads" : "No recent leads"}</p>
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead, index) => (
                <tr 
                  key={index} 
                  className="border-b border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer"
                  data-testid={`lead-row-${index}`}
                  onClick={() => {
                    setSelectedLead(lead);
                    setIsModalOpen(true);
                  }}
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
      
      <LeadDetailModal
        lead={selectedLead}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLead(null);
        }}
      />
    </div>
  );
}
