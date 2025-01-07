// // Simulation.js

// ///// takes the list of homes from homeListBuilder,
// ///// runs simulation for specified years of growth period time,
// ///// saves graphing numbers throughout this time and a few final values at then end of this period
// ///// run a quick withdrawal period simulation for the purpose fo finding what the amount left over is that they can give to their kids
// ///// returns result object with all useful info from the simulation.

import House from "@/lib/House";
import { calculateAnnualIRR } from "./utils/IRRCalculator";
import { getWeightedAverageAppreciation, copyHomes } from "./utils/utils";

export const runSimulation = (startingHomes, projectionYears, legacyYears) => {
  legacyYears += projectionYears;
  if (startingHomes.length === 0) {
    return null;
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate total out of pocket costs from starting homes
  let totalOutOfPocket = 0;
  startingHomes.forEach((home) => {
    totalOutOfPocket += (home.initialHomePrice * (home.percentDownPayment + 7)) / 100;
  });

  const homes = []; // List of all homes purchased (input + growth)
  let graphingData = []; // Monthly values for graphs and results
  let cashflows = []; // Track all cash flows for IRR calculation

  // Add initial investments as negative cash flows
  startingHomes.forEach((home) => {
    const initialInvestment = -(home.initialHomePrice * (home.percentDownPayment + 7)) / 100;
    cashflows.push({
      month: home.monthOfPurchase,
      amount: initialInvestment,
    });
  });

  // GROWTH PERIOD
  for (let month = 0; month <= projectionYears * 12; month++) {
    // Add any input homes to simulation homes if it's their purchase month
    let newHomesAddedThisMonth = [];
    for (let home of startingHomes) {
      if (home.monthOfPurchase === month) {
        newHomesAddedThisMonth.push(home);
      }
    }
    startingHomes = startingHomes.filter((home) => home.monthOfPurchase !== month);

    // Check for possibility of buying new homes via refinancing
    if (homes.length !== 0) {
      for (let home of homes) {
        let fractionOfHomePriceToGetIn = (home.percentDownPayment + 7) / 100;
        if (home.percentDownPayment === 100) {
          fractionOfHomePriceToGetIn = 0.25; // if they chose to pay with cash then immediatly refinance thats on them. They can deal with the 25%
        }
        const costToGetIntoNewHome = home.getCurrentHomeValue(month) * fractionOfHomePriceToGetIn;
        if (home.willReinvest && home.getPossibleRefinancePayout(month) > costToGetIntoNewHome) {
          const payout = home.doARefinance(month);
          console.log("New home from refinance:", {
            originalHomeValue: home.getCurrentHomeValue(month),
            newHomeValue: home.getCurrentHomeValue(month),
            payout: payout,
            costToGetIntoNewHome: costToGetIntoNewHome,
            month: month,
          });

          newHomesAddedThisMonth.push(
            new House(
              month,
              home.getCurrentHomeValue(month),
              home.percentAnnualHomeAppreciation,
              home.percentDownPayment !== 100 ? home.percentDownPayment : 25,
              home.percentAnnualInterestRate,
              home.loanTermYears,
              home.willReinvest,
              Date.now()
            )
          );
        }
      }
    }
    homes.push(...newHomesAddedThisMonth);

    // Calculate metrics for this month
    const propertyCountEntry = homes.length;
    let portfolioValueEntry = 0;
    let debtEntry = 0;
    let equityEntry = 0;
    let equityIncomeEntry = 0; // this is solely showing a hypothetical income. Our simulation is not assuming they will actually take this out until retirement
    let rentIncomeEntry = 0;
    let mortgagePaymentSum = 0;
    let grossRentIncome = 0;

    for (let home of homes) {
      const homeValue = home.getCurrentHomeValue(month);
      const homeDebt = home.getRemainingBalance(month);

      portfolioValueEntry += homeValue;
      debtEntry += homeDebt;
      equityEntry += homeValue - homeDebt;
      equityIncomeEntry += homeValue * (home.percentAnnualHomeAppreciation / 100); // Summing up the total appreciation amount for the year
      rentIncomeEntry += home.calculateNetRentalIncome(month);
      grossRentIncome += home.calculateMonthlyRent(month);
      mortgagePaymentSum += home.getCurrentMortgagePayment(month);
    }

    // Calculate monthly equity income
    if (homes.length > 0) {
      equityIncomeEntry *= 0.75; // Only using 75 of our appreciation to be conservative
      equityIncomeEntry -= homes[0].getCurrentRefiCost(month); // Taking out the cost to withdraw this equity via a refinance
    }
    equityIncomeEntry = equityIncomeEntry / 12; // Splitting it across 12 months

    // Add data point for this month
    graphingData.push({
      month: month,
      year: Math.floor(month / 12),
      propertyCount: propertyCountEntry,
      portfolioValue: portfolioValueEntry,
      debt: debtEntry,
      equity: equityEntry,
      equityIncome: equityIncomeEntry,
      rentIncome: rentIncomeEntry,
      mortgagePaymentSum: mortgagePaymentSum,
      grossRentIncome: grossRentIncome,
    });
  }

  // Add final portfolio value as positive cash flow
  const finalGrowthPeriodEquity = graphingData[projectionYears * 12].equity;
  cashflows.push({
    month: projectionYears * 12,
    amount: finalGrowthPeriodEquity,
  });

  // Calculate IRR
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

  /////// WITHDRAWAL PERIOD
  let withdrawalGraphingData = [];
  let homesCopy = copyHomes(homes);
  console.log(`homesCopy length: ${homesCopy.length}`);
  let legacyEquity = 0;
  let legacyPortfolio = 0;

  const weightedAverageAppreciation = getWeightedAverageAppreciation(homesCopy);
  let annualPayout = 0;

  const useEquityIncome = homesCopy[0].willReinvest;

  for (let month = projectionYears * 12 + 1; month <= legacyYears * 12; month++) {
    // Finding equity income if they chose reinvest growthStrategy and rent income if they did not
    if (useEquityIncome) {
      const equity = homesCopy.reduce((sum, home) => {
        return sum + home.getCurrentEquity(month);
      }, 0);
      if (month % 12 === 1) {
        // Calculate total portfolio value and desired payout
        const totalPortfolioValue = homesCopy.reduce((sum, home) => sum + home.getCurrentHomeValue(month), 0);
        const desiredAnnualPayout =
          totalPortfolioValue * weightedAverageAppreciation * 0.75 - homesCopy[0].getCurrentRefiCost(month);

        // Find home with highest equity for refinancing
        const homeWithHighestEquity = homesCopy.reduce((max, home) => {
          const currentHomeValue = home.getCurrentHomeValue(month);
          let currentEquity = currentHomeValue - home.getRemainingBalance(month);
          let maxEquity = max.getCurrentHomeValue(month) - max.getRemainingBalance(month);

          return currentEquity > maxEquity ? home : max;
        }, homesCopy[0]);

        // Attempt to get the desired payout through refinancing
        annualPayout = homeWithHighestEquity.refinanceForAmount(month, desiredAnnualPayout);
      }

      withdrawalGraphingData.push({
        month: month,
        withdrawalMonthlyIncome: annualPayout / 12,
        equity,
      });
    } else {
      let rentIncome = 0;
      let grossRentIncome = 0;
      for (let home of homesCopy) {
        rentIncome += home.calculateNetRentalIncome(month);
        grossRentIncome += home.calculateMonthlyRent(month);
      }
      withdrawalGraphingData.push({
        month: month,
        withdrawalMonthlyIncome: rentIncome,
        grossRentIncome: grossRentIncome,
      });
    }
  }

  // Calculate final legacy equity
  for (let home of homesCopy) {
    const lastMonth = legacyYears * 12;
    const homeValue = home.getCurrentHomeValue(lastMonth);
    const homeDebt = home.getRemainingBalance(lastMonth);
    legacyEquity += homeValue - homeDebt;
    legacyPortfolio += homeValue;
  }

  return {
    homes: homes,
    graphingData: graphingData,
    withdrawalGraphingData: withdrawalGraphingData,
    totalOutOfPocket: totalOutOfPocket,
    annualPercentReturnFromEquity: annualIRR,
    legacyEquity: legacyEquity,
    legacyPortfolio: legacyPortfolio,
  };
};

export default runSimulation;
