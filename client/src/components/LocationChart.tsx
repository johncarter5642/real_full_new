import { useEffect, useRef } from "react";
import { Chart, ChartConfiguration, registerables } from "chart.js";
import { DashboardMetrics } from "@/types/dashboard";

Chart.register(...registerables);

interface LocationChartProps {
  data: DashboardMetrics;
}

export function LocationChart({ data }: LocationChartProps) {
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

    const locations = Object.keys(data.leadsByLocation);
    const counts = Object.values(data.leadsByLocation);

    const config: ChartConfiguration = {
      type: "bar",
      data: {
        labels: locations,
        datasets: [{
          label: "Number of Leads",
          data: counts,
          backgroundColor: "hsl(217 91% 60%)",
          borderRadius: 6,
          maxBarThickness: 60
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `Leads: ${context.parsed.y}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              font: {
                family: "Inter"
              }
            },
            grid: {
              color: "hsl(214 32% 91%)"
            }
          },
          x: {
            ticks: {
              font: {
                family: "Inter"
              }
            },
            grid: {
              display: false
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
        <i className="fas fa-chart-bar text-primary"></i>
        Leads by Location
      </h2>
      <div className="relative h-[300px]">
        <canvas ref={canvasRef} data-testid="location-chart"></canvas>
      </div>
    </div>
  );
}
