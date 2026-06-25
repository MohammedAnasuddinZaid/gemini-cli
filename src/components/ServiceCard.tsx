import React, { useState } from 'react';
import { Service } from '../types';
import { 
  Search, Globe, Award, Share2, Hexagon, Sparkles, Palette, Code2, 
  ShoppingBag, Target, Users, Smartphone, Cpu, Zap, 
  ChevronDown, ChevronUp, Check, Plus, Calendar, ShieldAlert 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ServiceCardProps {
  key?: React.Key;
  service: Service;
  isSelectedInPlanner: boolean;
  onTogglePlanner: (serviceId: number) => void;
}

const getIcon = (iconName: string) => {
  const props = { className: "w-5 h-5 text-gold-400 group-hover:scale-110 transition-transform duration-300" };
  switch (iconName) {
    case 'Search': return <Search {...props} />;
    case 'Globe': return <Globe {...props} />;
    case 'Award': return <Award {...props} />;
    case 'Share2': return <Share2 {...props} />;
    case 'Hexagon': return <Hexagon {...props} />;
    case 'Sparkles': return <Sparkles {...props} />;
    case 'Palette': return <Palette {...props} />;
    case 'Code2': return <Code2 {...props} />;
    case 'ShoppingBag': return <ShoppingBag {...props} />;
    case 'Target': return <Target {...props} />;
    case 'Users': return <Users {...props} />;
    case 'Smartphone': return <Smartphone {...props} />;
    case 'Cpu': return <Cpu {...props} />;
    case 'Zap': return <Zap {...props} />;
    default: return <Sparkles {...props} />;
  }
};

export default function ServiceCard({ service, isSelectedInPlanner, onTogglePlanner }: ServiceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCreative = service.lead === 'Creative';

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`relative group rounded-xl border flex flex-col justify-between overflow-hidden transition-all duration-300 ${
        isSelectedInPlanner 
          ? 'border-gold-500 bg-gold-950/5 shadow-[0_0_15px_rgba(212,175,55,0.08)]' 
          : 'border-dark-border bg-dark-card hover:border-gold-500/30'
      }`}
      id={`service-card-${service.id}`}
    >
      {/* Decorative vertical lead line */}
      <div className={`absolute top-0 bottom-0 left-0 w-1 transition-colors duration-300 ${
        isSelectedInPlanner
          ? 'bg-gold-500'
          : isCreative 
            ? 'bg-amber-500/20 group-hover:bg-amber-500/60' 
            : 'bg-emerald-500/20 group-hover:bg-emerald-500/60'
      }`} />

      <div className="p-5 pl-6">
        {/* Card Header Info */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg border transition-all duration-300 ${
              isSelectedInPlanner 
                ? 'border-gold-500/30 bg-gold-950/10' 
                : 'border-dark-border bg-dark-bg group-hover:border-gold-500/20'
            }`}>
              {getIcon(service.iconName)}
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-wider uppercase text-gray-500">
                {service.category}
              </span>
              <h4 className="text-base font-display font-bold text-gray-900 tracking-tight group-hover:text-gold-300 transition-colors duration-200">
                {service.name}
              </h4>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1.5">
            <span className={`text-[10px] font-mono tracking-wide px-2 py-0.5 rounded ${
              isCreative 
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {service.lead} Division
            </span>
          </div>
        </div>

        {/* Tags / Keywords */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {service.keywords.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-dark-bg text-gray-600 border border-dark-border group-hover:border-gold-500/10 transition-colors duration-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Refined Description */}
        <p className="text-xs text-gray-600/90 leading-relaxed mt-4">
          {service.description}
        </p>

        {/* Expanded detail list */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mt-4 pt-4 border-t border-dark-border/60"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-mono text-gold-400 tracking-wider uppercase block mb-1">
                  Core Implementation Features
                </span>
                {service.features.map((feature, i) => (
                  <div key={i} className="flex gap-2 items-start text-xs text-gray-600">
                    <span className="text-gold-500 text-[10px] mt-1">✦</span>
                    <span>{feature}</span>
                  </div>
                ))}
                
                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-dark-border/40 font-mono text-[10px]">
                  <div>
                    <span className="text-gray-500 block">Est. Timeline</span>
                    <span className="text-gray-900 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-gold-500" />
                      {service.estimatedTimeline}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">Execution Complexity</span>
                    <span className={`font-semibold mt-0.5 block ${
                      service.complexity === 'Expert' ? 'text-red-400' :
                      service.complexity === 'High' ? 'text-orange-400' : 'text-blue-400'
                    }`}>
                      {service.complexity} Level
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Action footer */}
      <div className="px-5 pb-5 pt-2 flex items-center gap-3 border-t border-dark-border/40 bg-dark-bg/20">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-[11px] font-mono text-gray-500 hover:text-gray-900 transition-colors duration-200"
          id={`service-expand-btn-${service.id}`}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Hide Scope</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              <span>Expand Scope ({service.features.length} pts)</span>
            </>
          )}
        </button>

        <button
          onClick={() => onTogglePlanner(service.id)}
          className={`ml-auto flex items-center gap-1 text-[11px] font-mono px-3 py-1.5 rounded-md transition-all duration-300 ${
            isSelectedInPlanner
              ? 'bg-gold-500 text-black font-semibold shadow-[0_2px_10px_rgba(212,175,55,0.2)]'
              : 'border border-gold-500/20 text-gold-400 hover:border-gold-500/60 hover:bg-gold-500/5'
          }`}
          id={`service-select-btn-${service.id}`}
        >
          {isSelectedInPlanner ? (
            <>
              <Check className="w-3 h-3" />
              <span>Planned</span>
            </>
          ) : (
            <>
              <Plus className="w-3 h-3" />
              <span>Add to Plan</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
