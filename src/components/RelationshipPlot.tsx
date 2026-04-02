import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CountryData } from '../utils/api';
import * as d3 from 'd3';

interface RelationshipPlotProps {
  data: CountryData[];
  metric1: string;
  metric2: string;
  currentYear: number;
}

export const RelationshipPlot: React.FC<RelationshipPlotProps> = ({ data, metric1, metric2, currentYear }) => {
  const plotData = useMemo(() => {
    return data.map(c => {
      const getVal = (m: string) => {
        if (m === 'visibility_index') return c.visibility_index;
        if (m === 'coverage' || m === 'recency' || m === 'continuity') return c.metrics[m as keyof typeof c.metrics] * 100;
        const entry = c.indicators[m]?.history.find(h => h.Year === currentYear);
        return entry ? entry.value : null;
      };

      const v1 = getVal(metric1);
      const v2 = getVal(metric2);

      if (v1 === null || v2 === null) return null;

      return {
        name: c.name,
        x: v1,
        y: v2,
        z: c.visibility_index
      };
    }).filter((d): d is any => d !== null);
  }, [data, metric1, metric2, currentYear]);

  const getLabel = (m: string) => m.replace(/_/g, ' ').toUpperCase();

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white">Relationship Analysis ({currentYear})</h3>
        <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">
          {getLabel(metric1)} vs {getLabel(metric2)}
        </div>
      </div>
      
      <div className="h-full w-full pb-8">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis 
              type="number" 
              dataKey="x" 
              name={getLabel(metric1)} 
              stroke="#475569" 
              fontSize={10}
              label={{ value: getLabel(metric1), position: 'bottom', offset: 0, fill: '#64748b', fontSize: 10 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name={getLabel(metric2)} 
              stroke="#475569" 
              fontSize={10}
              label={{ value: getLabel(metric2), angle: -90, position: 'left', fill: '#64748b', fontSize: 10 }}
            />
            <ZAxis type="number" dataKey="z" range={[50, 400]} name="Visibility" />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg shadow-2xl">
                      <div className="font-bold text-white mb-1">{d.name}</div>
                      <div className="text-xs text-slate-400">{getLabel(metric1)}: <span className="text-blue-400">{d.x.toFixed(1)}</span></div>
                      <div className="text-xs text-slate-400">{getLabel(metric2)}: <span className="text-purple-400">{d.y.toFixed(1)}</span></div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Countries" data={plotData} fill="#3b82f6">
              {plotData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={d3.interpolateViridis(entry.z / 100)} fillOpacity={0.6} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
