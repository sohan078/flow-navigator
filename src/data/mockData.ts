export interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  hq: string;
  website: string;
  people: number;
  revenue: string;
  capabilities: string[];
  partners: string[];
  verticals: string[];
  deliveryGeo: string[];
  revenueGeo: string[];
  customers: string[];
  investors: string[];
  skills: string[];
  founded: number;
  status: 'pipeline' | 'shortlisted' | 'declined' | 'recommended';
  maScore: number;
  maScores: {
    founderLiquidity: number;
    stagnation: number;
    activity: number;
    partnerAcquisition: number;
  };
  socialLinks: { linkedin?: string; twitter?: string };
  management: { name: string; title: string; linkedin?: string }[];
}

export interface Mandate {
  id: string;
  title: string;
  strategy: string;
  capabilities: string[];
  partners: string[];
  verticals: string[];
  revenueGeo: string[];
  deliveryGeo: string[];
  peopleScale: string;
  estRevenue: string;
  hq: string;
  goToMarket: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  matchingCompanies: number;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  date: string;
  category: string;
  summary: string;
}

export interface Notification {
  id: string;
  type: 'mandate' | 'pipeline' | 'profile' | 'deliverable' | 'watchlist';
  action: 'created' | 'updated' | 'deleted';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  read: boolean;
}

export const companies: Company[] = [
  {
    id: '1', name: 'TechNova Solutions', logo: '🏢',
    description: 'Full-stack digital transformation consultancy specializing in cloud-native applications and AI-driven analytics.',
    hq: 'San Francisco, USA', website: 'https://technova.io', people: 450, revenue: '$45M',
    capabilities: ['Cloud Migration', 'AI/ML', 'Data Analytics', 'DevOps'],
    partners: ['AWS', 'Snowflake', 'Databricks'],
    verticals: ['Healthcare', 'Fintech', 'Retail'],
    deliveryGeo: ['USA', 'India', 'UK'],
    revenueGeo: ['North America', 'Europe'],
    customers: ['JPMorgan', 'Walgreens', 'Blue Cross'],
    investors: ['Sequoia Capital'],
    skills: ['Python', 'React', 'Kubernetes', 'Terraform'],
    founded: 2015, status: 'recommended', maScore: 82,
    maScores: { founderLiquidity: 78, stagnation: 65, activity: 88, partnerAcquisition: 85 },
    socialLinks: { linkedin: '#', twitter: '#' },
    management: [
      { name: 'Sarah Chen', title: 'CEO & Co-Founder', linkedin: '#' },
      { name: 'Raj Patel', title: 'CTO', linkedin: '#' },
    ],
  },
  {
    id: '2', name: 'DataPulse Analytics', logo: '📊',
    description: 'Enterprise data platform company focused on real-time analytics and business intelligence solutions.',
    hq: 'London, UK', website: 'https://datapulse.co', people: 280, revenue: '$32M',
    capabilities: ['Business Intelligence', 'Data Engineering', 'Real-time Analytics'],
    partners: ['Azure', 'Tableau', 'Confluent'],
    verticals: ['Banking', 'Insurance', 'Telecom'],
    deliveryGeo: ['UK', 'Germany', 'India'],
    revenueGeo: ['Europe', 'Middle East'],
    customers: ['Barclays', 'Allianz', 'Vodafone'],
    investors: ['Accel Partners'],
    skills: ['Scala', 'Spark', 'Kafka', 'SQL'],
    founded: 2017, status: 'recommended', maScore: 76,
    maScores: { founderLiquidity: 70, stagnation: 72, activity: 80, partnerAcquisition: 78 },
    socialLinks: { linkedin: '#' },
    management: [
      { name: 'James Wright', title: 'CEO', linkedin: '#' },
      { name: 'Priya Sharma', title: 'VP Engineering', linkedin: '#' },
    ],
  },
  {
    id: '3', name: 'CloudBridge Systems', logo: '☁️',
    description: 'Managed cloud infrastructure provider with expertise in multi-cloud orchestration and security.',
    hq: 'Toronto, Canada', website: 'https://cloudbridge.io', people: 180, revenue: '$22M',
    capabilities: ['Cloud Infrastructure', 'Security', 'Managed Services'],
    partners: ['GCP', 'AWS', 'HashiCorp'],
    verticals: ['SaaS', 'E-commerce', 'Media'],
    deliveryGeo: ['Canada', 'USA'],
    revenueGeo: ['North America'],
    customers: ['Shopify', 'Wealthsimple'],
    investors: ['OMERS Ventures'],
    skills: ['Go', 'Terraform', 'AWS', 'GCP'],
    founded: 2018, status: 'pipeline', maScore: 71,
    maScores: { founderLiquidity: 60, stagnation: 55, activity: 82, partnerAcquisition: 90 },
    socialLinks: { linkedin: '#', twitter: '#' },
    management: [
      { name: 'Michael Torres', title: 'Founder & CEO', linkedin: '#' },
    ],
  },
  {
    id: '4', name: 'NeuralEdge AI', logo: '🧠',
    description: 'AI-first product company building NLP and computer vision solutions for enterprise customers.',
    hq: 'Berlin, Germany', website: 'https://neuraledge.ai', people: 120, revenue: '$15M',
    capabilities: ['NLP', 'Computer Vision', 'MLOps', 'AI Consulting'],
    partners: ['NVIDIA', 'Hugging Face'],
    verticals: ['Automotive', 'Manufacturing', 'Logistics'],
    deliveryGeo: ['Germany', 'Poland', 'Romania'],
    revenueGeo: ['Europe'],
    customers: ['BMW', 'Siemens', 'DHL'],
    investors: ['EQT Ventures'],
    skills: ['Python', 'PyTorch', 'TensorFlow', 'MLflow'],
    founded: 2019, status: 'shortlisted', maScore: 88,
    maScores: { founderLiquidity: 85, stagnation: 40, activity: 92, partnerAcquisition: 95 },
    socialLinks: { linkedin: '#' },
    management: [
      { name: 'Dr. Anna Müller', title: 'CEO', linkedin: '#' },
      { name: 'Lars Becker', title: 'CTO', linkedin: '#' },
    ],
  },
  {
    id: '5', name: 'FinCore Technologies', logo: '💰',
    description: 'Fintech infrastructure company providing payment processing and regulatory compliance tools.',
    hq: 'Singapore', website: 'https://fincore.tech', people: 350, revenue: '$55M',
    capabilities: ['Payment Processing', 'RegTech', 'API Development'],
    partners: ['Stripe', 'Plaid', 'Mastercard'],
    verticals: ['Banking', 'Payments', 'Crypto'],
    deliveryGeo: ['Singapore', 'India', 'Philippines'],
    revenueGeo: ['Asia Pacific', 'Middle East'],
    customers: ['DBS Bank', 'GrabPay'],
    investors: ['Temasek', 'GIC'],
    skills: ['Java', 'Kotlin', 'React', 'PostgreSQL'],
    founded: 2016, status: 'recommended', maScore: 74,
    maScores: { founderLiquidity: 68, stagnation: 58, activity: 85, partnerAcquisition: 80 },
    socialLinks: { linkedin: '#', twitter: '#' },
    management: [
      { name: 'Wei Lin', title: 'CEO & Founder', linkedin: '#' },
    ],
  },
  {
    id: '6', name: 'CyberShield Corp', logo: '🛡️',
    description: 'Cybersecurity firm specializing in threat detection, incident response, and compliance automation.',
    hq: 'Austin, USA', website: 'https://cybershield.com', people: 200, revenue: '$28M',
    capabilities: ['Threat Detection', 'Incident Response', 'Compliance'],
    partners: ['CrowdStrike', 'Splunk', 'Palo Alto'],
    verticals: ['Government', 'Healthcare', 'Finance'],
    deliveryGeo: ['USA', 'Israel'],
    revenueGeo: ['North America', 'Europe'],
    customers: ['US DoD', 'Kaiser Permanente'],
    investors: ['Insight Partners'],
    skills: ['Rust', 'Python', 'SIEM', 'Zero Trust'],
    founded: 2014, status: 'recommended', maScore: 79,
    maScores: { founderLiquidity: 82, stagnation: 70, activity: 75, partnerAcquisition: 72 },
    socialLinks: { linkedin: '#' },
    management: [
      { name: 'David Katz', title: 'CEO', linkedin: '#' },
      { name: 'Emily Rodriguez', title: 'CISO', linkedin: '#' },
    ],
  },
  {
    id: '7', name: 'GreenStack Energy', logo: '🌿',
    description: 'CleanTech software company building energy management and carbon tracking platforms.',
    hq: 'Amsterdam, Netherlands', website: 'https://greenstack.io', people: 95, revenue: '$12M',
    capabilities: ['Energy Management', 'Carbon Tracking', 'IoT'],
    partners: ['Siemens', 'Schneider Electric'],
    verticals: ['Energy', 'Real Estate', 'Manufacturing'],
    deliveryGeo: ['Netherlands', 'Germany', 'UK'],
    revenueGeo: ['Europe'],
    customers: ['Shell', 'Unilever'],
    investors: ['Northzone'],
    skills: ['TypeScript', 'Node.js', 'IoT', 'React'],
    founded: 2020, status: 'recommended', maScore: 85,
    maScores: { founderLiquidity: 90, stagnation: 30, activity: 95, partnerAcquisition: 88 },
    socialLinks: { linkedin: '#', twitter: '#' },
    management: [
      { name: 'Sophie van Dijk', title: 'CEO & Co-Founder', linkedin: '#' },
    ],
  },
  {
    id: '8', name: 'HealthSync Digital', logo: '🏥',
    description: 'Digital health platform connecting patients, providers, and payers through interoperable health data.',
    hq: 'Boston, USA', website: 'https://healthsync.io', people: 310, revenue: '$38M',
    capabilities: ['Health IT', 'Interoperability', 'Telehealth', 'EHR Integration'],
    partners: ['Epic', 'Cerner', 'AWS'],
    verticals: ['Healthcare', 'Life Sciences'],
    deliveryGeo: ['USA', 'Canada'],
    revenueGeo: ['North America'],
    customers: ['Mayo Clinic', 'CVS Health'],
    investors: ['a16z Bio'],
    skills: ['FHIR', 'HL7', 'React', 'Python'],
    founded: 2017, status: 'declined', maScore: 62,
    maScores: { founderLiquidity: 50, stagnation: 75, activity: 60, partnerAcquisition: 55 },
    socialLinks: { linkedin: '#' },
    management: [
      { name: 'Dr. Robert Kim', title: 'CEO', linkedin: '#' },
      { name: 'Lisa Park', title: 'COO', linkedin: '#' },
    ],
  },
];

export const mandates: Mandate[] = [
  {
    id: '1',
    title: 'Cloud & Data Analytics Acquisition',
    strategy: 'Revenue Acquisition',
    capabilities: ['Cloud Migration', 'Data Analytics', 'AI/ML'],
    partners: ['AWS', 'Snowflake', 'Databricks'],
    verticals: ['Healthcare', 'Fintech'],
    revenueGeo: ['North America', 'Europe'],
    deliveryGeo: ['USA', 'India', 'UK'],
    peopleScale: '100-500',
    estRevenue: '$10M-$50M',
    hq: 'USA',
    goToMarket: 'Direct Sales',
    description: 'Acquire cloud-native data analytics firms to expand our enterprise data capabilities and customer base in North America and Europe.',
    createdAt: '2026-02-15',
    updatedAt: '2026-03-05',
    matchingCompanies: 156,
  },
  {
    id: '2',
    title: 'European AI Talent Acqui-hire',
    strategy: 'Team Acquisition',
    capabilities: ['NLP', 'Computer Vision', 'MLOps'],
    partners: ['NVIDIA', 'Hugging Face'],
    verticals: ['Automotive', 'Manufacturing'],
    revenueGeo: ['Europe'],
    deliveryGeo: ['Germany', 'Poland', 'Romania'],
    peopleScale: '50-200',
    estRevenue: '$5M-$20M',
    hq: 'Germany',
    goToMarket: 'Partner-led',
    description: 'Identify and acquire AI-focused engineering teams in Europe to accelerate our ML product roadmap.',
    createdAt: '2026-01-20',
    updatedAt: '2026-03-01',
    matchingCompanies: 89,
  },
  {
    id: '3',
    title: 'Cybersecurity Platform Roll-up',
    strategy: 'Capability Acquisition',
    capabilities: ['Threat Detection', 'Incident Response', 'Compliance'],
    partners: ['CrowdStrike', 'Splunk'],
    verticals: ['Government', 'Finance'],
    revenueGeo: ['North America'],
    deliveryGeo: ['USA', 'Israel'],
    peopleScale: '100-300',
    estRevenue: '$20M-$50M',
    hq: 'USA',
    goToMarket: 'Direct Sales',
    description: 'Roll-up strategy to build comprehensive cybersecurity platform through acquisitions of specialized security firms.',
    createdAt: '2026-02-01',
    updatedAt: '2026-03-06',
    matchingCompanies: 42,
  },
  {
    id: '4',
    title: 'APAC Fintech Expansion',
    strategy: 'Geographic Expansion',
    capabilities: ['Payment Processing', 'RegTech', 'API Development'],
    partners: ['Stripe', 'Plaid'],
    verticals: ['Banking', 'Payments'],
    revenueGeo: ['Asia Pacific'],
    deliveryGeo: ['Singapore', 'India'],
    peopleScale: '200-500',
    estRevenue: '$30M-$60M',
    hq: 'Singapore',
    goToMarket: 'Channel Partners',
    description: 'Expand into Asia-Pacific fintech market through strategic acquisitions of payment and compliance technology companies.',
    createdAt: '2026-03-01',
    updatedAt: '2026-03-07',
    matchingCompanies: 67,
  },
];

export const newsItems: NewsItem[] = [
  { id: '1', title: 'Global M&A Activity Rebounds in Q1 2026', source: 'Reuters', date: '2026-03-06', category: 'M&A', summary: 'Worldwide M&A deal volume rose 23% in the first quarter, driven by tech and healthcare sectors.' },
  { id: '2', title: 'AI Startups See Record Acquisition Interest', source: 'TechCrunch', date: '2026-03-05', category: 'Tech', summary: 'Strategic acquirers are increasingly targeting AI-native companies for talent and technology capabilities.' },
  { id: '3', title: 'European Cloud Market Consolidation Accelerates', source: 'Financial Times', date: '2026-03-04', category: 'Cloud', summary: 'Major cloud providers ramp up acquisition strategies across Europe as market matures.' },
  { id: '4', title: 'Cybersecurity M&A Hits $15B in 2025', source: 'Bloomberg', date: '2026-03-03', category: 'Security', summary: 'Cybersecurity acquisitions reached record levels as enterprises prioritize security capabilities.' },
  { id: '5', title: 'APAC Fintech Deal Flow Surges 40%', source: 'Nikkei Asia', date: '2026-03-02', category: 'Fintech', summary: 'Southeast Asian fintech companies see unprecedented acquisition interest from global banks.' },
];

export const notifications: Notification[] = [
  { id: '1', type: 'mandate', action: 'created', title: 'New Mandate Created', description: 'APAC Fintech Expansion mandate was created', timestamp: '2026-03-07T10:30:00', user: 'John Smith', read: false },
  { id: '2', type: 'pipeline', action: 'updated', title: 'Pipeline Updated', description: 'NeuralEdge AI moved to Shortlisted', timestamp: '2026-03-07T09:15:00', user: 'Sarah Johnson', read: false },
  { id: '3', type: 'profile', action: 'updated', title: 'Company Profile Updated', description: 'TechNova Solutions profile was refreshed with latest financials', timestamp: '2026-03-06T16:45:00', user: 'System', read: true },
  { id: '4', type: 'deliverable', action: 'created', title: 'New Deliverable', description: 'Investment memo generated for CloudBridge Systems', timestamp: '2026-03-06T14:20:00', user: 'Mike Chen', read: true },
  { id: '5', type: 'watchlist', action: 'updated', title: 'Watchlist Alert', description: 'GreenStack Energy published new funding announcement', timestamp: '2026-03-06T11:00:00', user: 'System', read: true },
];

export const strategies = [
  'Revenue Acquisition',
  'Team Acquisition',
  'Capability Acquisition',
  'Geographic Expansion',
  'Vertical Integration',
  'Platform Consolidation',
];

export const allCapabilities = [
  'Cloud Migration', 'AI/ML', 'Data Analytics', 'DevOps', 'Business Intelligence',
  'Data Engineering', 'Real-time Analytics', 'Cloud Infrastructure', 'Security',
  'Managed Services', 'NLP', 'Computer Vision', 'MLOps', 'AI Consulting',
  'Payment Processing', 'RegTech', 'API Development', 'Threat Detection',
  'Incident Response', 'Compliance', 'Energy Management', 'Carbon Tracking',
  'IoT', 'Health IT', 'Interoperability', 'Telehealth', 'EHR Integration',
];

export const allPartners = [
  'AWS', 'Azure', 'GCP', 'Snowflake', 'Databricks', 'Tableau', 'Confluent',
  'HashiCorp', 'NVIDIA', 'Hugging Face', 'Stripe', 'Plaid', 'Mastercard',
  'CrowdStrike', 'Splunk', 'Palo Alto', 'Siemens', 'Schneider Electric',
  'Epic', 'Cerner',
];

export const allVerticals = [
  'Healthcare', 'Fintech', 'Retail', 'Banking', 'Insurance', 'Telecom',
  'SaaS', 'E-commerce', 'Media', 'Automotive', 'Manufacturing', 'Logistics',
  'Government', 'Finance', 'Energy', 'Real Estate', 'Life Sciences',
  'Payments', 'Crypto',
];

export const allGeos = [
  'North America', 'Europe', 'Asia Pacific', 'Middle East', 'Latin America',
  'Africa', 'USA', 'UK', 'Germany', 'India', 'Canada', 'Singapore',
  'Israel', 'Netherlands', 'Poland', 'Romania', 'Philippines',
];
