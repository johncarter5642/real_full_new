import { useQuery } from "@tanstack/react-query";
import { DashboardMetrics, WebhookResponse } from "@/types/dashboard";

const API_ENDPOINT = "https://jadu123456.app.n8n.cloud/webhook/d1311a58-2f18-4d00-af0d-bde782e52c28";

async function fetchDashboardData(): Promise<DashboardMetrics> {
  const response = await fetch(API_ENDPOINT);
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }
  
  const data: WebhookResponse = await response.json();
  
  // Process and return structured metrics
  const qualified = data.qualifiedLeads || [];
  const incoming = data.incomingLeads || [];
  const appointments = data.appointmentdetails || [];
  
  const totalLeads = qualified.length;
  const hot = qualified.filter(l => l.status === "Hot").length;
  const warm = qualified.filter(l => l.status === "Warm").length;
  const cold = qualified.filter(l => l.status === "Cold").length;
  const avgScore = totalLeads ? (qualified.reduce((a, b) => a + b.score, 0) / totalLeads).toFixed(1) : "0";
  const appointmentsCount = appointments.length;
  const conversionRate = totalLeads ? ((appointmentsCount / totalLeads) * 100).toFixed(1) : "0";
  
  // Leads by Location
  const leadsByLocation: Record<string, number> = {};
  qualified.forEach(l => {
    const loc = l.location || "Unknown";
    leadsByLocation[loc] = (leadsByLocation[loc] || 0) + 1;
  });
  
  return {
    totalLeads,
    hot,
    warm,
    cold,
    avgScore,
    appointmentsCount,
    conversionRate,
    leadsByLocation,
    recentLeads: incoming.slice(-5).reverse(),
    upcomingAppointments: appointments.sort((a, b) => 
      new Date(a.appointment_start_time).getTime() - new Date(b.appointment_start_time).getTime()
    ),
    rawData: {
      qualifiedLeads: qualified,
      incomingLeads: incoming,
      appointments
    }
  };
}

export function useDashboardData() {
  return useQuery({
    queryKey: ["/dashboard-data"],
    queryFn: fetchDashboardData,
    refetchInterval: 60000, // Auto-refresh every 60 seconds
    refetchOnWindowFocus: false,
    staleTime: 0,
  });
}
