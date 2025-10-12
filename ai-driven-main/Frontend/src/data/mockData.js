// Mock data for AI Driven Returns Optimizer Dashboard

export const user = {
  name: "Rohan Mehta",
  email: "rohan.mehta@email.com",
  profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  riskProfile: "Moderate",
  // KEY CHANGE: Updated to match the new currentPortfolio end value
  totalInvestment: 500000,
  currentValue: 565000,
  totalReturns: 65000,
  returnPercentage: 13.0,
  joinDate: "2023-01-15"
};

export const pastAnalyses = [
  {
    id: 1,
    title: "10-Year Moderate Risk Plan",
    date: "2024-09-15",
    summary: "Balanced mix of stocks, bonds, and gold for steady growth",
    // KEY CHANGE: New distinct starting amount and growth curve
    investmentAmount: 400000,
    tenure: "10 years",
    riskProfile: "Moderate",
    allocation: { stocks: 40, bonds: 35, gold: 15, realEstate: 10 },
    expectedReturns: 8.5,
    returnsData: [
      { month: "Jan", value: 400000 },
      { month: "Feb", value: 403000 },
      { month: "Mar", value: 406500 },
      { month: "Apr", value: 410000 },
      { month: "May", value: 414000 },
      { month: "Jun", value: 418000 },
      { month: "Jul", value: 422500 },
      { month: "Aug", value: 427000 },
      { month: "Sep", value: 431000 },
      { month: "Oct", value: 435000 },
      { month: "Nov", value: 438000 },
      { month: "Dec", value: 442000 }
    ],
    monthlyReturns: [
      { month: "Jan", returns: 0 }, { month: "Feb", returns: 0.75 }, { month: "Mar", returns: 0.87 },
      { month: "Apr", returns: 0.86 }, { month: "May", returns: 0.98 }, { month: "Jun", returns: 0.97 },
      { month: "Jul", returns: 1.08 }, { month: "Aug", returns: 1.07 }, { month: "Sep", returns: 0.94 },
      { month: "Oct", returns: 0.93 }, { month: "Nov", returns: 0.69 }, { month: "Dec", returns: 0.91 }
    ]
  },
  {
    id: 2,
    title: "5-Year High Risk Portfolio",
    date: "2024-10-01",
    summary: "Aggressive growth plan focusing on equities and emerging markets",
    // KEY CHANGE: New distinct starting amount and aggressive growth curve
    investmentAmount: 200000,
    tenure: "5 years",
    riskProfile: "High",
    allocation: { stocks: 70, bonds: 10, gold: 10, realEstate: 10 },
    expectedReturns: 12.5,
    returnsData: [
      { month: "Jan", value: 200000 },
      { month: "Feb", value: 204000 },
      { month: "Mar", value: 210000 },
      { month: "Apr", value: 215000 },
      { month: "May", value: 222000 },
      { month: "Jun", value: 228000 },
      { month: "Jul", value: 236000 },
      { month: "Aug", value: 242000 },
      { month: "Sep", value: 250000 },
      { month: "Oct", value: 256000 },
      { month: "Nov", value: 261000 },
      { month: "Dec", value: 268000 }
    ],
    monthlyReturns: [
      { month: "Jan", returns: 0 }, { month: "Feb", returns: 2.0 }, { month: "Mar", returns: 2.9 },
      { month: "Apr", returns: 2.4 }, { month: "May", returns: 3.3 }, { month: "Jun", returns: 2.7 },
      { month: "Jul", returns: 3.5 }, { month: "Aug", returns: 2.5 }, { month: "Sep", returns: 3.3 },
      { month: "Oct", returns: 2.4 }, { month: "Nov", returns: 2.0 }, { month: "Dec", returns: 2.7 }
    ]
  },
  {
    id: 3,
    title: "Conservative Retirement Plan",
    date: "2024-08-20",
    summary: "Low-risk portfolio for retirement planning with stable returns",
    // KEY CHANGE: This high-value, low-growth curve is now very distinct
    investmentAmount: 750000,
    tenure: "15 years",
    riskProfile: "Low",
    allocation: { stocks: 25, bonds: 50, gold: 15, realEstate: 10 },
    expectedReturns: 6.2,
    returnsData: [
      { month: "Jan", value: 750000 },
      { month: "Feb", value: 752000 },
      { month: "Mar", value: 754500 },
      { month: "Apr", value: 756500 },
      { month: "May", value: 759000 },
      { month: "Jun", value: 761000 },
      { month: "Jul", value: 763500 },
      { month: "Aug", value: 765500 },
      { month: "Sep", value: 768000 },
      { month: "Oct", value: 770000 },
      { month: "Nov", value: 772500 },
      { month: "Dec", value: 775000 }
    ],
    monthlyReturns: [
      { month: "Jan", returns: 0 }, { month: "Feb", returns: 0.27 }, { month: "Mar", returns: 0.33 },
      { month: "Apr", returns: 0.26 }, { month: "May", returns: 0.33 }, { month: "Jun", returns: 0.26 },
      { month: "Jul", returns: 0.33 }, { month: "Aug", returns: 0.26 }, { month: "Sep", returns: 0.33 },
      { month: "Oct", returns: 0.26 }, { month: "Nov", returns: 0.32 }, { month: "Dec", returns: 0.32 }
    ]
  }
];

export const currentPortfolio = {
  allocation: { stocks: 45, bonds: 30, gold: 15, realEstate: 10 },
  // KEY CHANGE: New distinct growth curve for the user's current holdings
  totalValue: 565000,
  totalInvestment: 500000,
  totalReturns: 65000,
  returnPercentage: 13.0,
  monthlyGrowth: [
    { month: "Jan", value: 500000 },
    { month: "Feb", value: 506000 },
    { month: "Mar", value: 510000 },
    { month: "Apr", value: 517000 },
    { month: "May", value: 524000 },
    { month: "Jun", value: 529000 },
    { month: "Jul", value: 535000 },
    { month: "Aug", value: 542000 },
    { month: "Sep", value: 549000 },
    { month: "Oct", value: 554000 },
    { month: "Nov", value: 560000 },
    { month: "Dec", value: 565000 }
  ]
};

export const assetClasses = [
  { name: "Stocks", color: "#2563eb", description: "Equity investments" },
  { name: "Bonds", color: "#10b981", description: "Fixed income securities" },
  { name: "Gold", color: "#facc15", description: "Precious metals" },
  { name: "Real Estate", color: "#f97316", description: "Property investments" }
];

export const riskProfiles = {
  "Low": {
    color: "#10b981",
    description: "Conservative approach with stable returns",
    typicalReturns: "4-6%"
  },
  "Moderate": {
    color: "#facc15",
    description: "Balanced risk-reward approach",
    typicalReturns: "6-9%"
  },
  "High": {
    color: "#ef4444",
    description: "Aggressive growth strategy",
    typicalReturns: "9-15%"
  }
};