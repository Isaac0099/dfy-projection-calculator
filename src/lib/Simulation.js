// Simulation.js

import House from "@/lib/House";
import { calculateAnnualIRR } from "./utils/IRRCalculator";
import { getWeightedAverageAppreciation, copyHomes, formatCurrency } from "./utils/utils";

// Helper functions for cleaner code
const calculateTotalOutOfPocket = (homes) => {
  return homes.reduce((total, home) => {
    return total + (home.initialHomePrice * (home.percentDownPayment + 7)) / 100;
  }, 0);
};

const createInitialCashflows = (homes) => {
  return homes
    .filter((home) => !home.isExistingProperty) // only brand-new purchases
    .map((home) => ({
      month: home.monthOfPurchase,
      amount: -(home.initialHomePrice * (home.percentDownPayment + 7)) / 100,
    }));
};

const processNewHomesPurchases = (month, startingHomes) => {
  const newHomesThisMonth = startingHomes.filter((home) => home.monthOfPurchase === month);
  const remainingHomes = startingHomes.filter((home) => home.monthOfPurchase !== month);
  return { newHomesThisMonth, remainingHomes };
};

const processRefinancing = (month, existingHomes) => {
  const newHomesFromRefinancing = [];

  for (const home of existingHomes) {
    // For cash purchases (100% down), we still use 25% down for future purchases
    // This maintains consistency with the reinvestment strategy
    let fractionForNewHome = (home.percentDownPayment + 7) / 100;
    if (home.percentDownPayment === 100) {
      fractionForNewHome = 0.25; // 25% down payment for reinvestment after cash purchase
    }
    const costForNewHome = home.getCurrentHomeValue(month) * fractionForNewHome;

    if (home.willReinvest && home.getPossibleRefinancePayout(month) > costForNewHome) {
      const payout = home.doARefinance(month);
      newHomesFromRefinancing.push(
        new House({
          id: Date.now(),
          isExistingProperty: false,
          monthOfPurchase: month,
          homePrice: home.getCurrentHomeValue(month),
          percentAnnualHomeAppreciation: home.percentAnnualHomeAppreciation,
          percentDownPayment: home.percentDownPayment !== 100 ? home.percentDownPayment : 25,
          percentAnnualInterestRate: 6,
          loanTermYears: home.loanTermYears,
          willReinvest: home.willReinvest,
        })
      );
    }
  }

  return newHomesFromRefinancing;
};
const calculateMonthlyMetrics = (month, homes) => {
  const metrics = {
    propertyCount: homes.length,
    portfolioValue: 0,
    debt: 0,
    equity: 0,
    equityIncome: 0,
    rentIncome: 0,
    mortgagePaymentSum: 0,
    grossRentIncome: 0,
  };

  for (const home of homes) {
    const homeValue = home.getCurrentHomeValue(month);
    const homeDebt = home.getRemainingBalance(month);

    metrics.portfolioValue += homeValue;
    metrics.debt += homeDebt;
    metrics.equity += homeValue - homeDebt;
    metrics.equityIncome += homeValue * (home.percentAnnualHomeAppreciation / 100);
    metrics.rentIncome += home.calculateNetRentalIncome(month);
    metrics.grossRentIncome += home.calculateMonthlyRent(month);
    metrics.mortgagePaymentSum += home.getCurrentMortgagePayment(month);
  }

  // Adjust equity income if there are homes
  if (homes.length > 0) {
    // Calculate annual equity income first
    const annualEquityIncome = metrics.equityIncome * 0.75; // Conservative estimate
    // Subtract annual refinance cost
    const adjustedAnnualIncome = annualEquityIncome - homes[0].getCurrentRefiCost(month);
    // Convert to monthly at the end to maintain calculation order
    metrics.equityIncome = adjustedAnnualIncome / 12;
  }

  return metrics;
};

const simulateWithdrawalPeriod = (homes, projectionYears, legacyYears, useEquityIncome) => {
  const homesCopy = copyHomes(homes);
  const withdrawalData = {
    graphingData: [],
    legacyEquity: 0,
    legacyPortfolio: 0,
    cumulativeIncome: 0,
  };

  const weightedAverageAppreciation = getWeightedAverageAppreciation(homesCopy);
  let annualPayout = 0;
  let monthlyIncome = 0;
  let equityIncome = 0;

  for (let month = projectionYears * 12 + 1; month <= legacyYears * 12; month++) {
    const equity = homesCopy.reduce((sum, home) => sum + home.getCurrentEquity(month), 0);
    const portfolioValue = homesCopy.reduce((sum, home) => sum + home.getCurrentHomeValue(month), 0);
    if (useEquityIncome) {
      if (month % 12 === 1) {
        const totalPortfolioValue = homesCopy.reduce((sum, home) => sum + home.getCurrentHomeValue(month), 0);
        const desiredAnnualPayout =
          totalPortfolioValue * weightedAverageAppreciation * 0.75 - homesCopy[0].getCurrentRefiCost(month);

        // Find home with highest equity for refinancing
        const homeWithHighestEquity = homesCopy.reduce((max, home) => {
          const currentEquity = home.getCurrentEquity(month);
          const maxEquity = max.getCurrentEquity(month);
          return currentEquity > maxEquity ? home : max;
        }, homesCopy[0]);

        // If our desired payout is greater than 0 including refinance cost then we will go ahead and do the refinance
        if (desiredAnnualPayout > 0) {
          annualPayout = homeWithHighestEquity.refinanceForAmount(month, desiredAnnualPayout);
        }
        equityIncome = annualPayout / 12;
      }

      const rentMetrics = homesCopy.reduce(
        (acc, home) => ({
          rentIncome: acc.rentIncome + home.calculateNetRentalIncome(month),
          grossRentIncome: acc.grossRentIncome + home.calculateMonthlyRent(month),
        }),
        { rentIncome: 0, grossRentIncome: 0 }
      );

      monthlyIncome = equityIncome + rentMetrics.rentIncome;

      withdrawalData.cumulativeIncome += monthlyIncome;
      withdrawalData.graphingData.push({
        month,
        monthlyIncome,
        equityIncome,
        rentIncome: rentMetrics.rentIncome,
        equity,
        portfolioValue,
      });
    } else {
      const rentMetrics = homesCopy.reduce(
        (acc, home) => ({
          rentIncome: acc.rentIncome + home.calculateNetRentalIncome(month),
          grossRentIncome: acc.grossRentIncome + home.calculateMonthlyRent(month),
        }),
        { rentIncome: 0, grossRentIncome: 0 }
      );
      withdrawalData.cumulativeIncome += rentMetrics.rentIncome;
      withdrawalData.graphingData.push({
        month,
        monthlyIncome: rentMetrics.rentIncome,
        grossRentIncome: rentMetrics.grossRentIncome,
        equity: equity,
        portfolioValue: portfolioValue,
      });
    }
  }

  // Calculate final legacy values
  const lastMonth = legacyYears * 12;
  for (const home of homesCopy) {
    const homeValue = home.getCurrentHomeValue(lastMonth);
    const homeDebt = home.getRemainingBalance(lastMonth);
    withdrawalData.legacyEquity += homeValue - homeDebt;
    withdrawalData.legacyPortfolio += homeValue;
  }

  return withdrawalData;
};

export const runSimulation = (startingHomes, projectionYears, legacyYears) => {
  if (startingHomes.length === 0) return null;

  const totalLegacyYears = legacyYears + projectionYears;
  const homes = [];
  const graphingData = [];
  const cashflows = createInitialCashflows(startingHomes);
  let remainingStartingHomes = [...startingHomes];

  // Growth Period Simulation
  for (let month = 0; month <= projectionYears * 12; month++) {
    // Process new home purchases and refinancing
    const { newHomesThisMonth, remainingHomes } = processNewHomesPurchases(month, remainingStartingHomes);
    remainingStartingHomes = remainingHomes;

    const newHomesFromRefinancing = homes.length > 0 ? processRefinancing(month, homes) : [];
    homes.push(...newHomesThisMonth, ...newHomesFromRefinancing);

    // Calculate and store monthly metrics
    const monthlyMetrics = calculateMonthlyMetrics(month, homes);
    graphingData.push({ month, ...monthlyMetrics });
  }

  // Calculate IRR
  const finalEquity = graphingData[projectionYears * 12].equity;
  cashflows.push({ month: projectionYears * 12, amount: finalEquity });

  let annualIRR = 0;
  if (cashflows.length >= 2) {
    try {
      annualIRR = calculateAnnualIRR(cashflows) * 100;
    } catch (error) {
      console.error("IRR calculation failed:", error);
      // Fallback to simple return calculation
      const totalReturn = cashflows[cashflows.length - 1].amount / -cashflows[0].amount - 1;
      const years = cashflows[cashflows.length - 1].month / 12;
      annualIRR = (Math.pow(1 + totalReturn, 1 / years) - 1) * 100;
    }
  }

  // Simulate Withdrawal Period
  const withdrawalPeriod = simulateWithdrawalPeriod(homes, projectionYears, totalLegacyYears, homes[0].willReinvest);

  return {
    homes,
    graphingData,
    withdrawalGraphingData: withdrawalPeriod.graphingData,
    totalOutOfPocket: calculateTotalOutOfPocket(startingHomes),
    annualPercentReturnFromEquity: annualIRR,
    legacyEquity: withdrawalPeriod.legacyEquity,
    legacyPortfolio: withdrawalPeriod.legacyPortfolio,
    cumulativeIncome: withdrawalPeriod.cumulativeIncome,
  };
};

export default runSimulation;
