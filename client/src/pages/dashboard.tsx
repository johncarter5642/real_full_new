import { useState } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useTheme } from "@/hooks/useTheme";
import { MetricCard } from "@/components/MetricCard";
import { LeadDistributionChart } from "@/components/LeadDistributionChart";
import { LocationChart } from "@/components/LocationChart";
import { RecentLeadsTable } from "@/components/RecentLeadsTable";
import { AppointmentsTable } from "@/components/AppointmentsTable";
import { queryClient } from "@/lib/queryClient";
import { exportQualifiedLeadsToCSV, exportIncomingLeadsToCSV, exportAppointmentsToCSV, exportAllDataToCSV } from "@/lib/exportUtils";

interface PreviousMetrics {
  totalLeads: number;
  hot: number;
  warm: number;
  cold: number;
  appointmentsCount: number;
}

export default function Dashboard() {
  const { data, isLoading, error, refetch } = useDashboardData();
  const { theme, toggleTheme } = useTheme();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [previousMetrics, setPreviousMetrics] = useState<PreviousMetrics | null>(null);

  const handleRefresh = async () => {
    if (data) {
      setPreviousMetrics({
        totalLeads: data.totalLeads,
        hot: data.hot,
        warm: data.warm,
        cold: data.cold,
        appointmentsCount: data.appointmentsCount
      });
    }
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["/dashboard-data"] });
    await refetch();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const getTrendIndicator = (current: number, previous: number | undefined) => {
    if (previous == null || previous === current) return null;
    
    const change = current - previous;
    const percentChange = previous !== 0 ? Math.abs((change / previous) * 100).toFixed(0) : "100";
    const isPositive = change > 0;
    
    return (
      <span className={`ml-2 text-xs ${isPositive ? 'text-accent' : 'text-destructive'}`}>
        <i className={`fas ${isPositive ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
        {percentChange}%
      </span>
    );
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
              
              {/* Export Dropdown */}
              {data && (
                <div className="relative group">
                  <button 
                    className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                    data-testid="export-button"
                  >
                    <i className="fas fa-download"></i>
                    <span className="hidden sm:inline">Export</span>
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                    <div className="py-1">
                      <button
                        onClick={() => exportAllDataToCSV(data.rawData.qualifiedLeads, data.rawData.incomingLeads, data.rawData.appointments)}
                        className="w-full text-left px-4 py-2 hover:bg-secondary text-foreground text-sm flex items-center gap-2"
                        data-testid="export-all"
                      >
                        <i className="fas fa-file-csv"></i>
                        Export All Data
                      </button>
                      <button
                        onClick={() => exportQualifiedLeadsToCSV(data.rawData.qualifiedLeads)}
                        className="w-full text-left px-4 py-2 hover:bg-secondary text-foreground text-sm flex items-center gap-2"
                        data-testid="export-qualified-leads"
                      >
                        <i className="fas fa-user-check"></i>
                        Export Qualified Leads
                      </button>
                      <button
                        onClick={() => exportIncomingLeadsToCSV(data.rawData.incomingLeads)}
                        className="w-full text-left px-4 py-2 hover:bg-secondary text-foreground text-sm flex items-center gap-2"
                        data-testid="export-incoming-leads"
                      >
                        <i className="fas fa-inbox"></i>
                        Export Incoming Leads
                      </button>
                      <button
                        onClick={() => exportAppointmentsToCSV(data.rawData.appointments)}
                        className="w-full text-left px-4 py-2 hover:bg-secondary text-foreground text-sm flex items-center gap-2"
                        data-testid="export-appointments"
                      >
                        <i className="fas fa-calendar"></i>
                        Export Appointments
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Dark Mode Toggle */}
              <button 
                onClick={toggleTheme}
                className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                data-testid="theme-toggle"
                aria-label="Toggle dark mode"
              >
                <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
                <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>
              
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
                  trendIndicator={getTrendIndicator(data.totalLeads, previousMetrics?.totalLeads)}
                />
                
                <MetricCard
                  title="Hot Leads"
                  value={data.hot}
                  description="High-priority prospects"
                  icon={<i className="fas fa-fire"></i>}
                  iconBgColor="bg-destructive/10"
                  iconColor="text-destructive"
                  data-testid="metric-hot-leads"
                  trendIndicator={getTrendIndicator(data.hot, previousMetrics?.hot)}
                />
                
                <MetricCard
                  title="Warm Leads"
                  value={data.warm}
                  description="Medium interest leads"
                  icon={<i className="fas fa-temperature-half"></i>}
                  iconBgColor="bg-warning/10"
                  iconColor="text-warning"
                  data-testid="metric-warm-leads"
                  trendIndicator={getTrendIndicator(data.warm, previousMetrics?.warm)}
                />
                
                <MetricCard
                  title="Cold Leads"
                  value={data.cold}
                  description="Low engagement leads"
                  icon={<i className="fas fa-snowflake"></i>}
                  data-testid="metric-cold-leads"
                  trendIndicator={getTrendIndicator(data.cold, previousMetrics?.cold)}
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
                  trendIndicator={getTrendIndicator(data.appointmentsCount, previousMetrics?.appointmentsCount)}
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
