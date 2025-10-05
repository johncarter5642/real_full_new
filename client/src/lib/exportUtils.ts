import { QualifiedLead, IncomingLead, AppointmentDetail } from "@/types/dashboard";
import { format } from "date-fns";

function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeCSVField(field: string | number): string {
  const str = String(field);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportQualifiedLeadsToCSV(leads: QualifiedLead[]) {
  const headers = ["Name", "Score", "Status", "Location"];
  const rows = leads.map(lead => [
    escapeCSVField(lead.name),
    escapeCSVField(lead.score),
    escapeCSVField(lead.status),
    escapeCSVField(lead.location)
  ]);
  
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");
  
  const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
  downloadCSV(`qualified_leads_${timestamp}.csv`, csvContent);
}

export function exportIncomingLeadsToCSV(leads: IncomingLead[]) {
  const headers = ["Name", "Location", "Submitted At"];
  const rows = leads.map(lead => [
    escapeCSVField(lead.Name),
    escapeCSVField(lead.location),
    escapeCSVField(format(new Date(lead.submittedAt), "MMM d, yyyy h:mm a"))
  ]);
  
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");
  
  const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
  downloadCSV(`incoming_leads_${timestamp}.csv`, csvContent);
}

export function exportAppointmentsToCSV(appointments: AppointmentDetail[]) {
  const headers = ["Client Name", "Appointment Date", "Appointment Time"];
  const rows = appointments.map(appointment => {
    const date = new Date(appointment.appointment_start_time);
    return [
      escapeCSVField(appointment.Name),
      escapeCSVField(format(date, "MMM d, yyyy")),
      escapeCSVField(format(date, "h:mm a"))
    ];
  });
  
  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");
  
  const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
  downloadCSV(`appointments_${timestamp}.csv`, csvContent);
}

export function exportAllDataToCSV(qualifiedLeads: QualifiedLead[], incomingLeads: IncomingLead[], appointments: AppointmentDetail[]) {
  const sections = [
    "=== QUALIFIED LEADS ===",
    ["Name", "Score", "Status", "Location"].join(","),
    ...qualifiedLeads.map(lead => [
      escapeCSVField(lead.name),
      escapeCSVField(lead.score),
      escapeCSVField(lead.status),
      escapeCSVField(lead.location)
    ].join(",")),
    "",
    "=== INCOMING LEADS ===",
    ["Name", "Location", "Submitted At"].join(","),
    ...incomingLeads.map(lead => [
      escapeCSVField(lead.Name),
      escapeCSVField(lead.location),
      escapeCSVField(format(new Date(lead.submittedAt), "MMM d, yyyy h:mm a"))
    ].join(",")),
    "",
    "=== APPOINTMENTS ===",
    ["Client Name", "Appointment Date", "Appointment Time"].join(","),
    ...appointments.map(appointment => {
      const date = new Date(appointment.appointment_start_time);
      return [
        escapeCSVField(appointment.Name),
        escapeCSVField(format(date, "MMM d, yyyy")),
        escapeCSVField(format(date, "h:mm a"))
      ].join(",");
    })
  ];
  
  const csvContent = sections.join("\n");
  const timestamp = format(new Date(), "yyyy-MM-dd_HH-mm-ss");
  downloadCSV(`all_dashboard_data_${timestamp}.csv`, csvContent);
}
