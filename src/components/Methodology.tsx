
import React from 'react';

export const Methodology: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto">
        <div className="text-4xl font-bold mb-12 tracking-tight text-blue-600">Methodology</div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-slate-700 leading-relaxed">
              The Data Visibility Index (DVI) is a composite metric that measures how consistently and comprehensively 
              a country is represented in global development databases.
            </p>
            
            <div className="p-4 bg-white rounded-2xl shadow-xl border border-slate-300">
              <div className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">The Formula</div>
              <div className="text-2xl font-serif italic text-slate-800">
                DVI = 100 × (0.40 × C + 0.35 × R + 0.25 × K)
              </div>
              <div className="mt-6 space-y-2 text-sm text-slate-500">
                <p><strong>C (Coverage):</strong> Fraction of indicators available.</p>
                <p><strong>R (Recency):</strong> Proximity of the latest data point to the current year.</p>
                <p><strong>K (Continuity):</strong> Consistency of reporting across the time window.</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white border border-slate-300">
              <div className="font-bold mb-2 text-blue-600">1. Coverage (40%)</div>
              <p className="text-sm text-slate-600">Measures if a country is measured at all. High coverage indicates a country is part of the standard global monitoring framework.</p>
              <div className="w-full text-sm text-slate-600 font-mono bg-slate-100 p-2 rounded mt-2 italic border border-slate-200">C = (indicators with data) / (total indicators)</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-300">
              <div className="font-bold mb-2 text-blue-600">2. Recency (35%)</div>
              <p className="text-sm text-slate-600">Stale data is a form of invisibility. This component penalizes countries whose latest data points are several years old.</p>
              <div className="w-full text-sm text-slate-600 font-mono bg-slate-100 p-2 rounded mt-2 italic border border-slate-200">R = avg[1 - (global latest year - country latest year) / 3]</div>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-300">
              <div className="font-bold mb-2 text-blue-600">3. Continuity (25%)</div>
              <p className="text-sm text-slate-600">Intermittent reporting creates gaps in trend analysis. Continuity rewards consistent, year-on-year data availability.</p>
              <div className="w-full text-sm text-slate-600 font-mono bg-slate-100 p-2 rounded mt-2 italic border border-slate-200">K = avg[(country data years) / (global indicator years)]</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
