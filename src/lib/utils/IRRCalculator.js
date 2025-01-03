/**
 * Calculate IRR for cash flows specified by month numbers
 * @param {Array<{month: number, amount: number}>} cashflows - Array of cash flows
 *        month: integer representing months from start (0 = start)
 *        amount: negative for investments, positive for withdrawals/final value
 * @returns {number} - The IRR as a decimal (multiply by 100 for percentage)
 */
export function calculateAnnualIRR(cashflows) {
  // Sort cashflows by month
  const sortedCashflows = [...cashflows].sort((a, b) => a.month - b.month);

  // Convert months to years for the calculation
  const cashflowYears = sortedCashflows.map((cf) => ({
    years: cf.month / 12,
    amount: cf.amount,
  }));

  // Function to calculate Net Present Value
  function npv(rate) {
    return cashflowYears.reduce((sum, cf) => {
      return sum + cf.amount / Math.pow(1 + rate, cf.years);
    }, 0);
  }

  // Newton-Raphson method to find IRR
  const PRECISION = 0.00001;
  const MAX_ITERATIONS = 100;
  let rate = 0.1; // Initial guess of 10%

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const npvValue = npv(rate);

    if (Math.abs(npvValue) < PRECISION) {
      return rate;
    }

    // Calculate derivative
    const delta = 0.0001;
    const derivative = (npv(rate + delta) - npvValue) / delta;

    // Newton's method iteration
    const newRate = rate - npvValue / derivative;

    if (Math.abs(newRate - rate) < PRECISION) {
      return newRate;
    }

    rate = newRate;
  }

  throw new Error("IRR calculation did not converge");
}

// Helper function to analyze investment scenarios
export function analyzeInvestment(scenario) {
  try {
    const irr = calculateAnnualIRR(scenario.cashflows);
    console.log(`\nScenario: ${scenario.name}`);
    console.log(`IRR: ${(irr * 100).toFixed(2)}%`);
    console.log("Cashflows:");
    scenario.cashflows.forEach((cf) => {
      const type = cf.amount < 0 ? "Investment" : "Value/Withdrawal";
      console.log(`Month ${cf.month}: ${type} of $${Math.abs(cf.amount)}`);
    });
  } catch (error) {
    console.log(`\nError in scenario ${scenario.name}: ${error.message}`);
  }
}
