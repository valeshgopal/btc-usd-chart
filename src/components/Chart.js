import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    Filler,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    TimeScale,
    Filler,
    Title,
    Tooltip,
    Legend
);

const Chart = ({ data }) => {
    const chartData = {
        labels: data.map(point => point[0]),
        datasets: [
            {
                data: data.map(point => point[1]),
                borderColor: 'rgba(75, 64, 238,1)',
                fill: true,
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;

                    if (!chartArea) {
                        return null;
                    }

                    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, 'rgba(75, 64, 238, 0.2)');
                    gradient.addColorStop(1, 'rgba(255,255,255,0.1)');

                    return gradient;
                },
                pointRadius: 0,
            }
        ]
    };

    const options = {
        maintainAspectRatio: false,
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
                external: (context) => {
                    const tooltipModel = context.tooltip;
                    const chart = context.chart;

                    if (tooltipModel.opacity === 0) {
                        const tooltipEl = document.getElementById('chartjs-tooltip');
                        if (tooltipEl) {
                            tooltipEl.style.opacity = 0;
                        }
                        return;
                    }

                    let tooltipEl = document.getElementById('chartjs-tooltip');
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.style.position = 'absolute';
                        tooltipEl.style.background = '#000';
                        tooltipEl.style.color = '#fff';
                        tooltipEl.style.borderRadius = '5px';
                        tooltipEl.style.padding = '10px';
                        tooltipEl.style.pointerEvents = 'none';
                        tooltipEl.style.transition = '0.2s ease';
                        document.body.appendChild(tooltipEl);
                    }

                    // Set the tooltip content
                    tooltipEl.innerHTML = tooltipModel.body.map(item => item.lines).join('<br>');

                    // Position the tooltip at the right end of the chart
                    const positionY = chart.canvas.offsetTop + tooltipModel.caretY;
                    const positionX = chart.canvas.offsetLeft + chart.width - tooltipEl.offsetWidth + 80;

                    tooltipEl.style.opacity = 1;
                    tooltipEl.style.left = positionX + 'px';
                    tooltipEl.style.top = positionY + 'px';
                },
            }
        },
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                },
                ticks: {
                    display: false,
                },
                grid: {
                    display: true
                },
            },
            y: {
                beginAtZero: false,
                ticks: {
                    display: false,
                },
                grid: {
                    display: false
                }
            }
        }
    };

    return (
        <Line
            data={chartData}
            options={options}
            style={{
                maxWidth: '850px',
                maxHeight: '350px',
                width: '100%',
                height: '100%',
            }}
        />
    );
};

export default Chart;
