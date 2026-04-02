
import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { CountryData } from '../utils/api';
import { getBandColor, VISIBILITY_COLORS } from '../utils/utils';
import { cn } from '../utils/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Info, Layers, GitCompare, ChevronDown, Play, Pause, RotateCcw } from 'lucide-react';

interface MapProps {
  data: CountryData[];
  onSelectCountry: (country: CountryData) => void;
  metric: string;
  setMetric: (m: string) => void;
  secondMetric: string | null;
  setSecondMetric: (m: string | null) => void;
  isRelationshipMode: boolean;
  setIsRelationshipMode: (m: boolean) => void;
  currentYear: number;
  setCurrentYear: (y: number | ((prev: number) => number)) => void;
  yearRange: number[];
}

const BIVARIATE_COLORS = [
  ["#e8e8e8", "#ace4e4", "#5ac8c8"], // Low Y (X: 0, 1, 2)
  ["#dfb0d6", "#a5add3", "#5698b9"], // Mid Y
  ["#be64ac", "#8c62aa", "#3b4994"]  // High Y
];

export const WorldMap: React.FC<MapProps> = ({ 
  data, 
  onSelectCountry,
  metric,
  setMetric,
  secondMetric,
  setSecondMetric,
  isRelationshipMode,
  setIsRelationshipMode,
  currentYear,
  setCurrentYear,
  yearRange
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{ x: number, y: number, content: React.ReactNode } | null>(null);
  
  // Timeline state
  const [isPlaying, setIsPlaying] = useState(false);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const availableIndicators = useMemo(() => {
    const indicators = new Set<string>();
    data.forEach(c => {
      Object.keys(c.indicators).forEach(k => indicators.add(k));
    });
    return Array.from(indicators);
  }, [data]);

  const getMetricValueAtYear = (country: CountryData, m: string, year: number) => {
    if (m === 'visibility_index') return country.visibility_index;
    if (m === 'coverage' || m === 'recency' || m === 'continuity') return country.metrics[m as keyof typeof country.metrics] * 100;
    
    const indicator = country.indicators[m];
    if (!indicator) return null;
    
    // Find the value for the specific year
    const entry = indicator.history.find(h => h.Year === year);
    return entry ? entry.value : null;
  };

  const getMetricLabel = (m: string) => {
    return m.replace(/_/g, ' ').toUpperCase();
  };

  // Playback logic
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentYear(prev => {
          if (prev >= yearRange[1]) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 200);
    } else if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, yearRange]);

  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    d3.json('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson').then((data) => {
      setGeoData(data);
    }).catch(err => {
      console.error("Failed to load GeoJSON:", err);
    });
  }, []);

  useEffect(() => {
    if (!svgRef.current || data.length === 0 || !geoData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = 500;
    
    const projection = d3.geoNaturalEarth1()
      .scale(width / 5.5)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Scales
    const colorScale = d3.scaleThreshold<number, string>()
      .domain([40, 60, 80])
      .range([VISIBILITY_COLORS.blind, VISIBILITY_COLORS.low, VISIBILITY_COLORS.moderate, VISIBILITY_COLORS.high]);

    const getIndicatorScale = (m: string) => {
      const allValues: number[] = [];
      data.forEach(c => {
        const ind = c.indicators[m];
        if (ind) ind.history.forEach(h => allValues.push(h.value));
      });
      const min = d3.min(allValues) || 0;
      const max = d3.max(allValues) || 100;
      return d3.scaleLinear().domain([min, max]).range([0, 2]);
    };

    const scale1 = getIndicatorScale(metric);
    const scale2 = secondMetric ? getIndicatorScale(secondMetric) : null;

    const g = svg.append('g');

    g.selectAll('path')
      .data(geoData.features)
      .enter()
      .append('path')
      .attr('d', path as any)
      .attr('fill', (d: any) => {
        const country = data.find(c => c.code === d.id);
        if (!country) return '#1f2937';
        
        const v1 = getMetricValueAtYear(country, metric, currentYear);
        
        if (isRelationshipMode && secondMetric && scale2) {
          const v2 = getMetricValueAtYear(country, secondMetric, currentYear);
          if (v1 === null || v2 === null) return '#1f2937';
          
          const x = Math.min(2, Math.max(0, Math.round(scale1(v1))));
          const y = Math.min(2, Math.max(0, Math.round(scale2(v2))));
          return BIVARIATE_COLORS[y][x];
        }

        if (metric === 'visibility_index') {
          return colorScale(country.visibility_index);
        }
        
        if (v1 === null) return '#1f2937';
        return d3.interpolateBlues(v1 / 100);
      })
      .attr('stroke', '#0f172a')
      .attr('stroke-width', 0.5)
      .style('cursor', 'pointer')
      .on('mouseover', (event, d: any) => {
        const country = data.find(c => c.code === d.id);
        if (country) {
          const v1 = getMetricValueAtYear(country, metric, currentYear);
          const v2 = secondMetric ? getMetricValueAtYear(country, secondMetric, currentYear) : null;
          
          setTooltip({
            x: event.pageX,
            y: event.pageY,
            content: (
              <div className="flex flex-col gap-1">
                <div className="font-bold border-bottom border-slate-700 pb-1 mb-1">{country.name} ({currentYear})</div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400 text-xs">{getMetricLabel(metric)}:</span>
                  <span className="text-white font-mono">{v1 !== null ? v1.toFixed(1) : 'No Data'}</span>
                </div>
                {isRelationshipMode && secondMetric && (
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400 text-xs">{getMetricLabel(secondMetric)}:</span>
                    <span className="text-white font-mono">{v2 !== null ? v2.toFixed(1) : 'No Data'}</span>
                  </div>
                )}
                {!isRelationshipMode && metric === 'visibility_index' && (
                  <div className="text-[10px] text-blue-400 mt-1 uppercase tracking-tighter">{country.visibility_band}</div>
                )}
              </div>
            )
          });
        }
        d3.select(event.currentTarget).attr('stroke-width', 1.5).attr('stroke', '#fff');
      })
      .on('mouseout', (event) => {
        setTooltip(null);
        d3.select(event.currentTarget).attr('stroke-width', 0.5).attr('stroke', '#0f172a');
      })
      .on('click', (event, d: any) => {
        const country = data.find(c => c.code === d.id);
        if (country) onSelectCountry(country);
      });

    // Zoom
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    
    svg.call(zoom as any);
  }, [data, metric, secondMetric, isRelationshipMode, currentYear, geoData]);

  return (
    <div className="relative bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl overflow-hidden">
      <div className="flex flex-wrap items-start justify-between mb-8 gap-6">
        <div className="flex-1 min-w-[300px]">
          <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
            Global Visibility Explorer
            <Info size={16} className="text-slate-500 cursor-help" />
          </h3>
          <p className="text-slate-400 text-sm">
            {isRelationshipMode 
              ? `Analyzing the relationship between ${getMetricLabel(metric)} and ${getMetricLabel(secondMetric || '')}`
              : `Visualizing ${getMetricLabel(metric)} across nations`}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setIsRelationshipMode(false)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2",
                !isRelationshipMode ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
              )}
            >
              <Layers size={14} />
              Single
            </button>
            <button
              onClick={() => {
                setIsRelationshipMode(true);
                if (!secondMetric) setSecondMetric(availableIndicators[0] || 'visibility_index');
              }}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-2",
                isRelationshipMode ? "bg-purple-600 text-white shadow-lg" : "text-slate-400 hover:text-white"
              )}
            >
              <GitCompare size={14} />
              Relationship
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative group">
              <select 
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                className="appearance-none bg-slate-800 text-white text-xs px-4 py-2 pr-8 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer hover:bg-slate-750 transition-colors"
              >
                <optgroup label="Core Metrics">
                  <option value="visibility_index">Visibility Index</option>
                  <option value="coverage">Coverage</option>
                  <option value="recency">Recency</option>
                  <option value="continuity">Continuity</option>
                </optgroup>
                <optgroup label="Indicators">
                  {availableIndicators.map(k => (
                    <option key={k} value={k}>{getMetricLabel(k)}</option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>

            {isRelationshipMode && (
              <div className="relative group">
                <select 
                  value={secondMetric || ''}
                  onChange={(e) => setSecondMetric(e.target.value)}
                  className="appearance-none bg-slate-800 text-white text-xs px-4 py-2 pr-8 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer hover:bg-slate-750 transition-colors"
                >
                  <optgroup label="Core Metrics">
                    <option value="visibility_index">Visibility Index</option>
                    <option value="coverage">Coverage</option>
                    <option value="recency">Recency</option>
                    <option value="continuity">Continuity</option>
                  </optgroup>
                  <optgroup label="Indicators">
                    {availableIndicators.map(k => (
                      <option key={k} value={k}>{getMetricLabel(k)}</option>
                    ))}
                  </optgroup>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative h-[500px]">
        <svg ref={svgRef} className="w-full h-full"></svg>
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 flex flex-col gap-2 bg-slate-950/90 backdrop-blur p-4 rounded-xl border border-slate-800 shadow-2xl">
          {!isRelationshipMode ? (
            <>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">
                {metric === 'visibility_index' ? 'Visibility Index' : getMetricLabel(metric)}
              </div>
              {metric === 'visibility_index' ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: VISIBILITY_COLORS.high }}></div>
                    <span className="text-xs text-slate-300">High (80+)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: VISIBILITY_COLORS.moderate }}></div>
                    <span className="text-xs text-slate-300">Moderate (60-80)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: VISIBILITY_COLORS.low }}></div>
                    <span className="text-xs text-slate-300">Low (40-60)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: VISIBILITY_COLORS.blind }}></div>
                    <span className="text-xs text-slate-300">Blind Spot (&lt;40)</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="h-2 w-32 bg-gradient-to-r from-slate-800 to-blue-600 rounded-full"></div>
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>Low</span>
                    <span>High</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Bivariate Relationship</div>
              <div className="relative w-24 h-24 flex flex-col-reverse">
                <div className="grid grid-cols-3 grid-rows-3 w-full h-full">
                  {BIVARIATE_COLORS.map((row, y) => (
                    row.map((color, x) => (
                      <div key={`${x}-${y}`} style={{ backgroundColor: color }} className="w-full h-full"></div>
                    ))
                  )).reverse()}
                </div>
                <div className="absolute -left-6 top-1/2 -rotate-90 text-[8px] text-slate-400 whitespace-nowrap">
                  {getMetricLabel(secondMetric || '').slice(0, 15)}...
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[8px] text-slate-400 whitespace-nowrap">
                  {getMetricLabel(metric).slice(0, 15)}...
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Timeline Controls */}
        <div className="absolute bottom-4 right-4 left-4 md:left-auto md:w-96 bg-slate-950/90 backdrop-blur p-4 rounded-xl border border-slate-800 shadow-2xl flex items-center gap-4">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-full transition-colors shadow-lg"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
          </button>
          
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              <span>{yearRange[0]}</span>
              <span className="text-blue-400 text-sm">{currentYear}</span>
              <span>{yearRange[1]}</span>
            </div>
            <input 
              type="range" 
              min={yearRange[0]} 
              max={yearRange[1]} 
              value={currentYear} 
              onChange={(e) => {
                setCurrentYear(parseInt(e.target.value));
                setIsPlaying(false);
              }}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <button 
            onClick={() => {
              setCurrentYear(yearRange[0]);
              setIsPlaying(false);
            }}
            className="p-2 text-slate-400 hover:text-white transition-colors"
            title="Reset to start"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ left: tooltip.x + 15, top: tooltip.y + 15 }}
            className="fixed z-50 pointer-events-none bg-slate-950/95 backdrop-blur text-white px-4 py-3 rounded-xl border border-slate-700 shadow-2xl text-sm"
          >
            {tooltip.content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
