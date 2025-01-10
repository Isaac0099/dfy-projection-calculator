// SimulationResults.jsx

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Home, TrendingUp, Wallet, ChevronDown, ChevronUp, Calendar, Percent, ScrollText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LogoBanner } from './components/LogoBanner';
import SettingsSummary from './components/SettingsSummary';
import { formatYAxisTick, formatTooltipValue, formatCurrency } from '@/lib/utils/utils';
import CombinedOverviewChart from './components/charts/CombinedOverviewChart';
import GrowthPhaseExplainer from './components/GrowthPhaseExplainer';
import GrowthPhaseChart from './components/charts/GrowthPhaseChart';
import PropertiesChart from './components/charts/PropertiesChart';
import ComparisonChart from './components/charts/ComparisonChart';
import MetricCard from './components/MetricCard';
import MetricsGrid from './components/MetricsGrid';
import RentIncomeExplainer from './components/charts/RentIncomeExplainer';
import EquityCalculationExplainer from './components/charts/EquityCalculationExplainer';
import RetirementIncomeChart from './components/charts/RetirementIncomeChart';
import ComparisonExplainer from './components/charts/ComparisonExplainer';
import IncomePotentialExplainer from './components/charts/IncomePotentialExplainer';
import RentVMortgageChart from './components/charts/RentVMortgageChart';
import ChartSection from './components/ChartSection';


export const SimulationResults = ({ homes, projectionYears, legacyYears, growthStrategy, results, onReset, onEdit }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Calculate the changes
  const calculateEquityChange = () => {
    const start = results.graphingData[results.homes[0].monthOfPurchase].equity; // looking at the first home in our list and seeing when it was purchased so that we know when to check for the first equity value
    const end = results.graphingData[projectionYears*12].equity;
    return ((end - start) / start * 100).toFixed(1);
  };

  const calculatePortfolioChange = () => {
    const start = results.graphingData[results.homes[0].monthOfPurchase].portfolioValue; // looking at the first home in our list and seeing when it was purchased so that we know when to check for the first equity value
    const end = results.graphingData[projectionYears*12].portfolioValue;
    return ((end - start) / start * 100).toFixed(1);
  };
  
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-4">
      {/* DFY Logo across the top */}
      <LogoBanner />
      
      {/* Summary of Input Settings Used to Genertate These Results*/}
      <SettingsSummary homes={homes} projectionYears={projectionYears} legacyYears={legacyYears}/>

     {/* All Metrics in Timeline Layout */}
      <MetricsGrid 
        results={results}
        homes={homes}
        projectionYears={projectionYears}
        legacyYears={legacyYears}
        growthStrategy={growthStrategy}
        calculateEquityChange={calculateEquityChange}
        calculatePortfolioChange={calculatePortfolioChange}
      />

      {/* Detailed Metrics Section */}
      <div className="mb-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center space-x-2 text-sm text-gray-300 hover:text-orange-400"
        >
          {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          <span>{showDetails ? 'Hide' : 'Show'} detailed metrics</span>
        </button>
        
        {showDetails && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              icon={Percent}
              title="Leverage Ratio at Retirement"
              value={`${((results.graphingData[projectionYears*12].portfolioValue - 
                results.graphingData[projectionYears*12].equity) / 
                results.graphingData[projectionYears*12].portfolioValue * 100).toFixed(1)}%`}
              description="Debt to asset ratio"
              small={true}
            />
            <MetricCard
              icon={Percent}
              title="Leverage Ratio at End of Life"
              value={`${((results.withdrawalGraphingData[legacyYears*12-1].portfolioValue - 
                results.withdrawalGraphingData[legacyYears*12-1].equity) / 
                results.withdrawalGraphingData[legacyYears*12-1].portfolioValue * 100).toFixed(1)}%`}
              description="Debt to asset ratio"
              small={true}
            />
          </div>
        )}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 lg:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="growthPhase">Growth Phase</TabsTrigger>
          <TabsTrigger value="retirement income">Retirement Income</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="comparison">
            <span className="hidden lg:inline">Compare Other Investments</span>
            <span className="hidden md:inline lg:hidden">Compare Investments</span>
            <span className="md:hidden">Compare</span>
          </TabsTrigger>
          {/* <TabsTrigger value="rent v mortgage">Rent v Mortgage</TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview">
          <ChartSection 
            title="Portfolio Growth"
            description="Track your portfolio value and equity growth over time"
          >
            {/* <OverviewChart
              results={results}
            /> */}
            <CombinedOverviewChart
              results={results}
              projectionYears={projectionYears}
            />
          </ChartSection>
        </TabsContent>

        <TabsContent value="growthPhase">
          <ChartSection 
            title="Your Portfolio During the Growth Phase"
            description="You can see how using refinances to buy more properties during this period puts you in a much better spot for retirement"
          >
            <div className="space-y-4">
              <GrowthPhaseExplainer growthStrategy={growthStrategy} />
              <GrowthPhaseChart results={results} />
            </div>
          </ChartSection>
        </TabsContent>


        <TabsContent value="properties">
          <ChartSection 
            title="Property Growth"
            description="Track your property acquisition over time"
          >
            <PropertiesChart results={results} />
          </ChartSection>
        </TabsContent>


        <TabsContent value="retirement income">
          <ChartSection 
            title="Retirement Income"
            description="This chart shows your potential monthly income during retirement. Calculated from annual partial refinancing of your highest-equity property or by showing your income from rent, depending on your chosen growth strategy."
          >
            <div className="space-y-5">
              { growthStrategy === "reinvestment" &&
                <EquityCalculationExplainer />
              }
              { growthStrategy === "payOffPrincipal" &&
                <RentIncomeExplainer />
              }
              <RetirementIncomeChart 
                growthStrategy={growthStrategy}
                results={results}
              />
            </div>
          </ChartSection>
        </TabsContent>
        
        <TabsContent value="comparison">
          <ChartSection 
            title="Investment Comparison"
            description="Compare real estate returns with traditional investment vehicles"
          >
            <div className="space-y-4">
              <ComparisonExplainer results={results}/>
              
              <ComparisonChart 
                projectionYears={projectionYears}
                equityData={results.graphingData.map(data => data.equity)}
                initialHomes={homes}
                results={results}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4 px-4">
                <Card className="p-4">
                  <h3 className="font-semibold text-orange-600">Real Estate Advantages</h3>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Leverage (using bank&apos;s money)</li>
                    <li>• Property appreciation</li>
                    <li>• Tax benefits</li>
                  </ul>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold text-green-600">Stock Market</h3>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Recent markets have had 10% annual return</li>
                    <li>• Higher volatility</li>
                    <li>• More liquid</li>
                  </ul>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold text-teal-600">Mix of Stocks and Bonds</h3>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• 7% annual return</li>
                    <li>• Frequently recommended by advisors</li>
                  </ul>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold text-blue-700">Bonds</h3>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• 5% annual return</li>
                    <li>• Very low risk</li>
                  </ul>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold text-gray-600">Savings Account</h3>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>• Low 2.0% annual return</li>
                    <li>• Practically no risk</li>
                    <li>• Highly liquid</li>
                  </ul>
                </Card>
              </div>
            </div>
          </ChartSection>
        </TabsContent>

        <TabsContent value="rent v mortgage">
          <ChartSection 
            title="Rents Vs Mortages"
            description=""
          >
            <RentVMortgageChart results={results} />
          </ChartSection>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <button
          onClick={onEdit}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Edit Simulation
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
        >
          New Simulation
        </button>
      </div>
    </div>
  );
};

export default SimulationResults;