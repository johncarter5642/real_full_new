import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IncomingLead } from "@/types/dashboard";
import { format } from "date-fns";

interface LeadDetailModalProps {
  lead: IncomingLead | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LeadDetailModal({ lead, isOpen, onClose }: LeadDetailModalProps) {
  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="lead-detail-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <i className="fas fa-user-circle text-primary"></i>
            Lead Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Name</label>
            <p className="text-lg font-medium text-foreground mt-1">{lead.Name}</p>
          </div>
          
          <div>
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Location</label>
            <p className="text-foreground mt-1 flex items-center gap-2">
              <i className="fas fa-map-marker-alt text-primary"></i>
              {lead.location}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Submitted At</label>
            <p className="text-foreground mt-1 flex items-center gap-2">
              <i className="fas fa-clock text-primary"></i>
              {format(new Date(lead.submittedAt), "MMM d, yyyy 'at' h:mm a")}
            </p>
          </div>
          
          <div className="pt-4 border-t border-border flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity"
              data-testid="close-modal"
            >
              Close
            </button>
            <button
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              data-testid="contact-lead"
            >
              <i className="fas fa-phone"></i>
              Contact
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
