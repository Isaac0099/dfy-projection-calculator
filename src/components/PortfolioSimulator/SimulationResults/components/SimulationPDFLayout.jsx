// SimulationPDFLayout.jsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import CombinedOverviewChart from './charts/CombinedOverviewChart';
import GrowthPhaseChart from './charts/GrowthPhaseChart';
import PropertiesChart from './charts/PropertiesChart';
import RetirementIncomeChart from './charts/RetirementIncomeChart';
import ComparisonChart from './charts/ComparisonChart';
import { formatTooltipValue } from '@/lib/utils/utils';

const SimulationPDFLayout = React.forwardRef(({ 
  homes,
  projectionYears,
  legacyYears,
  growthStrategy,
  results
}, ref) => {
  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);

  // Calculate percent changes
  const calculateEquityChange = () => {
    const start = results.graphingData[results.homes[0].monthOfPurchase].equity;
    const end = results.graphingData[projectionYears*12].equity;
    return ((end - start) / start * 100).toFixed(1);
  };

  return (
    <div 
      ref={ref} 
      className="bg-white mx-auto" 
      style={{ position: 'absolute', left: '-9999px', top: 0, maxWidth: '1200px' }}
    >
      {/* Header Page */}
      <div >
        <div className="p-8 mb-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="bg-gray-900 text-white py-8 rounded-lg mb-8">
              <h1 className="text-4xl font-bold mb-4">Done For You Real Estate Portfolio Simulation</h1>
              <p className="text-lg opacity-90">Generated on {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
          </div>

          {/* Simulation Settings */}
          <Card className="mb-12 border-orange-500 border-t-8">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-2xl text-gray-900">Simulation Parameters</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pb-10">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Timeline</h3>
                  <div className="space-y-2 text-gray-600 font-semibold">
                    <p>• Building Phase: {projectionYears} years</p>
                    <p>• Retirement Phase: {legacyYears} years</p>
                    <p>• Growth Strategy: {growthStrategy === "reinvestment" ? "Equity Reinvestment" : "Pay Off Principal"}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Properties</h3>
                  <div className="space-y-2 text-gray-600 font-semibold">
                    <p>• Starting Properties: {homes.length}</p>
                    <p>• Final Properties: {results.homes.length}</p>
                    <p>• Initial Investment: {formatCurrency(results.totalOutOfPocket)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <Card className="border-orange-500 border-t-8 pb-20">
            <CardHeader className="bg-gray-50">
              <CardTitle className="text-2xl text-gray-900">Key Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-6">
                {/* Initial Investment */}
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-lg mb-4 text-orange-600">Initial Investment</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Cash Investment</p>
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(results.totalOutOfPocket)}</p>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm text-gray-600 mb-1">Initial Properties</p>
                      <p className="text-xl font-bold text-gray-900">{homes.length}</p>
                    </div>
                  </div>
                </div>
                
                {/* At Retirement */}
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-lg mb-4 text-orange-600">At Retirement ({projectionYears} years)</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Portfolio Value</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(results.graphingData[projectionYears * 12].portfolioValue)}
                      </p>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm text-gray-600 mb-1">Equity Value</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(results.graphingData[projectionYears * 12].equity)}
                      </p>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm text-gray-600 mb-1">Property Count</p>
                      <p className="text-xl font-bold text-gray-900">{results.homes.length}</p>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm text-gray-600 mb-1">Annual ROI</p>
                      <p className="text-xl font-bold text-gray-900">{results.annualPercentReturnFromEquity.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
                
                {/* Legacy */}
                <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                  <h3 className="font-semibold text-lg mb-4 text-orange-600">Legacy ({projectionYears + legacyYears} years)</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Portfolio Value</p>
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(results.legacyPortfolio)}</p>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm text-gray-600 mb-1">Legacy Equity</p>
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(results.legacyEquity)}</p>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm text-gray-600 mb-1">
                        Total {growthStrategy === "reinvestment" ? "Tax-Free Income" : "Cash Flow"}
                      </p>
                      <p className="text-xl font-bold text-gray-900">{formatCurrency(results.cumulativeIncome)}</p>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm text-gray-600 mb-1">
                        Average Monthly {growthStrategy === "reinvestment" ? "Tax-Free Income" : "Cash Flow"}
                      </p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(results.cumulativeIncome / (legacyYears * 12 - 1))}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chart */}
      <div className="p-8 pt-96">
        <Card className="border-orange-500 border-t-4">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-2xl text-gray-900">Portfolio Growth Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <div className="h-[475px]">
              <CombinedOverviewChart results={results} projectionYears={projectionYears} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-8">
        <Card className="border-orange-500 border-t-4">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-2xl text-gray-900">Growth Phase Analysis</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[250px]">
              <GrowthPhaseChart results={results} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-8">
        <Card className="border-orange-500 border-t-4">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-2xl text-gray-900">Property Acquisition Timeline</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[250px]">
              <PropertiesChart results={results} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-8 pt-24" >
        <Card className="border-orange-500 border-t-4">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-2xl text-gray-900">Retirement Monthly Income Projection</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[250px]">
              <RetirementIncomeChart 
                growthStrategy={growthStrategy}
                results={results}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="p-8">
        <Card className="border-orange-500 border-t-4">
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-2xl text-gray-900">Investment Comparison</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[325px]">
              <ComparisonChart 
                projectionYears={projectionYears}
                equityData={results.graphingData.map(data => data.equity)}
                initialHomes={homes}
                results={results}
              />
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t text-center text-gray-500 text-base">
          <p>This simulation is for educational purposes only and should not be considered financial advice.</p>
        </div>
      </div>
    </div>
  );
});

SimulationPDFLayout.displayName = 'SimulationPDFLayout';

export default SimulationPDFLayout;