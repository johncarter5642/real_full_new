import { useState } from "react";
import { format } from "date-fns";
import { AppointmentDetail } from "@/types/dashboard";
import { AppointmentDetailModal } from "./AppointmentDetailModal";

interface AppointmentsTableProps {
  appointments: AppointmentDetail[];
}

export function AppointmentsTable({ appointments }: AppointmentsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const filteredAppointments = appointments.filter(appointment => {
    return appointment.Name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const formatAppointmentTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const dateStr = format(date, "MMM d, yyyy");
      const timeStr = format(date, "h:mm a");
      return { date: dateStr, time: timeStr };
    } catch {
      return { date: "Invalid date", time: "" };
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <i className="fas fa-calendar-alt text-primary"></i>
        Upcoming Appointments
      </h2>
      
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by client name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          data-testid="search-appointments"
        />
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full" data-testid="appointments-table">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Client
              </th>
              <th className="text-left py-3 px-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Date & Time
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr data-testid="no-appointments">
                <td colSpan={2} className="py-8 text-center text-muted-foreground">
                  <i className="fas fa-calendar-times text-3xl mb-2 opacity-50"></i>
                  <p>{searchTerm ? "No matching appointments" : "No upcoming appointments"}</p>
                </td>
              </tr>
            ) : (
              filteredAppointments.map((appointment, index) => {
                const { date, time } = formatAppointmentTime(appointment.appointment_start_time);
                return (
                  <tr 
                    key={index} 
                    className="border-b border-border/50 hover:bg-secondary/50 transition-colors cursor-pointer"
                    data-testid={`appointment-row-${index}`}
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setIsModalOpen(true);
                    }}
                  >
                    <td className="py-3 px-2 text-sm font-medium text-foreground">
                      {appointment.Name || "N/A"}
                    </td>
                    <td className="py-3 px-2 text-sm text-muted-foreground">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{date}</span>
                        <span className="text-xs">{time}</span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      <AppointmentDetailModal
        appointment={selectedAppointment}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAppointment(null);
        }}
      />
    </div>
  );
}
