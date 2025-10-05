import { ReactNode } from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  className?: string;
  trendIndicator?: ReactNode;
}

export function MetricCard({ 
  title, 
  value, 
  description, 
  icon, 
  iconBgColor = "bg-primary/10", 
  iconColor = "text-primary",
  className = "",
  trendIndicator
}: MetricCardProps) {
  return (
    <div className={`metric-card bg-card rounded-lg p-6 shadow-sm border border-border ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
          {title}
        </div>
        <div className={`w-10 h-10 ${iconBgColor} rounded-full flex items-center justify-center`}>
          <span className={iconColor}>{icon}</span>
        </div>
      </div>
      <div className="text-3xl font-bold text-foreground flex items-center">
        {value}
        {trendIndicator}
      </div>
      <p className="text-xs text-muted-foreground mt-2">{description}</p>
    </div>
  );
}
