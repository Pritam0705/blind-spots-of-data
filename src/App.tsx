
import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Hero } from './components/Hero';
import { Abstract } from './components/Abstract';
import { WorldMap } from './components/WorldMap';
import { CountryDetail } from './components/CountryDetail';
import { Methodology } from './components/Methodology';
import { RelationshipPlot } from './components/RelationshipPlot';
import { fetchAllData, CountryData } from './utils/api';
import { Loader2, AlertCircle } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<CountryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  
  // Shared state for metrics and timeline
  const [metric1, setMetric1] = useState('visibility_index');
  const [metric2, setMetric2] = useState<string | null>(null);
  const [isRelationshipMode, setIsRelationshipMode] = useState(false);
  const [currentYear, setCurrentYear] = useState<number>(2021);

  const yearRange = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    data.forEach(c => {
      Object.values(c.indicators).forEach(ind => {
        if (ind) {
          ind.history.forEach(h => {
            if (h.Year < min) min = h.Year;
            if (h.Year > max) max = h.Year;
          });
        }
      });
    });
    if (min === Infinity) return [2000, 2021];
    return [min, max];
  }, [data]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchAllData();
        setData(result);
        
        // Set initial year to latest available
        let maxYear = -Infinity;
        result.forEach(c => {
          Object.values(c.indicators).forEach(ind => {
            if (ind) ind.history.forEach(h => { if (h.Year > maxYear) maxYear = h.Year; });
          });
        });
        if (maxYear !== -Infinity) setCurrentYear(maxYear);
      } catch (err) {
        console.error(err);
        setError("Failed to load visualization data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="text-slate-400 animate-pulse">Processing global data visibility...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h2 className="text-2xl font-bold mb-2">Data Unavailable</h2>
        <p className="text-slate-400 max-w-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans selection:bg-blue-500/30">
      <Hero />
      <Abstract />
      
      {/* Narrative Section 1 */}
      <section className="py-24 px-6 bg-slate-900">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              The Illusion of a Complete World
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed mb-6">
              When we look at global maps of GDP, health, or education, we often assume the colors represent 
              a complete picture of reality. But beneath the numbers lies a hidden dimension: 
              the frequency and quality of measurement itself.
            </p>
            <p className="text-lg text-slate-400 leading-relaxed">
              Invisibility is not just a lack of data; it is a lack of political and infrastructure priority. 
              Countries that are not measured are countries that cannot be effectively served by global policy.
            </p>
          </motion.div>
          <div className="relative aspect-square bg-slate-800 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-4 border-blue-500/20 rounded-full animate-ping"></div>
                <div className="absolute w-48 h-48 border-4 border-blue-500/40 rounded-full animate-pulse"></div>
                <Globe className="text-blue-500" size={120} />
             </div>
          </div>
        </div>
      </section>

      {/* Main Visualization Section */}
      <section className="py-24 px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">A New Map of Visibility</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Explore the Data Visibility Index (DVI) across the globe. Use the timeline to travel through history and see how measurement has evolved.
            </p>
          </div>
          
          <div className="space-y-12">
            <WorldMap 
              data={data} 
              onSelectCountry={setSelectedCountry}
              metric={metric1}
              setMetric={setMetric1}
              secondMetric={metric2}
              setSecondMetric={setMetric2}
              isRelationshipMode={isRelationshipMode}
              setIsRelationshipMode={setIsRelationshipMode}
              currentYear={currentYear}
              setCurrentYear={setCurrentYear}
              yearRange={yearRange}
            />

            {isRelationshipMode && metric2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <RelationshipPlot 
                  data={data}
                  metric1={metric1}
                  metric2={metric2}
                  currentYear={currentYear}
                />
              </motion.div>
            )}
          </div>
        </div>
      </section>

      <Methodology />

      {/* Final Takeaway */}
      <section className="py-32 px-6 bg-blue-600 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-6xl font-bold mb-8 leading-tight"
          >
            “The greatest bias in data is not only what we measure, but what we never measure at all.”
          </motion.h2>
          <p className="text-xl text-blue-100 opacity-80">
            Blind Spots of Data Project • 2026 Academic Visualization Competition
          </p>
        </div>
      </section>

      <footer className="py-12 px-6 bg-slate-950 border-t border-slate-900 text-center text-slate-500 text-sm">
        <p>© 2026 Academic Visualization Project. Data sourced from Our World in Data.</p>
      </footer>

      <CountryDetail country={selectedCountry} onClose={() => setSelectedCountry(null)} />
    </div>
  );
}

const Globe = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20"/><path d="M2 12h20"/><path d="M12 2a14.5 14.5 0 0 1 0 20"/><path d="M2 12a14.5 14.5 0 0 0 20 0"/><path d="M2 12a14.5 14.5 0 0 1 20 0"/>
  </svg>
);
