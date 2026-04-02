
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, AlertCircle, Calendar, BarChart3, Layers, TrendingUp } from 'lucide-react';
import { CountryData } from '../utils/api';
import { getBandColor } from '../utils/utils';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts';

interface CountryDetailProps {
  country: CountryData | null;
  onClose: () => void;
}

export const CountryDetail: React.FC<CountryDetailProps> = ({ country, onClose }) => {
  if (!country) return null;

  const indicators = Object.entries(country.indicators);
  const missing = indicators.filter(([_, val]) => val === null);
  const present = indicators.filter(([_, val]) => val !== null);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full md:w-96 bg-slate-950 border-l border-slate-800 shadow-2xl z-50 overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">{country.name}</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400">
              <X size={24} />
            </button>
          </div>

          <div className="mb-8 p-4 rounded-xl border border-slate-800 bg-slate-900/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Visibility Index</span>
              <span className="text-3xl font-bold text-white">{country.visibility_index.toFixed(1)}</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${country.visibility_index}%` }}
                className="h-full"
                style={{ backgroundColor: getBandColor(country.visibility_band) }}
              />
            </div>
            <p className="mt-3 text-sm font-bold uppercase tracking-widest" style={{ color: getBandColor(country.visibility_band) }}>
              {country.visibility_band}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-8">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <Layers size={16} className="mx-auto mb-2 text-blue-400" />
              <div className="text-[10px] text-slate-500 uppercase font-bold">Coverage</div>
              <div className="text-sm font-bold text-white">{(country.metrics.coverage * 100).toFixed(0)}%</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <Calendar size={16} className="mx-auto mb-2 text-emerald-400" />
              <div className="text-[10px] text-slate-500 uppercase font-bold">Recency</div>
              <div className="text-sm font-bold text-white">{(country.metrics.recency * 100).toFixed(0)}%</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
              <BarChart3 size={16} className="mx-auto mb-2 text-amber-400" />
              <div className="text-[10px] text-slate-500 uppercase font-bold">Continuity</div>
              <div className="text-sm font-bold text-white">{(country.metrics.continuity * 100).toFixed(0)}%</div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <TrendingUp size={14} /> Historical Trends
              </h4>
              <div className="space-y-4">
                {present.map(([name, val]) => (
                  <div key={name} className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm text-white font-medium capitalize">{name.replace(/_/g, ' ')}</div>
                      <div className="text-sm font-mono text-blue-400">{val?.latest_value.toLocaleString()}</div>
                    </div>
                    
                    <div className="h-24 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={val?.history}>
                          <Line 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#3b82f6" 
                            strokeWidth={2} 
                            dot={false} 
                            isAnimationActive={false}
                          />
                          <YAxis hide domain={['auto', 'auto']} />
                          <XAxis dataKey="Year" hide />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                            itemStyle={{ color: '#3b82f6', fontSize: '10px' }}
                            labelStyle={{ color: '#94a3b8', fontSize: '10px' }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>{val?.history[0]?.Year}</span>
                      <span>{val?.history[val.history.length - 1]?.Year}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {missing.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <AlertCircle size={14} className="text-red-500" /> Missing Data
                </h4>
                <div className="flex flex-wrap gap-2">
                  {missing.map(([name]) => (
                    <span key={name} className="px-2 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded text-[10px] font-bold uppercase tracking-tighter">
                      {name.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
