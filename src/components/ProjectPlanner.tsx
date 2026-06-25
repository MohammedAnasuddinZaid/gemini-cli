import React, { useState, useEffect } from 'react';
import { Service, ProjectInquiry } from '../types';
import { 
  X, Briefcase, Calendar, User, Mail, Building, Landmark, 
  MessageSquare, Send, CheckCircle, Database, HelpCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectPlannerProps {
  selectedServices: Service[];
  onRemoveService: (serviceId: number) => void;
  onClearAll: () => void;
}

export default function ProjectPlanner({ selectedServices, onRemoveService, onClearAll }: ProjectPlannerProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    companyName: '',
    budget: '$10k - $25k',
    projectType: 'One-time Project',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [pastInquiries, setPastInquiries] = useState<ProjectInquiry[]>([]);

  // Load past inquiries from local storage
  useEffect(() => {
    const saved = localStorage.getItem('belvo_inquiries');
    if (saved) {
      try {
        setPastInquiries(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServices.length === 0) return;

    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newInquiry: ProjectInquiry = {
        fullName: formData.fullName,
        email: formData.email,
        companyName: formData.companyName,
        budget: formData.budget,
        selectedServices: selectedServices.map(s => s.id),
        message: formData.message
      };

      const updated = [newInquiry, ...pastInquiries];
      localStorage.setItem('belvo_inquiries', JSON.stringify(updated));
      setPastInquiries(updated);
      
      setIsSubmitting(false);
      setIsSuccess(true);
      onClearAll();
      
      // Reset basic state
      setFormData({
        fullName: '',
        email: '',
        companyName: '',
        budget: '$10k - $25k',
        projectType: 'One-time Project',
        message: ''
      });
    }, 1500);
  };

  // Group services by Lead to display accountability
  const creativeServices = selectedServices.filter(s => s.lead === 'Creative');
  const technicalServices = selectedServices.filter(s => s.lead === 'Technical');

  return (
    <div className="border border-dark-border bg-dark-card rounded-2xl p-6 lg:sticky lg:top-24 h-fit" id="project-planner-container">
      <div className="flex items-center justify-between pb-4 border-b border-dark-border/60">
        <div>
          <h3 className="text-lg font-display font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-gold-500" />
            Project Planner
          </h3>
          <p className="text-[11px] font-mono text-gray-500 mt-1">
            Selected services: {selectedServices.length}
          </p>
        </div>
        {selectedServices.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-[10px] font-mono text-red-400 hover:text-red-300 transition-colors duration-200"
          >
            Clear Selected
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center py-10"
          >
            <div className="w-16 h-16 bg-gold-500/10 border border-gold-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-gold-500" />
            </div>
            <h4 className="text-lg font-display font-bold text-gray-900">Inquiry Received</h4>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed max-w-sm mx-auto">
              Our directors will review your plan coordinates and reach out within 12 business hours.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="mt-6 text-xs font-mono bg-gold-500 text-black px-4 py-2 rounded-md hover:bg-gold-400 transition-colors duration-200 font-semibold"
            >
              Configure Another Blueprint
            </button>
          </motion.div>
        ) : selectedServices.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-gray-300 mb-3 font-mono text-2xl">⚡</div>
            <h4 className="text-sm font-display font-semibold text-gray-600">Your Plan is Empty</h4>
            <p className="text-xs text-gray-400 mt-2 max-w-xs mx-auto leading-relaxed">
              Add specific services from our creative suite or technical suite to map your brand launch.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="planner-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 space-y-6"
          >
            {/* Split Lead Breakdown */}
            <div className="space-y-3 bg-dark-bg/60 p-4 rounded-xl border border-dark-border/40">
              <span className="text-[10px] font-mono text-gold-400 tracking-wider uppercase block">
                Lead Allocation Coordinates
              </span>

              {creativeServices.length > 0 && (
                <div className="flex justify-between items-start text-xs border-b border-dark-border/20 pb-2">
                  <div>
                    <span className="font-semibold text-amber-400 block">Creative Division</span>
                    <span className="text-[10px] text-gray-500">{creativeServices.length} Design & Brand channels</span>
                  </div>
                  <span className="font-mono text-[10px] text-gray-600">Active</span>
                </div>
              )}

              {technicalServices.length > 0 && (
                <div className="flex justify-between items-start text-xs">
                  <div>
                    <span className="font-semibold text-emerald-400 block">Technical Division</span>
                    <span className="text-[10px] text-gray-500">{technicalServices.length} Technical & System channels</span>
                  </div>
                  <span className="font-mono text-[10px] text-gray-600">Active</span>
                </div>
              )}
            </div>

            {/* Selected items chip roster */}
            <div>
              <span className="text-[10px] font-mono text-gray-500 tracking-wider uppercase block mb-2">
                Active Selection Channels
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {selectedServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded bg-dark-bg border border-dark-border text-gray-900 group"
                  >
                    <span className="truncate max-w-[120px]">{service.name}</span>
                    <button
                      onClick={() => onRemoveService(service.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Consultation Form */}
            <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-dark-border/60">
              <span className="text-[10px] font-mono text-gold-400 tracking-wider uppercase block mb-1">
                Book Consultation Call Coordinates
              </span>

              {/* Full Name */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg pl-9 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gold-500 transition-colors duration-200 placeholder-gray-600"
                />
              </div>

              {/* Email Address */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg pl-9 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gold-500 transition-colors duration-200 placeholder-gray-600"
                />
              </div>

              {/* Company Name */}
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Building className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company / Brand Name"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg pl-9 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gold-500 transition-colors duration-200 placeholder-gray-600"
                />
              </div>

              {/* Budget and Project Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-mono text-gray-400 uppercase block mb-1">Est. Budget</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-2 py-1.5 text-[11px] text-gray-900 focus:outline-none focus:border-gold-500"
                  >
                    <option value="<$10k">&lt; $10,000</option>
                    <option value="$10k - $25k">$10k – $25,000</option>
                    <option value="$25k - $50k">$25k – $50,000</option>
                    <option value="$50k+">$50,000 +</option>
                  </select>
                </div>
                <div>
                  <label className="text-[9px] font-mono text-gray-400 uppercase block mb-1">Contract Type</label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleInputChange}
                    className="w-full bg-dark-bg border border-dark-border rounded-lg px-2 py-1.5 text-[11px] text-gray-900 focus:outline-none focus:border-gold-500"
                  >
                    <option value="One-time Project">One-Time Build</option>
                    <option value="Monthly Retainer">Monthly Retainer</option>
                    <option value="Strategic Advisory">Strategic Advisory</option>
                  </select>
                </div>
              </div>

              {/* Message / Brief */}
              <div className="relative">
                <span className="absolute top-2.5 left-0 flex items-start pl-3 text-gray-400">
                  <MessageSquare className="w-4 h-4" />
                </span>
                <textarea
                  name="message"
                  required
                  rows={3}
                  placeholder="Tell us about your project coordinates..."
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full bg-dark-bg border border-dark-border rounded-lg pl-9 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-gold-500 transition-colors duration-200 placeholder-gray-600 resize-none"
                />
              </div>

              {/* Submit Consultation Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-gold-600 to-gold-400 hover:from-gold-500 hover:to-gold-300 text-black font-semibold font-display py-2.5 rounded-lg text-xs transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(206,157,56,0.15)] disabled:opacity-55"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting Blueprint...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Inquiry Blueprint</span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Client-Side Submission Records (Local Storage proof of life) */}
      {pastInquiries.length > 0 && (
        <div className="mt-6 pt-5 border-t border-dark-border/60">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-3">
            <Database className="w-3.5 h-3.5 text-gold-500" />
            <span>Local Blueprint Vault ({pastInquiries.length})</span>
          </div>
          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {pastInquiries.map((inq, index) => (
              <div key={index} className="bg-dark-bg/40 p-2.5 rounded border border-dark-border/40 text-[11px]">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-900">{inq.fullName}</span>
                  <span className="text-[9px] font-mono text-gold-400">{inq.budget}</span>
                </div>
                <p className="text-[10px] text-gray-500 truncate mb-1">Company: {inq.companyName || 'N/A'}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {inq.selectedServices.map(sid => (
                    <span key={sid} className="text-[8px] bg-dark-bg text-gray-600 px-1 rounded">
                      Ch.{sid}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
