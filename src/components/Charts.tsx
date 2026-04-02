
import React from 'react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, 
  ResponsiveContainer, Cell, CartesianGrid, Label
} from 'recharts';
import { CountryData } from '../utils/api';
import { getBandColor } from '../utils/utils';

interface ScatterPlotProps {
  data: CountryData[];
  xKey: string;
  yKey: string;
  xLabel: string;
  yLabel: string;
  title: string;
}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({ data, xKey, yKey, xLabel, yLabel, title }) => {
  const chartData = data.map(c => ({
    name: c.name,
    x: c.indicators[xKey]?.latest_value || 0,
    y: c[yKey as keyof CountryData] as number,
    band: c.visibility_band,
    code: c.code
  })).filter(d => d.x > 0);

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-6">{title}</h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              type="number" 
              dataKey="x" 
              name={xLabel} 
              stroke="#94a3b8" 
              fontSize={12}
              tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(0)}k` : val}
            >
              <Label value={xLabel} position="bottom" offset={0} fill="#64748b" fontSize={12} />
            </XAxis>
            <YAxis 
              type="number" 
              dataKey="y" 
              name={yLabel} 
              stroke="#94a3b8" 
              fontSize={12}
              domain={[0, 100]}
            >
              <Label value={yLabel} angle={-90} position="left" offset={0} fill="#64748b" fontSize={12} />
            </YAxis>
            <ZAxis type="number" range={[50, 400]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }} 
              contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
              itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#94a3b8' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-700 shadow-2xl">
                      <p className="font-bold text-white">{d.name}</p>
                      <p className="text-xs text-slate-400">{xLabel}: {d.x.toLocaleString()}</p>
                      <p className="text-xs text-slate-400">{yLabel}: {d.y.toFixed(1)}</p>
                      <p className="text-xs mt-1" style={{ color: getBandColor(d.band) }}>{d.band}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Countries" data={chartData}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBandColor(entry.band)} fillOpacity={0.6} stroke={getBandColor(entry.band)} strokeWidth={1} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
