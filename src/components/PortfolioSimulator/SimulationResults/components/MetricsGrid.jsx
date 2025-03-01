// MetricsGrid.jsx

import { Wallet, DollarSign, Banknote, Home, TrendingUp, Calendar, ScrollText } from 'lucide-react';
import MetricCard from './MetricCard';
import { formatTooltipValue } from '@/lib/utils/utils';

const MetricsGrid = ({
  results,
  homes,
  projectionYears,
  legacyYears,
  growthStrategy,
  retirementIncomeStrategy,
  calculateEquityChange,
  calculatePortfolioChange,
}) => {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);

  const Section = ({ title, icon: Icon, children }) => (
    <div className="flex flex-col gap-4 p-4 bg-gray-200 rounded-md shadow-lg border">
      <header className="flex items-center gap-3 mb-0">
        <Icon className="h-6 w-6 text-orange-500" />
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      </header>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
  
  let thereIsAHomeFromBeforeTheSimulation = false;
  for (let home of homes) {
    if (home.isExistingProperty) {
      thereIsAHomeFromBeforeTheSimulation = true;
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Initial Investment Section */}
      <Section title="Initial Investment" icon={Wallet}>
        {!thereIsAHomeFromBeforeTheSimulation &&
        <MetricCard
          icon={DollarSign}
          title="Total Cash Investment"
          value={formatCurrency(results.totalOutOfPocket)}
          description="Total cash you put towards down payments, closing costs and getting DFY's help"
        />
        }
        <MetricCard
          icon={Home}
          title="Initial Property Count"
          value={homes.length}
          description={`This reflects how many properties you entered into the previous page`}
        />
      </Section>

      {/* At Retirement Section */}
      <Section title={`At Retirement-Other: ${projectionYears} years from now`} icon={Calendar}>
        <MetricCard
          icon={DollarSign}
          title="Portfolio Value"
          value={formatCurrency(results.graphingData[projectionYears * 12].portfolioValue)}
          change={parseFloat(calculatePortfolioChange())}
          description="Total value of all properties at the end of the building period"
        />
        <MetricCard
          icon={DollarSign}
          title="Equity Value"
          value={formatCurrency(results.graphingData[projectionYears * 12].equity)}
          description={`Of your ${formatTooltipValue(results.graphingData[projectionYears * 12].portfolioValue)} in portfolio value, this much is your equity`}
          change={calculateEquityChange()}
        />
        <MetricCard
          icon={Home}
          title="Retirement Property Count"
          value={results.homes.length}
          description={`Starting with ${homes.length} ${homes.length === 1 ? 'property' : 'properties'}`}
        />
        {!thereIsAHomeFromBeforeTheSimulation &&
        <MetricCard
          icon={TrendingUp}
          title="Annual ROI Based on Equity"
          value={`${results.annualPercentReturnFromEquity.toFixed(1)}%`}
          description="Return on investment during your building phase based on an IRR calculation reflecting equity value"
        />
        }
      </Section>

      {/* Legacy Section */}
      <Section title={`Legacy: ${projectionYears + legacyYears} years from now`} icon={ScrollText}>
      <MetricCard
          icon={ScrollText}
          title="Legacy Portfolio Value"
          value={formatCurrency(results.legacyPortfolio)}
          description={`The total value of your portfolio at end of your retirement`}
        />
        <MetricCard
          icon={ScrollText}
          title="Legacy Equity"
          value={formatCurrency(results.legacyEquity)}
          description={`The amount of equity you will have at the end of your projected retirement to pass on. This is after withdrawing from it for ${legacyYears} years in retirement`}
        />
         <MetricCard
          icon={Banknote}
          title={retirementIncomeStrategy === "refinancing" ? `Total tax-free equity income over ${legacyYears} years`: `Total Positive Cash Flow over ${legacyYears} years`}
          value={formatCurrency(results.cumulativeIncome)}
          description={retirementIncomeStrategy === "refinancing" ? `The sum of all tax free equity income over this simulation expects you will take out over ${legacyYears} years while still having these amounts left as a legacy at the end of your life` : `The sum of all rent income over ${legacyYears} years after expense have been removed`}
        />
        {legacyYears !== 0 &&
        <MetricCard
          icon={Banknote}
          title={retirementIncomeStrategy === "refinancing" ? `Monthly tax-free income` : `Average monthly cash flow during retirement`}
          multilines={[`First month: ${formatCurrency(results.withdrawalGraphingData[0].monthlyIncome)}`, `Middle: ${formatCurrency(results.withdrawalGraphingData[Math.floor(results.withdrawalGraphingData.length/ 2)].monthlyIncome)}`, `Last month: ${formatCurrency(results.withdrawalGraphingData[results.withdrawalGraphingData.length-1].monthlyIncome)}`]}
          description={retirementIncomeStrategy === "refinancing" ? `The number we get when averaging out your monthly income shown throughout all ${legacyYears} of retirement` : `The average monthly rent income over ${legacyYears} years of retirement after regular expenses have been removed`}
        />
        }
      </Section>
    </div>
  );
};

export default MetricsGrid;