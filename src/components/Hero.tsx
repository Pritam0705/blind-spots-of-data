
import React from 'react';
import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 max-w-4xl"
      >
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
          Blind Spots of Data
        </h1>
        <h2 className="text-xl md:text-3xl font-light text-slate-400 mb-8 tracking-wide uppercase">
          Mapping the World We Fail to Measure
        </h2>
        <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
          The world we analyze is not simply the world as it is, but the world as it is measured. 
          Explore the hidden gaps in global data systems.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => document.getElementById('abstract')?.scrollIntoView({ behavior: 'smooth' })}
          className="px-8 py-4 bg-white text-slate-950 font-semibold rounded-full hover:bg-slate-200 transition-colors"
        >
          Explore the Visualization
        </motion.button>
      </motion.div>
      
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-500"
      >
        <ArrowDown size={32} />
      </motion.div>
    </section>
  );
};
