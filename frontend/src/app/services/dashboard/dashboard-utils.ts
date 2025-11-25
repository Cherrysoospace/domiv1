export function groupSalesByDate(sales: any[]) {
  const map = new Map<string, { total: number; orders_count: number }>();
  sales.forEach(s => {
    const date = s.date ? s.date.substr(0,10) : (s.created_at ? s.created_at.substr(0,10) : undefined);
    if (!date) return;
    const prev = map.get(date) ?? { total: 0, orders_count: 0 };
    prev.total += Number(s.total ?? s.amount ?? 0);
    prev.orders_count += Number(s.orders_count ?? s.count ?? 1);
    map.set(date, prev);
  });
  const arr = Array.from(map.entries()).map(([date, v]) => ({ date, ...v }));
  arr.sort((a,b) => a.date.localeCompare(b.date));
  return arr;
}

export function groupOrdersByDay(orders: any[]) {
  const map = new Map<string, { orders_count: number; total: number }>();
  orders.forEach(o => {
    const d = o.created_at ? o.created_at.substr(0,10) : undefined;
    if (!d) return;
    const prev = map.get(d) ?? { orders_count: 0, total: 0 };
    prev.orders_count += 1;
    prev.total += Number(o.total_price ?? o.total ?? 0);
    map.set(d, prev);
  });
  const arr = Array.from(map.entries()).map(([date, v]) => ({ date, ...v }));
  arr.sort((a,b) => a.date.localeCompare(b.date));
  return arr;
}

export function formatOrdersByHour(data: any[]) {
  // expects array of {hour: number|string, count: number}
  const hours = Array.from({ length: 24 }).map((_,i) => ({ hour: i, count: 0 }));
  data.forEach(r => {
    const h = Number(r.hour);
    if (isNaN(h) || h < 0 || h > 23) return;
    hours[h].count = Number(r.count ?? r.value ?? 0);
  });
  return hours;
}

export function lastStatePerMotorcycle(states: any[]) {
  // states: [{motorcycle_id, state, timestamp}]
  const map = new Map<any, any>();
  states.forEach(s => {
    const id = s.motorcycle_id ?? s.motorcycleId ?? s.id;
    const ts = s.timestamp ? new Date(s.timestamp).getTime() : 0;
    const prev = map.get(id);
    if (!prev || ts > prev._ts) {
      map.set(id, { ...s, _ts: ts });
    }
  });
  return Array.from(map.values());
}
