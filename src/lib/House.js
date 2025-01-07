// House.js

import AmortizationCalculator from "./AmortizationCalculator.js";

class House {
  constructor(
    monthOfPurchase,
    homePrice,
    percentAnnualHomeAppreciation,
    percentDownPayment,
    percentAnnualInterestRate,
    loanTermYears,
    willReinvest,
    id
  ) {
    this.monthOfPurchase = monthOfPurchase;
    this.monthOfLatestMortgageOrRefinance = monthOfPurchase;
    this.initialHomePrice = homePrice;
    this.percentAnnualHomeAppreciation = percentAnnualHomeAppreciation;
    this.percentDownPayment = percentDownPayment;
    this.percentAnnualInterestRate = percentAnnualInterestRate;
    this.amoCalc = new AmortizationCalculator();
    if (this.percentDownPayment < 100) {
      this.loanTermYears = loanTermYears;
      this.loanAmount = (homePrice * (100 - percentDownPayment)) / 100;
      this.schedule = this.amoCalc.generateAmortizationSchedule(
        this.loanAmount,
        this.percentAnnualInterestRate,
        this.loanTermYears
      );
    } else if (this.percentDownPayment === 100) {
      this.loanTermYears = 0;
      this.loanAmount = 0;
      this.schedule = [];
    }
    this.refinanceSchedule = [];
    this.willReinvest = willReinvest;
    this.initialMonthlyRent = this.initialHomePrice * 0.0067; // assuming initial rent value is about 0.67% of the inital price
    this.id = id;
  }

  getCurrentHomeValue(currentMonth) {
    const monthsSincePurchase = currentMonth - this.monthOfPurchase;
    return this.initialHomePrice * Math.pow(1 + this.percentAnnualHomeAppreciation / 100, monthsSincePurchase / 12);
  }

  getCurrentEquity(currentMonth) {
    const homeValue = this.getCurrentHomeValue(currentMonth);
    const remainingBalance = this.getRemainingBalance(currentMonth);
    return homeValue - remainingBalance;
  }

  getCurrentRefiCost(currentMonth) {
    return 7000 * Math.pow(1.025, currentMonth / 12);
  }

  getCurrentMortgagePayment(currentMonth) {
    const monthsSinceMortgageOrRefinance = currentMonth - this.monthOfLatestMortgageOrRefinance;
    if (monthsSinceMortgageOrRefinance < 0) {
      return 0;
    }
    if (monthsSinceMortgageOrRefinance > this.schedule.length) {
      return 0;
    }
    if (monthsSinceMortgageOrRefinance < this.schedule.length) {
      return this.schedule[1].paymentAmount;
    }
  }

  getTOPValue() {
    const fractionOfHomePriceForTOP = (this.percentDownPayment + 7) / 100;
    return this.initialHomePrice * fractionOfHomePriceForTOP;
  }

  getRemainingBalance(currentMonth) {
    let remainingBalance = 0;
    if (this.percentDownPayment === 100) {
      return 0;
    }
    const monthsIntoAmoSchedule = currentMonth - this.monthOfLatestMortgageOrRefinance;
    if (monthsIntoAmoSchedule < this.schedule.length) {
      remainingBalance = this.schedule[monthsIntoAmoSchedule].remainingBalance;
    }
    return remainingBalance;
  }

  isCurrentlyPaidOff(currentMonth) {
    if (currentMonth - this.monthOfLatestMortgageOrRefinance > this.schedule.length) {
      return true;
    }
    return false;
  }
  /**
   * Calculates refinance potential payout
   * @param {number} percentAnnualHomeAppreciationRate - Annual home appreciation rate as a percentage
   * @param {number} monthsSinceMortgageOrRefinance - Number of months since original mortgage or last refinance
   * @returns {number} payout {number} - The potential cash payout from refinancing (after costs)
   **/
  getPossibleRefinancePayout(currentMonth) {
    if (currentMonth === this.monthOfLatestMortgageOrRefinance) {
      throw new Error("can't get possible refinance details for the month you do a refinance");
    }
    ///// returning 0 if home is not a refinancing home.
    if (this.willReinvest === false) {
      return 0;
    }
    const currentHomeValue =
      this.initialHomePrice *
      Math.pow(1 + this.percentAnnualHomeAppreciation / 100, (currentMonth - this.monthOfPurchase) / 12);
    const grossPayout = currentHomeValue * 0.75 - this.getCurrentRefiCost(currentMonth);
    const remainingPrincipalOnMortgage = this.getRemainingBalance(currentMonth);
    const payout = grossPayout - remainingPrincipalOnMortgage; // we are working under the assumption that the refinance is done immediately after the mortgage payment for this month

    return payout;
  }

  /**
   * Does a max refinance, dropping the homes equity to 25% of the home's value and putting it on a 30 year mortgage It assumes same interest rate as currrent one
   * @param {Number} currentMonth
   * @returns {Number} payment
   */
  doARefinance(currentMonth) {
    // Payout information
    const currentHomeValue =
      this.initialHomePrice *
      Math.pow(1 + this.percentAnnualHomeAppreciation / 100, (currentMonth - this.monthOfPurchase) / 12);
    const grossPayout = currentHomeValue * 0.75 - this.getCurrentRefiCost(currentMonth);
    const remainingPrincipalOnMortgage = this.getRemainingBalance(currentMonth);
    const payoutAfterPayingOffCurrentMortgage = grossPayout - remainingPrincipalOnMortgage;

    // New loan info (updating class fields)
    this.monthOfLatestMortgageOrRefinance = currentMonth;
    this.loanAmount = currentHomeValue * 0.75;
    this.loanTermYears = 30;
    this.percentDownPayment = 25;
    this.schedule = this.amoCalc.generateAmortizationSchedule(
      this.loanAmount,
      Number(this.percentAnnualInterestRate),
      Number(this.loanTermYears)
    );
    this.refinanceSchedule.push({ month: currentMonth, amount: payoutAfterPayingOffCurrentMortgage });

    return payoutAfterPayingOffCurrentMortgage;
  }

  /* Attempts to refinance the house to get a specific dollar amount out.
   * @param {number} currentMonth - The current month in the simulation
   * @param {number} desiredAmount - The amount we want to get from the refinance
   * @returns {number} The actual amount we can get from the refinance (0 if not possible)
   */
  refinanceForAmount(currentMonth, desiredAmount) {
    if (currentMonth === this.monthOfLatestMortgageOrRefinance) {
      throw new Error("can't get possible refinance details for the month you do a refinance");
    }
    // First check if we have enough equity to do any refinance
    const currentHomeValue = this.getCurrentHomeValue(currentMonth);
    const currentBalance = this.getRemainingBalance(currentMonth);
    const currentEquity = currentHomeValue - currentBalance;
    const refiCost = this.getCurrentRefiCost(currentMonth);

    // We need the refinance to:
    // 1. Pay off current mortgage (currentBalance)
    // 2. Cover refinance costs (refiCost)
    // 3. Provide the desired amount (desiredAmount)
    // 4. Leave at least 25% equity in the home

    const maxNewLoanAmount = currentHomeValue * 0.75; // Can't borrow more than 75% of value
    const totalNeeded = currentBalance + desiredAmount; // + refiCost

    // Check if this is possible
    // if not we'll do a refiance for as much as we can
    if (totalNeeded > maxNewLoanAmount) {
      // Can't get desired amount - calculate max we could get
      const maxPossiblePayout = Math.max(0, maxNewLoanAmount - currentBalance - refiCost);
      this.monthOfLatestMortgageOrRefinance = currentMonth;
      this.loanAmount = maxNewLoanAmount;
      this.schedule = this.amoCalc.generateAmortizationSchedule(
        this.loanAmount,
        Number(this.percentAnnualInterestRate),
        30
      );
      return maxPossiblePayout;
    }

    // If we get here, we can do the refinance for the desired amount
    // Update the house's state
    this.monthOfLatestMortgageOrRefinance = currentMonth;
    this.loanTermYears = 30;
    this.loanAmount = totalNeeded;
    this.schedule = this.amoCalc.generateAmortizationSchedule(
      this.loanAmount,
      Number(this.percentAnnualInterestRate),
      30 // Reset to 30 year term for refinance
    );

    // Record the refinance
    this.refinanceSchedule.push({
      month: currentMonth,
      amount: desiredAmount,
    });

    return desiredAmount;
  }

  calculateMonthlyRent(currentMonth) {
    // Calculate rent appreciation
    const rentAppreciationRate = 1.03;
    const monthsSincePurchase = currentMonth - this.monthOfPurchase;
    const appreciatedRent = this.initialMonthlyRent * Math.pow(rentAppreciationRate, monthsSincePurchase / 12);

    return appreciatedRent;
  }

  calculateNetRentalIncome(currentMonth) {
    let totalExpenses = 0;
    // Only calculate for paid off homes
    const remainingBalance = this.getRemainingBalance(currentMonth);
    if (remainingBalance > 0) {
      totalExpenses += this.schedule[1].paymentAmount;
    }

    const grossRent = this.calculateMonthlyRent(currentMonth);

    // Operating expenses breakdown
    const expenses = {
      maintenance: grossRent * 0.06, // 6% for maintenance and vancancies
      management: grossRent * 0.08, // 8% for property management
      propertyTax: grossRent * 0.14, // 14% for property tax
      insurance: grossRent * 0.05, // 5% for insurance
    };

    // Total expenses approximately 36% of gross rent
    totalExpenses += Object.values(expenses).reduce((sum, expense) => sum + expense, 0);

    return grossRent - totalExpenses;
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default House;
