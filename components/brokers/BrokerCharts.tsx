import React, { useEffect, useRef } from 'react';
import { Broker } from '../../types';
import { Chart } from 'chart.js/auto';

interface BrokerChartsProps {
  broker: Broker;
}

const BrokerCharts: React.FC<BrokerChartsProps> = ({ broker }) => {
  const radarChartRef = useRef<HTMLCanvasElement>(null);
  const barChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstances = useRef<{ radar?: Chart, bar?: Chart }>({});

  useEffect(() => {
    // Cleanup previous chart instances on re-render
    if (chartInstances.current.radar) {
      chartInstances.current.radar.destroy();
    }
    if (chartInstances.current.bar) {
      chartInstances.current.bar.destroy();
    }

    // Radar Chart for Ratings
    if (radarChartRef.current) {
      const radarCtx = radarChartRef.current.getContext('2d');
      if (radarCtx) {
        chartInstances.current.radar = new Chart(radarCtx, {
          type: 'radar',
          data: {
            labels: ['Regulation', 'Costs', 'Platforms', 'Support'],
            datasets: [{
              label: `${broker.name} Ratings`,
              data: [
                broker.ratings.regulation,
                broker.ratings.costs,
                broker.ratings.platforms,
                broker.ratings.support
              ],
              fill: true,
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              borderColor: 'rgb(59, 130, 246)',
              pointBackgroundColor: 'rgb(59, 130, 246)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgb(59, 130, 246)'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              r: {
                angleLines: { color: 'rgba(255, 255, 255, 0.2)' },
                grid: { color: 'rgba(255, 255, 255, 0.2)' },
                pointLabels: { color: '#f8fafc', font: { size: 12 } },
                ticks: {
                  color: '#9ca3af',
                  backdropColor: 'transparent',
                  stepSize: 2,
                  font: { size: 10 }
                },
                suggestedMin: 5,
                suggestedMax: 10
              }
            },
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => `${context.dataset.label}: ${context.raw}`
                }
              }
            }
          }
        });
      }
    }

    // Bar Chart for Spreads
    if (barChartRef.current) {
        const barCtx = barChartRef.current.getContext('2d');
        const industryAverage = { eurusd: 0.6, gbpusd: 0.9, usdjpy: 0.7 };
        if (barCtx) {
            chartInstances.current.bar = new Chart(barCtx, {
                type: 'bar',
                data: {
                    labels: ['EUR/USD', 'GBP/USD', 'USD/JPY'],
                    datasets: [
                        {
                            label: broker.name,
                            data: [broker.tradingConditions.spreads.eurusd, broker.tradingConditions.spreads.gbpusd, broker.tradingConditions.spreads.usdjpy],
                            backgroundColor: 'rgba(59, 130, 246, 0.6)',
                            borderColor: 'rgb(59, 130, 246)',
                            borderWidth: 1
                        },
                        {
                            label: 'Industry Average',
                            data: [industryAverage.eurusd, industryAverage.gbpusd, industryAverage.usdjpy],
                            backgroundColor: 'rgba(107, 114, 128, 0.6)',
                            borderColor: 'rgb(107, 114, 128)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: '#9ca3af' },
                            title: { display: true, text: 'Spreads (pips)', color: '#f8fafc' }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: '#9ca3af' }
                        }
                    },
                    plugins: {
                        legend: { labels: { color: '#f8fafc' } }
                    }
                }
            });
        }
    }

    // Cleanup function
    return () => {
      if (chartInstances.current.radar) chartInstances.current.radar.destroy();
      if (chartInstances.current.bar) chartInstances.current.bar.destroy();
    };
  }, [broker]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6">
      <div className="p-4 bg-input/50 rounded-lg">
        <h3 className="text-lg font-semibold text-center mb-2">Ratings Overview</h3>
        <div className="relative h-64">
          <canvas ref={radarChartRef}></canvas>
        </div>
      </div>
      <div className="p-4 bg-input/50 rounded-lg">
        <h3 className="text-lg font-semibold text-center mb-2">Spread Comparison (pips)</h3>
        <div className="relative h-64">
            <canvas ref={barChartRef}></canvas>
        </div>
      </div>
    </div>
  );
};

export default BrokerCharts;
