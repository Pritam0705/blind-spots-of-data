
import React from 'react';
import { motion } from 'motion/react';

export const Abstract: React.FC = () => {
  return (
    <section id="abstract" className="py-24 px-6 bg-white text-slate-900">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-6">Abstract</div>
          <p className="text-2xl md:text-3xl font-serif leading-relaxed text-slate-800 italic">
            "Global data systems are often presented as comprehensive mirrors of human progress. 
            However, significant portions of the world remain invisible to these systems. 
            This project introduces the <span className="text-blue-600 font-bold">Data Visibility Index</span>, 
            a metric designed to quantify the 'missingness' of nations in international datasets. 
            By analyzing coverage, recency, and continuity across key human development indicators, 
            we map the blind spots of global data and reveal how invisibility patterns correlate 
            with wealth, digital infrastructure, and systemic neglect."
          </p>
        </motion.div>
      </div>
    </section>
  );
};
