import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Wallet, DollarSign, ScrollText, Calendar, Percent } from 'lucide-react';

const PDFMetricsSection = ({ 
  homes,
  projectionYears,
  legacyYears,
  growthStrategy,
  results,
}) => {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);

  const MetricBlock = ({ title, icon: Icon, metrics }) => (
    <div className="p-8 bg-gray-150 rounded-lg border border-gray-300 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <Icon className="h-10 w-10 text-orange-500" />
        <h3 className="text-4xl font-bold text-orange-600">{title}</h3>
      </div>
      <div className="space-y-6">
        {metrics.map((metric, index) => (
          <div key={index} className={index > 0 ? "border-t border-gray-200 pt-6" : ""}>
            <p className="text-2xl text-gray-600 mb-2">{metric.label}</p>
            <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
            {metric.description && (
              <p className="text-lg text-gray-500 mt-1">{metric.description}</p>
            )}
            {metric.change && (
              <p className={`text-lg font-semibold mt-1 ${
                parseFloat(metric.change) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {parseFloat(metric.change) >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Calculate percent changes
  const calculateEquityChange = () => {
    const start = results.graphingData[results.homes[0].monthOfPurchase].equity;
    const end = results.graphingData[projectionYears*12].equity;
    return ((end - start) / start * 100).toFixed(1);
  };

  const calculatePortfolioChange = () => {
    const start = results.graphingData[results.homes[0].monthOfPurchase].portfolioValue;
    const end = results.graphingData[projectionYears*12].portfolioValue;
    return ((end - start) / start * 100).toFixed(1);
  };

  return (
    <Card className="border-orange-500 border-t-8">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-4xl text-gray-900">Key Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Initial Investment Metrics */}
          <MetricBlock
            title="Initial Investment"
            icon={Wallet}
            metrics={[
              {
                label: "Total Cash Investment",
                value: formatCurrency(results.totalOutOfPocket),
                description: "Down payments, closing costs, and DFY's help"
              },
              {
                label: "Initial Properties",
                value: homes.length,
                description: "Number of properties at start"
              }
            ]}
          />

          {/* At Retirement Metrics */}
          <MetricBlock
            title={`At Retirement (${projectionYears} years)`}
            icon={Calendar}
            metrics={[
              {
                label: "Portfolio Value",
                value: formatCurrency(results.graphingData[projectionYears * 12].portfolioValue),
                change: calculatePortfolioChange()
              },
              {
                label: "Equity Value",
                value: formatCurrency(results.graphingData[projectionYears * 12].equity),
                change: calculateEquityChange()
              },
              {
                label: "Property Count",
                value: results.homes.length
              },
              {
                label: "Annual ROI",
                value: `${results.annualPercentReturnFromEquity.toFixed(1)}%`,
                description: "Return on investment during building phase"
              },
              {
                label: "Leverage Ratio",
                value: `${((results.graphingData[projectionYears*12].portfolioValue - 
                  results.graphingData[projectionYears*12].equity) / 
                  results.graphingData[projectionYears*12].portfolioValue * 100).toFixed(1)}%`,
                description: "Debt to asset ratio at retirement"
              }
            ]}
          />

          {/* Legacy Metrics */}
          <MetricBlock
            title={`Legacy (${projectionYears + legacyYears} years)`}
            icon={ScrollText}
            metrics={[
              {
                label: "Portfolio Value",
                value: formatCurrency(results.legacyPortfolio)
              },
              {
                label: "Legacy Equity",
                value: formatCurrency(results.legacyEquity),
                description: `After ${legacyYears} years of retirement withdrawals`
              },
              {
                label: growthStrategy === "reinvestment" ? "Total Tax-Free Income" : "Total Cash Flow",
                value: formatCurrency(results.cumulativeIncome)
              },
              {
                label: growthStrategy === "reinvestment" ? "First Month's Tax-Free Income" : "First Month's Cash Flow During Retirement",
                value: formatCurrency(results.withdrawalGraphingData[0].monthlyIncome),
                description: "First month of retirement",
              },
              {
                label: "Mid-Retirement Income",
                value: formatCurrency(results.withdrawalGraphingData[Math.floor(results.withdrawalGraphingData.length / 2)].monthlyIncome),
                description: "Middle of retirement phase"
              },
              {
                label: "Final Month's Income",
                value: formatCurrency(results.withdrawalGraphingData[results.withdrawalGraphingData.length - 1].monthlyIncome),
                description: "Last month of retirement"
              },
              {
                label: "Final Leverage Ratio",
                value: `${((results.withdrawalGraphingData[legacyYears*12-1].portfolioValue - 
                  results.withdrawalGraphingData[legacyYears*12-1].equity) / 
                  results.withdrawalGraphingData[legacyYears*12-1].portfolioValue * 100).toFixed(1)}%`,
                description: "Final debt to asset ratio"
              }
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFMetricsSection;