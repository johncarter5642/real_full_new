import { useState } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { MetricCard } from "@/components/MetricCard";
import { LeadDistributionChart } from "@/components/LeadDistributionChart";
import { LocationChart } from "@/components/LocationChart";
import { RecentLeadsTable } from "@/components/RecentLeadsTable";
import { AppointmentsTable } from "@/components/AppointmentsTable";
import { queryClient } from "@/lib/queryClient";

export default function Dashboard() {
  const { data, isLoading, error, refetch } = useDashboardData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["/dashboard-data"] });
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const updateLastUpdatedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-5xl text-destructive mb-4"></i>
          <h1 className="text-2xl font-bold text-foreground mb-2">Error Loading Dashboard</h1>
          <p className="text-muted-foreground mb-4">
            Failed to fetch dashboard data. Please check your connection and try again.
          </p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            data-testid="retry-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground flex items-center gap-3">
                <span className="text-4xl">🏡</span>
                Real Estate Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Monitor leads, appointments, and conversion metrics in real-time
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Last Updated Display */}
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <i className="fas fa-clock"></i>
                  <span>
                    Last updated: <span className="font-medium" data-testid="last-updated">
                      {data ? updateLastUpdatedTime() : "--:--"}
                    </span>
                  </span>
                </div>
              </div>
              
              {/* Manual Refresh Button */}
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
                data-testid="refresh-button"
              >
                <i className={`fas fa-sync-alt refresh-icon ${isRefreshing ? 'spinning' : ''}`}></i>
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </header>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20" data-testid="loading-state">
            <div className="text-center">
              <i className="fas fa-spinner fa-spin text-5xl text-primary mb-4"></i>
              <p className="text-muted-foreground">Loading dashboard data...</p>
            </div>
          </div>
        )}

        {/* Main Dashboard Content */}
        {data && (
          <div data-testid="dashboard-content">
            
            {/* KPI Metrics Cards */}
            <section className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                
                <MetricCard
                  title="Total Leads"
                  value={data.totalLeads}
                  description="Qualified leads in pipeline"
                  icon={<i className="fas fa-users"></i>}
                  data-testid="metric-total-leads"
                />
                
                <MetricCard
                  title="Hot Leads"
                  value={data.hot}
                  description="High-priority prospects"
                  icon={<i className="fas fa-fire"></i>}
                  iconBgColor="bg-destructive/10"
                  iconColor="text-destructive"
                  data-testid="metric-hot-leads"
                />
                
                <MetricCard
                  title="Warm Leads"
                  value={data.warm}
                  description="Medium interest leads"
                  icon={<i className="fas fa-temperature-half"></i>}
                  iconBgColor="bg-warning/10"
                  iconColor="text-warning"
                  data-testid="metric-warm-leads"
                />
                
                <MetricCard
                  title="Cold Leads"
                  value={data.cold}
                  description="Low engagement leads"
                  icon={<i className="fas fa-snowflake"></i>}
                  data-testid="metric-cold-leads"
                />
                
                <MetricCard
                  title="Avg Lead Score"
                  value={data.avgScore}
                  description="Out of 10 points"
                  icon={<i className="fas fa-star"></i>}
                  iconBgColor="bg-accent/10"
                  iconColor="text-accent"
                  data-testid="metric-avg-score"
                />
                
                <MetricCard
                  title="Appointments"
                  value={data.appointmentsCount}
                  description="Scheduled meetings"
                  icon={<i className="fas fa-calendar-check"></i>}
                  iconBgColor="bg-accent/10"
                  iconColor="text-accent"
                  data-testid="metric-appointments"
                />
                
                <div className="lg:col-span-2">
                  <MetricCard
                    title="Conversion Rate"
                    value={`${data.conversionRate}%`}
                    description="Leads converted to appointments"
                    icon={<i className="fas fa-chart-line"></i>}
                    iconBgColor="bg-accent/10"
                    iconColor="text-accent"
                    data-testid="metric-conversion-rate"
                  />
                </div>
                
              </div>
            </section>
            
            {/* Charts Section */}
            <section className="mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LeadDistributionChart data={data} />
                <LocationChart data={data} />
              </div>
            </section>
            
            {/* Data Tables Section */}
            <section className="mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentLeadsTable leads={data.recentLeads} />
                <AppointmentsTable appointments={data.upcomingAppointments} />
              </div>
            </section>
            
          </div>
        )}
        
      </div>
    </div>
  );
}
