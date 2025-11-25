import { Component, OnInit, OnDestroy } from '@angular/core';
import Chart from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { groupSalesByDate, groupOrdersByDay, formatOrdersByHour, lastStatePerMotorcycle } from 'src/app/services/dashboard/dashboard-utils';
import { parseOptions, chartOptions } from 'src/app/variables/charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private charts: Chart[] = [];
  public chartTitles: string[] = [
    'Ventas por día',
    'Pedidos por día',
    'Pedidos por hora (intra-día)',
    'Productos por categoría',
    'Pedidos entregados por conductor',
    'Nivel de batería por motocicleta',
    'Porcentaje de productos por categoría',
    'Estado de los pedidos',
    'Estado actual de la flota'
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    // Apply global chart defaults from variables/charts
    try { parseOptions(Chart, chartOptions()); } catch (e) { /* ignore if parse fails */ }

    // Register a small plugin to draw percentages inside doughnut/pie slices
    try {
      (Chart as any).plugins.register({
        afterDraw: function(chart: any) {
          if (chart.config.type !== 'doughnut' && chart.config.type !== 'pie') return;
          const ctx = chart.chart.ctx;
          const dataset = chart.config.data.datasets[0];
          const meta = chart.getDatasetMeta(0);
          const total = dataset.data.reduce((a:any,b:any)=>a+b,0);

          const parseColor = (c: string) => {
            if (!c) return { r: 0, g: 0, b: 0 };
            // hex
            if (c[0] === '#') {
              const hex = c.replace('#','');
              const bigint = parseInt(hex.length === 3 ? hex.split('').map(ch=>ch+ch).join('') : hex, 16);
              return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
            }
            // rgb/rgba
            const m = c.match(/rgba?\(([^)]+)\)/);
            if (m) {
              const parts = m[1].split(',').map(p=>parseFloat(p));
              return { r: parts[0], g: parts[1], b: parts[2] };
            }
            return { r: 0, g: 0, b: 0 };
          };

          const luminance = (r:number,g:number,b:number) => {
            // relative luminance
            const a = [r,g,b].map(v=>{ v/=255; return v<=0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055,2.4); });
            return 0.2126*a[0] + 0.7152*a[1] + 0.0722*a[2];
          };

          meta.data.forEach((arc: any, i: number) => {
            const model = arc._model;
            const sliceAngle = model.endAngle - model.startAngle;
            // skip tiny slices (avoid overlapping labels)
            if (sliceAngle < 0.12) return;
            const midAngle = model.startAngle + sliceAngle / 2;
            const r = (model.innerRadius + model.outerRadius) / 2;
            const x = model.x + Math.cos(midAngle) * r;
            const y = model.y + Math.sin(midAngle) * r;
            const value = dataset.data[i];
            const pct = total ? Math.round((value / total) * 100) : 0;

            // choose contrasting text color based on slice color
            let bg = Array.isArray(dataset.backgroundColor) ? dataset.backgroundColor[i] : dataset.backgroundColor;
            const rgb = parseColor(String(bg));
            const lum = luminance(rgb.r, rgb.g, rgb.b);
            const textColor = lum > 0.5 ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.95)';

            ctx.save();
            ctx.fillStyle = textColor;
            // smaller font for tight spaces
            ctx.font = (sliceAngle < 0.3 ? '600 11px Open Sans, sans-serif' : '600 12px Open Sans, sans-serif');
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(pct + '%', x, y);
            ctx.restore();
          });
        }
      });
    } catch (e) { /* ignore plugin errors */ }

    // Load all required datasets and render charts
    this.initSalesByDay();
    this.initOrdersByDay();
    this.initOrdersByHour();
    this.initProductsByCategory();
    this.initOrdersByDriver();
    this.initMotorcycleBattery();
    this.initProductsCategoryPie();
    this.initOrdersStatusPie();
    this.initMotorcycleFleetPie();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    // destroy charts
    this.charts.forEach(c => c.destroy());
  }

  private createChart(id: string, config: any, setup?: (ctx: CanvasRenderingContext2D, cfg: any)=>void) {
    const el = document.getElementById(id) as HTMLCanvasElement;
    if (!el) return null;
    const ctx = el.getContext('2d') as CanvasRenderingContext2D;
    if (setup) {
      try { setup(ctx, config); } catch (e) { /* continue */ }
    }
    const chart = new Chart(ctx as any, config);
    this.charts.push(chart);
    return chart;
  }

  private initSalesByDay() {
    this.dashboardService.getSales().pipe(takeUntil(this.destroy$)).subscribe(sales => {
      const grouped = groupSalesByDate(sales);
      const labels = grouped.map(r => r.date);
      const data = grouped.map(r => Number(r.total));
      const opts = {
        type: 'line',
        data: { labels, datasets: [{ label: 'Ventas (COP)', data, borderColor: '#5e72e4', backgroundColor: 'rgba(94,114,228,0.2)', pointRadius: 3, lineTension: 0.4, borderWidth: 3 }] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          elements: { line: { tension: 0.4 } },
          scales: {
            xAxes: [{ gridLines: { color: 'rgba(0,0,0,0.03)', lineWidth: 1 } }],
            yAxes: [{ gridLines: { color: 'rgba(0,0,0,0.03)', lineWidth: 1 }, ticks: { callback: (v:any)=> new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(v) } }]
          },
          tooltips: { mode: 'index', intersect: false, callbacks: {
            label: function(tooltipItem:any) {
              const idx = tooltipItem.index || 0;
              const row = grouped[idx];
              const value = new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(row.total);
              return `${value} — ${row.orders_count} pedidos`;
            }
          }}
        }
      };

      this.createChart('sales-by-day', opts, (ctx, cfg) => {
        // gradient fill
        const grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        grad.addColorStop(0, 'rgba(94,114,228,0.35)');
        grad.addColorStop(1, 'rgba(94,114,228,0.02)');
        cfg.data.datasets[0].backgroundColor = grad;
        cfg.data.datasets[0].borderColor = '#5e72e4';
      });
    });
  }

  private initOrdersByDay() {
    this.dashboardService.getOrders().pipe(takeUntil(this.destroy$)).subscribe(orders => {
      const grouped = groupOrdersByDay(orders);
      const labels = grouped.map(r => r.date);
      const counts = grouped.map(r => r.orders_count);
      const totals = grouped.map(r => r.total);
      // Improved visual: smooth curve, gradient fill, visible points and formatted y-axis
      // compute integer-friendly ticks for Y axis
      const maxCount = counts && counts.length ? Math.max(...counts) : 0;
      const stepCount = maxCount <= 10 ? 1 : Math.ceil(maxCount / 10);
      const yMax = Math.ceil((maxCount || 1) / stepCount) * stepCount+10;

      const opts = {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Pedidos',
            data: counts,
            borderColor: '#24a19c',
            backgroundColor: 'rgba(36,161,156,0.15)',
            pointBackgroundColor: '#24a19c',
            pointBorderColor: '#fff',
            pointRadius: 10,
            pointHoverRadius: 6,
            lineTension: 0.4,
            borderWidth: 3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: { duration: 800, easing: 'easeOutQuart' },
          scales: {
            xAxes: [{ gridLines: { color: 'rgba(0,0,0,0.03)' }, ticks: { fontSize: 11 } }],
            yAxes: [{ gridLines: { color: 'rgba(0,0,0,0.03)' }, ticks: { beginAtZero: true, stepSize: stepCount, max: 10, callback: (v:any)=> Number(v).toFixed(0) } }]
          },
          tooltips: {
            mode: 'index',
            intersect: false,
            callbacks: {
              label: function(tooltipItem: any) {
                const idx = tooltipItem.index || 0;
                const row = grouped[idx];
                const total = new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(row.total);
                return row.orders_count + ' pedidos — ' + total;
              }
            }
          }
        }
      };

      // if there's no data, draw a small placeholder so the canvas doesn't look broken
      if (!labels || labels.length === 0) {
        const placeholder = {
          type: 'line',
          data: { labels: ['No data'], datasets: [{ label: 'Pedidos', data: [0], borderColor: '#24a19c', backgroundColor: 'rgba(36,161,156,0.08)', pointRadius: 0, borderWidth: 1 }] },
          options: { responsive: true, maintainAspectRatio: false }
        };
        this.createChart('orders-by-day', placeholder);
      } else {
        this.createChart('orders-by-day', opts, (ctx, cfg) => {
          const grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
          grad.addColorStop(0, 'rgba(36,161,156,0.35)');
          grad.addColorStop(1, 'rgba(36,161,156,0.02)');
          cfg.data.datasets[0].backgroundColor = grad;
        });
      }
    });
  }

  private initOrdersByHour(date?: string) {
    const d = date ?? new Date().toISOString().substr(0,10);
    this.dashboardService.getOrdersByHour(d).pipe(takeUntil(this.destroy$)).subscribe(data => {
      const hours = formatOrdersByHour(data);
      const labels = hours.map(h => String(h.hour));
      const counts = hours.map(h => h.count);
      const opts = {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Pedidos por hora', data: counts, backgroundColor: '#f5365c', maxBarThickness: 36, borderRadius: 6 }] },
        options: { responsive: true, maintainAspectRatio:false, scales: { xAxes:[{ gridLines:{ display:false } }], yAxes:[{ gridLines:{ color:'rgba(0,0,0,0.03)' }, ticks:{ beginAtZero:true } }] }, tooltips:{ callbacks:{ label: function(tooltipItem:any){ return `Hora ${tooltipItem.xLabel}: ${tooltipItem.yLabel} pedidos`; } } } }
      };

      this.createChart('orders-by-hour', opts);
    });
  }

  private initProductsByCategory() {
    this.dashboardService.getProductCategories().pipe(takeUntil(this.destroy$)).subscribe(data => {
      const labels = data.map((d: any) => d.name);
      const counts = data.map((d: any) => Number(d.products_count ?? d.count ?? 0));
      const opts = {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Productos', data: counts, backgroundColor: '#fb6340', borderRadius:6, maxBarThickness:40 }] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{ gridLines: { display: false } }],
            yAxes: [{ gridLines: { color: 'rgba(0,0,0,0.03)' }, ticks: { min: 0, max: 15, stepSize: 1, callback: (v:any) => Number(v).toFixed(0) } }]
          }
        }
      };

      this.createChart('products-by-category', opts);
    });
  }

  private initOrdersByDriver() {
    this.dashboardService.getOrders().pipe(takeUntil(this.destroy$)).subscribe(orders => {
      const map = new Map<string, number>();
      orders.forEach(o => {
        const driver = (o.driver && o.driver.name) ? o.driver.name : (o.driver_id ?? 'unknown');
        map.set(driver, (map.get(driver) ?? 0) + 1);
      });
      const entries = Array.from(map.entries()).sort((a,b) => b[1]-a[1]);
      const labels = entries.map(e => e[0]);
      const counts = entries.map(e => e[1]);
      // compute integer-friendly ticks for Y axis (like motorcycle battery chart)
      const maxCount = counts && counts.length ? Math.max(...counts) : 0;
      const stepCount = maxCount <= 10 ? 1 : Math.ceil(maxCount / 10);
      const yMax = Math.ceil((maxCount || 1) / stepCount) * stepCount+10;

      const opts = {
        type: 'bar',
        data: { labels, datasets: [{ label: 'Pedidos entregados', data: counts, backgroundColor: '#2dce89', borderRadius: 6, maxBarThickness: 40 }] },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{ gridLines: { display: false } }],
            yAxes: [{ gridLines: { color: 'rgba(0,0,0,0.03)' }, ticks: { beginAtZero: true, stepSize: stepCount, max: 10, callback: (v:any) => Number(v).toFixed(0) } }]
          }
        }
      };

      this.createChart('orders-by-driver', opts);
    });
  }

  private initMotorcycleBattery() {
    this.dashboardService.getMotorcycles().pipe(takeUntil(this.destroy$)).subscribe(motos => {
      const labels = motos.map((m: any) => m.plate ?? m.id);
      const batteries = motos.map((m: any) => Number(m.battery_level ?? 0));
      const opts = { type:'bar', data:{ labels, datasets:[{ label:'Nivel batería (%)', data:batteries, backgroundColor:'#11cdef', borderRadius:6, maxBarThickness:40 }] }, options:{ responsive:true, maintainAspectRatio:false, scales:{ yAxes:[{ ticks:{ beginAtZero:true, callback:(v:any)=> v + '%' }, gridLines:{ color:'rgba(0,0,0,0.03)' } }], xAxes:[{ gridLines:{ display:false } }] } } };
      this.createChart('motorcycle-battery', opts);
    });
  }

  private initProductsCategoryPie() {
    this.dashboardService.getProductCategories().pipe(takeUntil(this.destroy$)).subscribe(data => {
      const labels = data.map((d: any) => d.name);
      const counts = data.map((d: any) => Number(d.products_count ?? d.count ?? 0));
      const colors = ['#8AA6FF','#A6F0EB','#B8EFCB','#FFD1B8','#FFB8C2'];
        const opts = {
          type: 'doughnut',
          data: { labels, datasets: [{ data: counts, backgroundColor: colors, borderWidth: 2 }] },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 70,
            tooltips: {
              callbacks: {
                label: function(tooltipItem: any, data: any) {
                  const v = data.datasets[0].data[tooltipItem.index];
                  const total = data.datasets[0].data.reduce((a: any, b: any) => a + b, 0);
                  const pct = ((v / total) * 100).toFixed(1);
                  return data.labels[tooltipItem.index] + ': ' + v + ' (' + pct + '%)';
                }
              }
            }
          }
        };
      this.createChart('products-category-pie', opts);
    });
  }

  private initOrdersStatusPie() {
    this.dashboardService.getOrders().pipe(takeUntil(this.destroy$)).subscribe(orders => {
      const map = new Map<string, number>();
      orders.forEach(o => map.set(o.status, (map.get(o.status) ?? 0) + 1));
      const labels = Array.from(map.keys());
      const counts = Array.from(map.values());
      const colors = ['#2dce89','#11cdef','#fb6340','#f5365c'];
        const opts = {
          type: 'doughnut',
          data: { labels, datasets: [{ data: counts, backgroundColor: colors, borderWidth: 2 }] },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 70,
            tooltips: {
              callbacks: {
                label: function(tooltipItem: any, data: any) {
                  const v = data.datasets[0].data[tooltipItem.index];
                  const total = data.datasets[0].data.reduce((a: any, b: any) => a + b, 0);
                  const pct = ((v / total) * 100).toFixed(1);
                  return data.labels[tooltipItem.index] + ': ' + v + ' (' + pct + '%)';
                }
              }
            }
          }
        };
      this.createChart('orders-status-pie', opts);
    });
  }

  private initMotorcycleFleetPie() {
    this.dashboardService.getMotorcycleStates().pipe(takeUntil(this.destroy$)).subscribe(states => {
      const last = lastStatePerMotorcycle(states);
      const map = new Map<string, number>();
      last.forEach(s => map.set(s.state, (map.get(s.state) ?? 0) + 1));
      const labels = Array.from(map.keys());
      const counts = Array.from(map.values());
      const colors = ['#8AA6FF','#A6F0EB','#FFB8C2','#FFD1B8'];
        const opts = {
          type: 'doughnut',
          data: { labels, datasets: [{ data: counts, backgroundColor: colors, borderWidth: 2 }] },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 70,
            tooltips: {
              callbacks: {
                label: function(tooltipItem: any, data: any) {
                  const v = data.datasets[0].data[tooltipItem.index];
                  const total = data.datasets[0].data.reduce((a: any, b: any) => a + b, 0);
                  const pct = ((v / total) * 100).toFixed(1);
                  return data.labels[tooltipItem.index] + ': ' + v + ' (' + pct + '%)';
                }
              }
            }
          }
        };
      this.createChart('motorcycle-fleet-pie', opts);
    });
  }

}
