import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import House from "../House";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * helper function for getting the max value in my graphing data
 */
export const getMaxValue = (data, key) => {
  return Math.max(...data.map((item) => Math.abs(item[key])));
};

export const formatNumber = (value) => {
  const absValue = Math.abs(value);
  if (absValue >= 1000000) {
    return {
      value: value / 1000000,
      suffix: "M",
    };
  } else if (absValue >= 100_000) {
    return {
      value: value / 1000,
      suffix: "k",
    };
  }
  return {
    value: value,
    suffix: "",
  };
};

const formatNumberNoK = (value) => {
  const absValue = Math.abs(value);
  if (absValue >= 1000000) {
    return {
      value: value / 1000000,
      suffix: "M",
    };
  }
  return {
    value: value,
    suffix: "",
  };
};

export const formatYAxisTick = (value, key) => {
  const { value: formattedValue, suffix } = formatNumber(value);
  return `$${formattedValue.toLocaleString()}${suffix}`;
};

export const formatTooltipValue = (value, key) => {
  const { value: formattedValue, suffix } = formatNumberNoK(value);

  if (suffix === "M") {
    return `$${formattedValue.toFixed(3)}${suffix}`;
  } else {
    return `$${parseInt(formattedValue).toLocaleString()}${suffix}`;
  }
};

export const formatKeyMetricCardNumber = (value) => {
  const { value: formattedValue, suffix } = formatNumber(value);
  if (suffix === "k") {
    return `$${formattedValue.toFixed(0)}${suffix}`;
  }
  return `$${formattedValue.toFixed(2)}${suffix}`;
};

let homeIDCounter = 0;

export const generateId = () => {
  homeIDCounter += 1;
  return `home-${homeIDCounter}`;
};

export function getWeightedAverageAppreciation(homes) {
  if (!homes || homes.length === 0) return 0;

  let totalValue = 0;
  let weightedAppreciation = 0;

  homes.forEach((home) => {
    const homeValue = home.getCurrentHomeValue(0); // Use current value
    totalValue += homeValue;
    weightedAppreciation += homeValue * (home.percentAnnualHomeAppreciation / 100);
  });

  return totalValue > 0 ? weightedAppreciation / totalValue : 0;
}

export const copyHomes = (homes) => {
  let homesCopy = [];
  for (let home of homes) {
    const newHome = new House(
      home.monthOfPurchase,
      home.initialHomePrice,
      home.percentAnnualHomeAppreciation,
      home.percentDownPayment,
      home.percentAnnualInterestRate,
      home.loanTermYears,
      home.willReinvest,
      home.id
    );

    // Copy over current mortgage state
    newHome.monthOfLatestMortgageOrRefinance = home.monthOfLatestMortgageOrRefinance;
    newHome.loanAmount = home.loanAmount;
    newHome.schedule = [...home.schedule]; // Make a copy of the current amortization schedule
    newHome.refinanceSchedule = [...home.refinanceSchedule]; // Copy refinance history

    homesCopy.push(newHome);
  }
  return homesCopy;
};
