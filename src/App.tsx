import React, { useState, useMemo } from 'react';
import { servicesData } from './data';
import { Service } from './types';
import ServiceCard from './components/ServiceCard';
import ProjectPlanner from './components/ProjectPlanner';
import { 
  FileText, CheckCircle, Search, HelpCircle, Briefcase, 
  Sparkles, Filter, Database, Menu, X, Terminal, Code, PhoneCall
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Storage of selected service IDs for planner cart
  const [plannerServiceIds, setPlannerServiceIds] = useState<number[]>([]);

  // Mobile Bottom Drawer State for the Planner Cart
  const [isMobilePlannerOpen, setIsMobilePlannerOpen] = useState<boolean>(false);

  // Toggle service in planner list
  const handleTogglePlanner = (serviceId: number) => {
    setPlannerServiceIds(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleRemoveService = (serviceId: number) => {
    setPlannerServiceIds(prev => prev.filter(id => id !== serviceId));
  };

  const handleClearAll = () => {
    setPlannerServiceIds([]);
  };

  // Unique categories for filtering
  const categories = useMemo(() => {
    const cats = new Set(servicesData.map(s => s.category));
    return ['All', ...Array.from(cats)];
  }, []);

  // Filtered Services List
  const filteredServices = useMemo(() => {
    return servicesData.filter(service => {
      // 1. Filter by lead director if selected
      if (selectedLead && service.lead !== selectedLead) return false;

      // 2. Filter by category
      if (selectedCategory !== 'All' && service.category !== selectedCategory) return false;

      // 3. Filter by search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = service.name.toLowerCase().includes(query);
        const matchesDescription = service.description.toLowerCase().includes(query);
        const matchesKeywords = service.keywords.some(keyword => keyword.toLowerCase().includes(query));
        return matchesName || matchesDescription || matchesKeywords;
      }

      return true;
    });
  }, [selectedLead, selectedCategory, searchQuery]);

  // Object mapping for current selected services
  const selectedServicesObjects = useMemo(() => {
    return servicesData.filter(s => plannerServiceIds.includes(s.id));
  }, [plannerServiceIds]);

  return (
    <div className="min-h-screen bg-dark-bg text-gray-100 flex flex-col relative select-none">
      
      {/* Dynamic Background Mesh Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gold-950/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-950/25 blur-[150px]" />
      </div>

      {/* Corporate Header */}
      <header className="sticky top-0 z-40 bg-dark-bg/85 backdrop-blur-md border-b border-dark-border py-4 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-display font-black tracking-[0.25em] text-gold-500">
            BELVO
          </div>
          <div className="hidden sm:block h-4 w-px bg-dark-border" />
          <span className="hidden sm:block text-[10px] font-mono tracking-wider text-gray-400">
            A PERFECT AGENCY FOR YOUR BRAND.
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Section Tracker Header indicator */}
          <span className="text-[10px] font-mono text-gold-400/80 bg-gold-950/20 border border-gold-900/30 px-3 py-1 rounded-full">
            SECTION 03 — RAMIF & ZAID ASSIGNMENT
          </span>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 md:px-12 py-12 z-10">
        
        {/* Title Section */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-gold-500 text-xs font-mono uppercase tracking-[0.2em] mb-3"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scope Directory Blueprint</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight"
          >
            Our Service Offerings
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm mt-3 leading-relaxed"
          >
            Fourteen core digital capabilities managed with pristine strategic execution. Select specific services to create a unified implementation blueprint.
          </motion.p>
        </div>

        {/* Filters and Search Bar Section */}
        <div className="bg-dark-card border border-dark-border rounded-xl p-4 md:p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-5">
          
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <span className="text-[10px] font-mono text-gray-500 uppercase mr-2 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`text-xs font-mono px-3 py-1.5 rounded-md transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-gold-500 text-black font-semibold'
                    : 'bg-dark-bg border border-dark-border text-gray-400 hover:text-white'
                }`}
                id={`filter-btn-${category.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Real-time Keyword & Service Search */}
          <div className="relative w-full md:w-80">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search keyword tags or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-gold-500 transition-colors duration-200 placeholder-gray-500"
              id="service-search-input"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-white"
              >
                ×
              </button>
            )}
          </div>

        </div>

        {/* Dynamic filter descriptor block */}
        {(selectedLead || selectedCategory !== 'All' || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-gray-400 bg-dark-card/50 px-4 py-2.5 rounded-lg border border-dark-border/40 w-fit">
            <span>Showing filtered results:</span>
            {selectedLead && (
              <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono text-[10px]">
                Lead: {selectedLead}
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[10px]">
                Category: {selectedCategory}
              </span>
            )}
            {searchQuery && (
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-mono text-[10px]">
                Search: "{searchQuery}"
              </span>
            )}
            <button
              onClick={() => {
                setSelectedLead(null);
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-[10px] font-mono text-red-400 hover:text-red-300 ml-2 border-b border-red-500/20"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Master 2-Column Grid (Cards Left, Sticky Cart Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Services Cards Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                Service Directory catalog ({filteredServices.length} items matched)
              </span>
            </div>

            {filteredServices.length === 0 ? (
              <div className="bg-dark-card border border-dark-border p-12 text-center rounded-2xl">
                <span className="text-gray-600 block text-2xl mb-2">🔍</span>
                <p className="text-sm font-semibold text-gray-300">No Services Found</p>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  We couldn't find matches for your current keyword parameters. Try searching general tags like "SaaS", "SEO", "CGI", or "React".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    isSelectedInPlanner={plannerServiceIds.includes(service.id)}
                    onTogglePlanner={handleTogglePlanner}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sticky Project Planner Cart (Desktop) */}
          <div className="hidden lg:block">
            <ProjectPlanner
              selectedServices={selectedServicesObjects}
              onRemoveService={handleRemoveService}
              onClearAll={handleClearAll}
            />
          </div>

        </div>

      </main>

      {/* Floating Action Button (Mobile-first planner toggler) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsMobilePlannerOpen(true)}
          className="relative bg-gradient-to-r from-gold-600 to-gold-400 text-black p-4 rounded-full shadow-[0_4px_15px_rgba(206,157,56,0.35)] flex items-center justify-center"
          id="mobile-planner-toggle-btn"
        >
          <Briefcase className="w-6 h-6" />
          {plannerServiceIds.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white font-mono text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {plannerServiceIds.length}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Drawer Overlay for Planner */}
      <AnimatePresence>
        {isMobilePlannerOpen && (
          <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobilePlannerOpen(false)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute bottom-0 left-0 right-0 max-h-[85vh] bg-dark-card border-t border-dark-border rounded-t-3xl overflow-y-auto p-6"
            >
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setIsMobilePlannerOpen(false)}
                  className="p-1 rounded-full bg-dark-bg text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ProjectPlanner
                selectedServices={selectedServicesObjects}
                onRemoveService={handleRemoveService}
                onClearAll={handleClearAll}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Corporate Footprint Info */}
      <footer className="border-t border-dark-border py-8 px-6 md:px-12 bg-dark-card mt-auto text-center md:text-left">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <div>
            <span>© 2026 BELVO AGENCY · FOR INTERNAL AND CLIENT REFERENCE ONLY</span>
          </div>
          <div className="flex gap-4">
            <span>Section 3 lead coordinators:</span>
            <span className="text-amber-400">Creative Lead</span>
            <span className="text-emerald-400">Technical Lead</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
