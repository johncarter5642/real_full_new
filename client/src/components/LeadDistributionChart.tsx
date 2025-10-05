import { useEffect, useRef } from "react";
import { Chart, ChartConfiguration, registerables } from "chart.js";
import { DashboardMetrics } from "@/types/dashboard";

Chart.register(...registerables);

interface LeadDistributionChartProps {
  data: DashboardMetrics;
}

export function LeadDistributionChart({ data }: LeadDistributionChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Destroy existing chart
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const config: ChartConfiguration = {
      type: "doughnut",
      data: {
        labels: ["Hot Leads", "Warm Leads", "Cold Leads"],
        datasets: [{
          data: [data.hot, data.warm, data.cold],
          backgroundColor: [
            "hsl(0 84% 60%)",
            "hsl(38 92% 50%)",
            "hsl(217 91% 60%)"
          ],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 15,
              font: {
                size: 12,
                family: "Inter"
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || "";
                const value = context.parsed || 0;
                const dataArray = context.dataset.data.filter((d): d is number => typeof d === 'number');
                const total = dataArray.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    };

    chartRef.current = new Chart(ctx, config);

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <i className="fas fa-chart-pie text-primary"></i>
        Lead Status Distribution
      </h2>
      <div className="relative h-[300px]">
        <canvas ref={canvasRef} data-testid="lead-distribution-chart"></canvas>
      </div>
    </div>
  );
}
