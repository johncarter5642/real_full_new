export interface QualifiedLead {
  name: string;
  score: number;
  status: "Hot" | "Warm" | "Cold";
  location: string;
}

export interface IncomingLead {
  Name: string;
  location: string;
  submittedAt: string;
}

export interface AppointmentDetail {
  Name: string;
  appointment_start_time: string;
}

export interface WebhookResponse {
  qualifiedLeads: QualifiedLead[];
  incomingLeads: IncomingLead[];
  appointmentdetails: AppointmentDetail[];
}

export interface DashboardMetrics {
  totalLeads: number;
  hot: number;
  warm: number;
  cold: number;
  avgScore: string;
  appointmentsCount: number;
  conversionRate: string;
  leadsByLocation: Record<string, number>;
  recentLeads: IncomingLead[];
  upcomingAppointments: AppointmentDetail[];
}
