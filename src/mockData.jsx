// ── Mock Data for dbsproject ──────────────────────────────────────────────────

export const mockStartups = [
  { id: 1, name: 'GreenLeaf Tech', founder: 'Arjun Mehta', type: 'Private Limited', date: '2024-01-15', stage: 'Growth' },
  { id: 2, name: 'FinBridge', founder: 'Priya Sharma', type: 'LLP', date: '2024-03-22', stage: 'Early' },
  { id: 3, name: 'AgroSmart', founder: 'Ravi Kumar', type: 'OPC', date: '2023-11-05', stage: 'Scaling' },
  { id: 4, name: 'HealthNest', founder: 'Sneha Pillai', type: 'Private Limited', date: '2024-06-01', stage: 'Idea' },
  { id: 5, name: 'EduPath', founder: 'Kiran Desai', type: 'LLP', date: '2023-08-18', stage: 'Growth' },
  { id: 6, name: 'CloudStep', founder: 'Ananya Rao', type: 'Private Limited', date: '2024-09-10', stage: 'Early' },
];

export const mockPolicies = [
  { id: 1, name: 'GST Registration', stage: 'Legal', mandatory: true, estimatedCost: 5000 },
  { id: 2, name: 'MSME Registration', stage: 'Compliance', mandatory: true, estimatedCost: 2000 },
  { id: 3, name: 'Trademark Filing', stage: 'IP', mandatory: false, estimatedCost: 15000 },
  { id: 4, name: 'Shop & Establishment Act', stage: 'Legal', mandatory: true, estimatedCost: 3000 },
  { id: 5, name: 'ISO 9001 Certification', stage: 'Quality', mandatory: false, estimatedCost: 40000 },
  { id: 6, name: 'PF Registration', stage: 'HR', mandatory: true, estimatedCost: 1500 },
  { id: 7, name: 'ESI Registration', stage: 'HR', mandatory: false, estimatedCost: 1500 },
  { id: 8, name: 'FSSAI License', stage: 'Compliance', mandatory: false, estimatedCost: 8000 },
];

export const mockStatuses = {
  1: [ // GreenLeaf Tech
    { policyId: 1, status: 'Completed', actualCost: 4800 },
    { policyId: 2, status: 'Completed', actualCost: 2000 },
    { policyId: 3, status: 'In Progress', actualCost: 12000 },
    { policyId: 4, status: 'Completed', actualCost: 2800 },
    { policyId: 5, status: 'Pending', actualCost: 0 },
    { policyId: 6, status: 'Completed', actualCost: 1500 },
    { policyId: 7, status: 'Pending', actualCost: 0 },
    { policyId: 8, status: 'Pending', actualCost: 0 },
  ],
  2: [ // FinBridge
    { policyId: 1, status: 'Completed', actualCost: 5200 },
    { policyId: 2, status: 'In Progress', actualCost: 1800 },
    { policyId: 3, status: 'Pending', actualCost: 0 },
    { policyId: 4, status: 'Pending', actualCost: 0 },
    { policyId: 5, status: 'Pending', actualCost: 0 },
    { policyId: 6, status: 'Completed', actualCost: 1500 },
    { policyId: 7, status: 'Pending', actualCost: 0 },
    { policyId: 8, status: 'Pending', actualCost: 0 },
  ],
  3: [
    { policyId: 1, status: 'Completed', actualCost: 4900 },
    { policyId: 2, status: 'Completed', actualCost: 2000 },
    { policyId: 3, status: 'Completed', actualCost: 16000 },
    { policyId: 4, status: 'Completed', actualCost: 3100 },
    { policyId: 5, status: 'In Progress', actualCost: 35000 },
    { policyId: 6, status: 'Completed', actualCost: 1500 },
    { policyId: 7, status: 'Completed', actualCost: 1400 },
    { policyId: 8, status: 'Completed', actualCost: 7800 },
  ],
  4: [
    { policyId: 1, status: 'Pending', actualCost: 0 },
    { policyId: 2, status: 'Pending', actualCost: 0 },
    { policyId: 3, status: 'Pending', actualCost: 0 },
    { policyId: 4, status: 'In Progress', actualCost: 2500 },
    { policyId: 5, status: 'Pending', actualCost: 0 },
    { policyId: 6, status: 'Pending', actualCost: 0 },
    { policyId: 7, status: 'Pending', actualCost: 0 },
    { policyId: 8, status: 'Pending', actualCost: 0 },
  ],
  5: [
    { policyId: 1, status: 'Completed', actualCost: 4700 },
    { policyId: 2, status: 'Completed', actualCost: 2000 },
    { policyId: 3, status: 'Completed', actualCost: 14500 },
    { policyId: 4, status: 'Completed', actualCost: 2900 },
    { policyId: 5, status: 'Completed', actualCost: 38000 },
    { policyId: 6, status: 'Completed', actualCost: 1500 },
    { policyId: 7, status: 'In Progress', actualCost: 1200 },
    { policyId: 8, status: 'Pending', actualCost: 0 },
  ],
  6: [
    { policyId: 1, status: 'In Progress', actualCost: 4500 },
    { policyId: 2, status: 'Pending', actualCost: 0 },
    { policyId: 3, status: 'Pending', actualCost: 0 },
    { policyId: 4, status: 'Pending', actualCost: 0 },
    { policyId: 5, status: 'Pending', actualCost: 0 },
    { policyId: 6, status: 'Pending', actualCost: 0 },
    { policyId: 7, status: 'Pending', actualCost: 0 },
    { policyId: 8, status: 'Pending', actualCost: 0 },
  ],
};

export const mockActivity = [
  { id: 1, text: 'GreenLeaf Tech completed GST Registration', time: '2 hours ago' },
  { id: 2, text: 'FinBridge started MSME Registration process', time: '5 hours ago' },
  { id: 3, text: 'AgroSmart completed ISO 9001 Certification', time: '1 day ago' },
  { id: 4, text: 'HealthNest added to the system', time: '2 days ago' },
  { id: 5, text: 'EduPath completed Trademark Filing', time: '3 days ago' },
  { id: 6, text: 'CloudStep started GST Registration', time: '4 days ago' },
];

export const stages = ['Legal', 'Compliance', 'IP', 'Quality', 'HR'];
export const registrationTypes = ['Private Limited', 'LLP', 'OPC', 'Partnership', 'Sole Proprietorship'];
export const startupStages = ['Idea', 'Early', 'Growth', 'Scaling'];
