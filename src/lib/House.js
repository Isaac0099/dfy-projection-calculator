// House.js

import AmortizationCalculator from "./AmortizationCalculator.js";
import { exponentialAdjustedAtTheStartOfTheYear } from "./utils/utils.js";

class House {
  constructor({
    // Common fields
    id,
    percentAnnualHomeAppreciation = 5,
    percentDownPayment = 25,
    percentAnnualInterestRate = 6.5,
    loanTermYears = 30,
    willReinvest = false,

    // Distinguish new vs. existing property
    isExistingProperty = false,

    // For NEW properties
    monthOfPurchase = 0, // e.g., 12 (purchase in month 12)
    homePrice = 0, // the “initial” price for a new purchase

    // For EXISTING properties
    datePurchased = null, // user’s input date (not strictly required in the sim)
    originalLoanAmount = 0,
    originalLoanTermYears = 30,
    monthsPaidSoFar = 0, // how many payments have already been made
    currentHomeValue = 0, // what the user says it’s worth “today”
  }) {
    this.id = id;
    this.isExistingProperty = isExistingProperty;

    // Shared fields
    this.percentAnnualHomeAppreciation = percentAnnualHomeAppreciation;
    this.percentAnnualInterestRate = percentAnnualInterestRate;
    this.loanTermYears = loanTermYears;
    this.percentDownPayment = percentDownPayment;
    this.willReinvest = willReinvest;

    // We always have an instance of our amortization calculator
    this.amoCalc = new AmortizationCalculator();

    // IMPORTANT: always define refinanceSchedule as an array
    this.refinanceSchedule = [];

    if (isExistingProperty) {
      // -----------------------------
      // Existing property logic
      // -----------------------------
      // We treat "monthOfPurchase" as 0 since it's already owned at the start.
      this.monthOfPurchase = 0;

      // The user provides "currentHomeValue" as the property value at month 0 of the sim
      this.initialHomePrice = currentHomeValue;

      // This is the original loan amount from when they first purchased
      // We’ll create a full schedule for the entire originalLoanTermYears
      this.loanAmount = originalLoanAmount;

      // Adding this guard clause because I've been having bugs with 0 as a loan ammount
      if (!this.loanAmount || this.loanAmount <= 0) {
        throw new Error("Original loan amount must be provided for existing properties");
      }

      // Generate the full mortgage schedule
      this.schedule = this.amoCalc.generateAmortizationSchedule(
        this.loanAmount,
        this.percentAnnualInterestRate,
        originalLoanTermYears
      );

      // Then slice off the payments they’ve already made
      if (monthsPaidSoFar < this.schedule.length) {
        this.schedule = this.schedule.slice(monthsPaidSoFar);
      } else {
        // They might have fully paid off or nearly so
        this.schedule = [];
      }

      // Mark the latest refinance as happening at month 0
      this.monthOfLatestMortgageOrRefinance = 0;

      // For rent calculations, we base it on the “current” home value
      this.initialMonthlyRent = this.initialHomePrice * 0.0067;

      // (Optional) store these if we want them for reference (may delete later)
      this.datePurchased = datePurchased;
      this.originalLoanAmount = originalLoanAmount;
      this.originalLoanTermYears = originalLoanTermYears;
      this.monthsPaidSoFar = monthsPaidSoFar;
      this.currentHomeValue = currentHomeValue;
    } else {
      // -----------------------------
      // New purchase logic
      // -----------------------------
      this.monthOfPurchase = monthOfPurchase;
      this.initialHomePrice = homePrice;
      this.monthOfLatestMortgageOrRefinance = monthOfPurchase;

      if (this.percentDownPayment < 100) {
        // Typical financed purchase
        this.loanAmount = (homePrice * (100 - this.percentDownPayment)) / 100;
        this.schedule = this.amoCalc.generateAmortizationSchedule(
          this.loanAmount,
          this.percentAnnualInterestRate,
          this.loanTermYears
        );
      } else {
        // Cash purchase (100% down)
        this.loanTermYears = 0;
        this.loanAmount = 0;
        this.schedule = [];
      }

      // Base initial monthly rent on the initial home price
      this.initialMonthlyRent = this.initialHomePrice * 0.0067;
    }
  }

  // ====================
  // Methods
  // ====================

  // 1) Home Value
  getCurrentHomeValue(currentMonth) {
    // For both new and existing:
    // “initialHomePrice” is the value at the moment of the house’s “start” in the sim
    const monthsSincePurchase = currentMonth - this.monthOfPurchase;
    return this.initialHomePrice * Math.pow(1 + this.percentAnnualHomeAppreciation / 100, monthsSincePurchase / 12);
  }

  // 2) Equity
  getCurrentEquity(currentMonth) {
    const homeValue = this.getCurrentHomeValue(currentMonth);
    const remainingBalance = this.getRemainingBalance(currentMonth);
    return homeValue - remainingBalance;
  }

  // 3) Refinance Costs
  getCurrentRefiCost(currentMonth) {
    // Example logic: grows slightly each year
    return 7000 * Math.pow(1.025, currentMonth / 12);
  }

  // 4) Mortgage Payment
  getCurrentMortgagePayment(currentMonth) {
    const monthsSinceMortgageOrRefinance = currentMonth - this.monthOfLatestMortgageOrRefinance;
    if (monthsSinceMortgageOrRefinance < 0) {
      return 0;
    }
    // If the user has fully paid off or we’re beyond the schedule length
    if (monthsSinceMortgageOrRefinance >= this.schedule.length) {
      return 0;
    }
    return this.schedule[1]?.paymentAmount || 0;
  }

  // 5) total out-of-pocket if purchased new (not typically used for existing)
  getTOPValue() {
    const fractionOfHomePriceForTOP = (this.percentDownPayment + 7) / 100;
    return this.initialHomePrice * fractionOfHomePriceForTOP;
  }

  // 6) Remaining Balance
  getRemainingBalance(currentMonth) {
    if (this.percentDownPayment === 100) {
      return 0; // paid in cash
    }
    const monthsIntoAmo = currentMonth - this.monthOfLatestMortgageOrRefinance;
    if (monthsIntoAmo < 0) {
      return this.schedule.length > 0 ? this.schedule[0].remainingBalance : 0;
    }
    if (monthsIntoAmo < this.schedule.length) {
      return this.schedule[monthsIntoAmo].remainingBalance;
    }
    // fully paid
    return 0;
  }

  // 7) isPaidOff
  isCurrentlyPaidOff(currentMonth) {
    return currentMonth - this.monthOfLatestMortgageOrRefinance > this.schedule.length;
  }

  // 8) Potential Refinance Payout
  getPossibleRefinancePayout(currentMonth) {
    if (currentMonth === this.monthOfLatestMortgageOrRefinance) {
      throw new Error("Cannot check refinance potential in the same month you refinanced");
    }
    if (!this.willReinvest) {
      return 0; // If user doesn’t intend to reinvest, we skip
    }

    const currentHomeValue = this.getCurrentHomeValue(currentMonth);
    const grossPayout = currentHomeValue * 0.75 - this.getCurrentRefiCost(currentMonth);
    const remainingPrincipal = this.getRemainingBalance(currentMonth);
    const netPayout = grossPayout - remainingPrincipal;
    return netPayout;
  }

  // 9) Do a Refinance (max 75% LTV)
  doARefinance(currentMonth) {
    // Calculate how much we can pull out
    const currentHomeValue = this.getCurrentHomeValue(currentMonth);
    const grossPayout = currentHomeValue * 0.75 - this.getCurrentRefiCost(currentMonth);
    const remainingPrincipal = this.getRemainingBalance(currentMonth);
    const payoutAfterPayoff = grossPayout - remainingPrincipal;

    // Update loan info: new 30-year mortgage
    this.monthOfLatestMortgageOrRefinance = currentMonth;
    this.loanAmount = currentHomeValue * 0.75;
    this.loanTermYears = 30;
    this.percentDownPayment = 25; // effectively 25% equity
    this.schedule = this.amoCalc.generateAmortizationSchedule(
      this.loanAmount,
      this.percentAnnualInterestRate,
      this.loanTermYears
    );

    // Log it
    this.refinanceSchedule.push({ month: currentMonth, amount: payoutAfterPayoff });

    return payoutAfterPayoff;
  }

  // 10) Refinance for a Desired Amount
  refinanceForAmount(currentMonth, desiredAmount) {
    if (currentMonth === this.monthOfLatestMortgageOrRefinance) {
      throw new Error("Can't do multiple refinances in the same month");
    }
    // If user doesn't want reinvest, skip
    if (!this.willReinvest) return 0;

    const currentHomeValue = this.getCurrentHomeValue(currentMonth);
    const currentBalance = this.getRemainingBalance(currentMonth);
    const refiCost = this.getCurrentRefiCost(currentMonth);

    const maxNewLoan = currentHomeValue * 0.75;
    const totalNeeded = currentBalance + desiredAmount + refiCost;

    // If we cannot get the desired amount, see if partial is possible
    if (totalNeeded > maxNewLoan) {
      const maxPossiblePayout = Math.max(0, maxNewLoan - currentBalance - refiCost);
      if (maxPossiblePayout <= 0) {
        return 0; // no refinance
      }
      // proceed with partial
      this.monthOfLatestMortgageOrRefinance = currentMonth;
      this.loanAmount = maxNewLoan;
      this.schedule = this.amoCalc.generateAmortizationSchedule(this.loanAmount, this.percentAnnualInterestRate, 30);
      this.refinanceSchedule.push({
        month: currentMonth,
        amount: maxPossiblePayout,
      });
      return maxPossiblePayout;
    }

    // Otherwise, we can get the desired amount
    this.monthOfLatestMortgageOrRefinance = currentMonth;
    this.loanAmount = totalNeeded;
    this.loanTermYears = 30;
    this.schedule = this.amoCalc.generateAmortizationSchedule(this.loanAmount, this.percentAnnualInterestRate, 30);
    this.refinanceSchedule.push({
      month: currentMonth,
      amount: desiredAmount,
    });
    return desiredAmount;
  }

  // 11) Rent
  calculateMonthlyRent(currentMonth) {
    // Rent jumps adjust to keep up with 3% appreciation at the start of each year
    const rentAppreciationRate = 1.03;
    const currentRent = exponentialAdjustedAtTheStartOfTheYear(
      this.monthOfPurchase,
      currentMonth,
      this.initialMonthlyRent,
      rentAppreciationRate
    );
    return currentRent;
  }

  // 12) Net Rental Income
  calculateNetRentalIncome(currentMonth) {
    let totalExpenses = 0;
    const remainingBalance = this.getRemainingBalance(currentMonth);
    // If not paid off, mortgage payment is an expense
    if (remainingBalance > 0 && this.schedule.length > 1) {
      totalExpenses += this.schedule[1].paymentAmount;
    }

    const grossRent = this.calculateMonthlyRent(currentMonth);

    // Operating expenses (property mgmt, taxes, etc.)
    const expenses = {
      management: exponentialAdjustedAtTheStartOfTheYear(0, currentMonth, 99, 1.025),
      propertyTax: grossRent * 0.14,
      insurance: grossRent * 0.05,
      misc: grossRent * 0.08,
    };
    totalExpenses += Object.values(expenses).reduce((sum, e) => sum + e, 0);

    return grossRent - totalExpenses;
  }
}

export default House;
