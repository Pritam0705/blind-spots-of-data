
import React from 'react';
import { motion } from 'motion/react';
import { Search, Globe, Zap, Database } from 'lucide-react';

const insights = [
  {
    icon: <Search className="text-blue-500" />,
    title: "Patterned Missingness",
    text: "Data gaps are not random. They cluster geographically and socio-politically, creating systemic 'blind spots' in our understanding of global progress."
  },
  {
    icon: <Globe className="text-emerald-500" />,
    title: "Wealth vs. Visibility",
    text: "While GDP correlates with visibility, it doesn't explain everything. Some middle-income nations maintain high visibility through robust statistical offices."
  },
  {
    icon: <Zap className="text-amber-500" />,
    title: "Digital Infrastructure",
    text: "Internet usage is a strong predictor of data recency. Digital connectivity often precedes the ability to report real-time social outcomes."
  },
  {
    icon: <Database className="text-purple-500" />,
    title: "The Reporting Bias",
    text: "International organizations often rely on modeled estimates for countries with low visibility, which can mask the reality of missing ground-truth data."
  }
];

export const InsightCards: React.FC = () => {
  return (
    <section className="py-24 px-6 bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center">Key Findings</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {insights.map((insight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="mb-4">{insight.icon}</div>
              <h3 className="text-xl font-bold mb-3">{insight.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{insight.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
