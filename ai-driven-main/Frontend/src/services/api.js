// API service for Gemini API integration
const API_BASE_URL = 'https://gemini-api-service.onrender.com';

export const apiService = {
  // Analyze investment data
  async analyzeInvestment(prompt) {
    try {
      const response = await fetch(`${API_BASE_URL}/extract_entities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Re-analyze with updated parameters
  async reanalyzeWithParameters(parameters) {
    try {
      const response = await fetch(`${API_BASE_URL}/reanalyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parameters),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Re-analysis API Error:', error);
      throw error;
    }
  },

  // Mock data generator for development/testing
  generateMockAnalysisData(inputText) {
    // Generate 10 years of data
    const years = [];
    const currentYear = new Date().getFullYear();
    let portfolioValue = 500000; // Initial investment
    let equityGrowth = 0;
    let debtGrowth = 0;
    let alternativeGrowth = 0;

    for (let i = 0; i < 10; i++) {
      const year = currentYear + i;
      
      // Portfolio growth (compound growth)
      const annualReturn = 0.09; // 9% annual return
      portfolioValue = portfolioValue * (1 + annualReturn);
      
      // Asset class growth percentages (relative to initial values)
      equityGrowth = ((portfolioValue * 0.6) / (500000 * 0.6) - 1) * 100;
      debtGrowth = ((portfolioValue * 0.3) / (500000 * 0.3) - 1) * 100;
      alternativeGrowth = ((portfolioValue * 0.1) / (500000 * 0.1) - 1) * 100;

      years.push({
        year: year.toString(),
        portfolioValue: Math.round(portfolioValue),
        equityGrowth: Math.round(equityGrowth * 10) / 10,
        debtGrowth: Math.round(debtGrowth * 10) / 10,
        alternativeGrowth: Math.round(alternativeGrowth * 10) / 10
      });
    }

    const mockData = {
      insights: "Based on your investment profile, we recommend a diversified portfolio with 60% equity, 30% debt, and 10% alternative investments. This allocation balances growth potential with risk management.",
      suggestions: [
        "Consider SIP (Systematic Investment Plan) for rupee cost averaging",
        "Rebalance portfolio quarterly to maintain target allocation",
        "Review and adjust based on life stage changes"
      ],
      // Legacy format for backward compatibility
      assetClasses: {
        equity: years.map(y => ({ month: y.year, value: Math.round(y.portfolioValue * 0.6) })),
        debt: years.map(y => ({ month: y.year, value: Math.round(y.portfolioValue * 0.3) })),
        alternative: years.map(y => ({ month: y.year, value: Math.round(y.portfolioValue * 0.1) }))
      },
      // New dual-axis data format
      dualAxisData: years,
      parameters: {
        riskLevel: 7,
        investmentAmount: 500000,
        timeHorizon: 10,
        expectedReturn: 9,
        equityRatio: 60,
        debtRatio: 30,
        alternativeRatio: 10
      }
    };

    return mockData;
  }
};
