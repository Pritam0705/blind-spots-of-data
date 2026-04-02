
import React from 'react';

export const Methodology: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-12 tracking-tight">Methodology</h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-lg text-slate-700 leading-relaxed">
              The Data Visibility Index (DVI) is a composite metric that measures how consistently and comprehensively 
              a country is represented in global development databases. We analyze six core indicators from 
              Our World in Data (OWID) over a 16-year window (2005–2021).
            </p>
            
            <div className="p-8 bg-white rounded-2xl shadow-xl border border-slate-200">
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
            <div className="p-6 rounded-xl bg-white border border-slate-200">
              <h4 className="font-bold mb-2">1. Coverage (40%)</h4>
              <p className="text-sm text-slate-600">Measures if a country is measured at all. High coverage indicates a country is part of the standard global monitoring framework.</p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-slate-200">
              <h4 className="font-bold mb-2">2. Recency (35%)</h4>
              <p className="text-sm text-slate-600">Stale data is a form of invisibility. This component penalizes countries whose latest data points are several years old.</p>
            </div>
            <div className="p-6 rounded-xl bg-white border border-slate-200">
              <h4 className="font-bold mb-2">3. Continuity (25%)</h4>
              <p className="text-sm text-slate-600">Intermittent reporting creates gaps in trend analysis. Continuity rewards consistent, year-on-year data availability.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
