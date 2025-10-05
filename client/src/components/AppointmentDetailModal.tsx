import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AppointmentDetail } from "@/types/dashboard";
import { format } from "date-fns";

interface AppointmentDetailModalProps {
  appointment: AppointmentDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AppointmentDetailModal({ appointment, isOpen, onClose }: AppointmentDetailModalProps) {
  if (!appointment) return null;

  const appointmentDate = new Date(appointment.appointment_start_time);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="appointment-detail-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <i className="fas fa-calendar-check text-primary"></i>
            Appointment Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Client Name</label>
            <p className="text-lg font-medium text-foreground mt-1">{appointment.Name}</p>
          </div>
          
          <div>
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Date</label>
            <p className="text-foreground mt-1 flex items-center gap-2">
              <i className="fas fa-calendar text-primary"></i>
              {format(appointmentDate, "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          
          <div>
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Time</label>
            <p className="text-foreground mt-1 flex items-center gap-2">
              <i className="fas fa-clock text-primary"></i>
              {format(appointmentDate, "h:mm a")}
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
              className="flex-1 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              data-testid="reschedule-appointment"
            >
              <i className="fas fa-edit"></i>
              Reschedule
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
