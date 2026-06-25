export interface Service {
  id: number;
  name: string;
  category: string;
  lead: 'Creative' | 'Technical';
  keywords: string[];
  description: string;
  iconName: string;
  features: string[];
  estimatedTimeline: string;
  complexity: 'Medium' | 'High' | 'Expert';
}

export interface ProjectInquiry {
  fullName: string;
  email: string;
  companyName: string;
  budget: string;
  selectedServices: number[];
  message: string;
}
