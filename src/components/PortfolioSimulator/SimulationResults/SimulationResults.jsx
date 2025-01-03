// SimulationResults.jsx

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Home, TrendingUp, Wallet, ChevronDown, ChevronUp, Calendar, Percent, ScrollText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SettingsSummary from './components/SettingsSummary';
import { formatYAxisTick, formatTooltipValue, formatKeyMetricCardNumber } from '@/lib/utils/utils';
import ComparisonChart from './components/ComparisonChart';
import MetricCard from './components/MetricCard';
import MetricsGrid from './components/MetricsGrid';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};


const ChartSection = ({ title, description, children }) => (
  <Card className="mb-4">
    <CardHeader className="pb-2">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);


export const SimulationResults = ({ homes, projectionYears, legacyYears, results, onReset, onEdit }) => {
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
      {/* Main Summary Alert */}
      <Alert className="bg-orange-50 border-orange-200">
        <AlertTitle className="text-2xl font-semibold text-orange-800">
          Portfolio Projection Summary
        </AlertTitle>
        <AlertDescription className="text-orange-700">
          Showing what&apos;s possible with DFY
        </AlertDescription>
      </Alert>

      <SettingsSummary homes={homes} projectionYears={projectionYears} legacyYears={legacyYears}/>

     {/* All Metrics in Timeline Layout */}
      <MetricsGrid 
        results={results}
        homes={homes}
        projectionYears={projectionYears}
        legacyYears={legacyYears}
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
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <MetricCard
              icon={DollarSign}
              title="Monthly Equity Income"
              value={formatCurrency((results.graphingData[projectionYears*12].portfolioValue * 
                results.homes[0].percentAnnualHomeAppreciation/100 * 0.75 - 
                results.homes[0].getCurrentRefiCost(projectionYears*12)) / 12)}
              description="Tax-free through refinancing"
              small={true}
            />
            <MetricCard
              icon={Percent}
              title="Leverage Ratio"
              value={`${((results.graphingData[projectionYears*12].portfolioValue - 
                results.graphingData[projectionYears*12].equity) / 
                results.graphingData[projectionYears*12].portfolioValue * 100).toFixed(1)}%`}
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
          <TabsTrigger value="income">Income Potential</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="comparison">
            <span className="hidden lg:inline">Compare Other Investments</span>
            <span className="hidden md:inline lg:hidden">Compare Investments</span>
            <span className="md:hidden">Compare</span>
          </TabsTrigger>
          <TabsTrigger value="withdrawal monthly income">Retirement Income</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <ChartSection 
            title="Portfolio Growth"
            description="Track your portfolio value and equity growth over time"
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={results.graphingData}
                  margin={{ top: 0, right: 10, left: 0, bottom: 15 }} 
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month"
                    tickFormatter={(month) => `${Math.floor(month / 12)}`}
                    interval={11}
                    label={{
                      value:"Years",
                      position: "bottom",
                      offset: 0
                    }}
                  />
                  <YAxis tickFormatter={(value) => formatYAxisTick(value)} />
                  <Tooltip 
                    formatter={(value) => formatTooltipValue(value)}
                    labelFormatter={(month) => `Year ${Math.floor(month / 12)} - Month ${month % 12}`}
                  />
                  <Line 
                    type="monotone" 
                    name="Portfolio Value"
                    dataKey="portfolioValue" 
                    stroke="#338c1f" 
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line 
                    type="monotone"
                    name="Equity" 
                    dataKey="equity" 
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Legend verticalAlign="top" align="right"/>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartSection>
        </TabsContent>

        <TabsContent value="income">
          <ChartSection 
            title="Income Potential"
            description="Projected possible monthly income through equity access"
          >
            <div className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertTitle className="text-blue-800 font-sans font-bold">How is this Calculated?</AlertTitle>
                <AlertDescription className="text-blue-700 font-sans">
                  <p>This chart displays <span className="italic font-bold">potential tax-free monthly income</span> income from strategic equity access.</p> 
                  <p>The model calculates a hypothetical amount you could withdraw each month by refinancing your property, based on its expected appreciation.</p>
                  <p>Our simulation assumes you don&apos;t take this money out, but here we show what is possible to emphasize its growth.</p>
                  
                  <p>Since home values typically increase over time, this approach can provide sustainable income as long as withdraws stay within the appreciation limits.</p>

                  <div className='flex items-center gap-2 bg-white pl-3 rounded-md pt-1 mt-4 rounded-b-none'>
                    <p className="text-sm font-bold text-gray-700">Monthly Income Calculation:</p>
                    <p className="font-sans text-orange-600">
                      [[Σ(HomeValue × HomeAppreciation)] × 0.75 − RefiCost] ÷ 12
                    </p>
                  </div>
                  <p className="bg-white rounded-b-md rounded-t-none pt-0 pb-2 mb-0 text-xs italic text-gray-600 pl-3">
                    We use 75% of the appreciation rate to ensure sustainable withdrawals
                  </p>
                </AlertDescription>
              </Alert>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={results.graphingData}
                    margin={{ top: 0, right: 10, left: 0, bottom: 15 }} 
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month"
                      tickFormatter={(month) => `${Math.floor(month / 12)}`}
                      interval={11}
                      label={{
                        value:"Years",
                        position: "bottom",
                        offset: 0
                      }}
                    />
                    <YAxis tickFormatter={(value) => formatYAxisTick(value)} />
                    <Tooltip 
                      formatter={(value) => formatTooltipValue(value)}
                      labelFormatter={(month) => `Year ${Math.floor(month / 12)} - Month ${month % 12}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="equityIncome" 
                      stroke="#f97316" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ChartSection>
        </TabsContent>

        <TabsContent value="withdrawal monthly income">
          <ChartSection 
            title="Withdrawal Period Income Simulation"
            description="This chart shows your potential monthly income during retirement, calculated from annual refinancing of your highest-equity property."
          >
            <div className="space-y-5">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertTitle className="text-blue-800 font-sans font-bold">How is this Calculated?</AlertTitle>
                <AlertDescription className="text-blue-700 font-sans">
                  <p>This chart illustrates your retirement <span className="italic font-bold">tax-free income</span> through strategic equity access.</p>
                  <p>The simulation shows annual refinancing of your highest-equity property, with proceeds distributed as monthly income.</p>
                  <p></p>
                  <p className="italic text-xs">(If withdrawal income appears lower than income potential chart, your portfolio&apos;s target equity access exceeds single-property refinancing. Multiple refinances could be executed if needed.)</p>
                  <div className='flex items-center gap-2 bg-white pl-3 rounded-md pt-1 mt-4 rounded-b-none'>
                    <p className="text-sm font-bold text-gray-700">Target Monthly Income:</p>
                    <p className="font-sans text-orange-600">
                      (Portfolio Value × Appreciation Rate × 0.75 - Refinance Cost) ÷ 12
                    </p>
                  </div>
                  <p className="bg-white rounded-b-md rounded-t-none pt-0 pb-2 mb-0 text-xs italic text-gray-600 pl-3">
                      We use 75% of the appreciation rate to ensure sustainable withdrawals
                  </p>
                </AlertDescription>
              </Alert>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart 
                    data={results.withdrawalGraphingData}
                    margin={{ top: 0, right: 10, left: 0, bottom: 15 }} 
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month"
                      tickFormatter={(month) => `${Math.floor(month / 12)}`}
                      interval={11}
                      label={{
                        value:"Years",
                        position: "bottom",
                        offset: 0
                      }}
                    />
                    <YAxis tickFormatter={(value) => formatYAxisTick(value)} />
                    <Tooltip 
                      formatter={(value) => formatTooltipValue(value)}
                      labelFormatter={(month) => `Year ${Math.floor(month / 12)} - Month ${month % 12}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="withdrawalMonthlyIncome" 
                      stroke="#f97316" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </ChartSection>
        </TabsContent>

        <TabsContent value="properties">
          <ChartSection 
            title="Property Growth"
            description="Track your property acquisition over time"
          >
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={results.graphingData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 15 }} 
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="month"
                    tickFormatter={(month) => `${Math.floor(month / 12)}`}
                    interval={11}
                    label={{
                      value:"Years",
                      position: "bottom",
                      offset: 0
                    }}
                  />
                  <YAxis 
                    allowDecimals={false}
                    domain={[0, results.homes.length]}
                  />
                  <Tooltip 
                    formatter={(value) => [value, "Properties"]}
                    labelFormatter={(month) => `Year ${Math.floor(month / 12)} - Month ${month % 12}`}
                  />
                  <Line 
                    type="stepAfter" 
                    dataKey="propertyCount" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartSection>
        </TabsContent>
        
        <TabsContent value="comparison">
          <ChartSection 
            title="Investment Comparison"
            description="Compare real estate returns with traditional investment vehicles"
          >
            <div className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertTitle className="text-blue-800 font-semibold pb-1">Why Compare Investments?</AlertTitle>
                <AlertDescription className="text-blue-700">
                  <p>
                    This comparison shows how real estate investment through DFY can potentially outperform traditional investment vehicles, 
                    factoring in benefits like leverage and appreciation. This graph assumes the same time of input and amount for investment(s) into
                    each strategy 
                  </p>
                  <p>
                    (here it shows {formatCurrency(results.totalOutOfPocket)} for each strategy.) 
                  </p>
                  <p>
                    Real estate has further tax benefits 
                    over these options not reflected here
                  </p>
                  <p className="italic font-semibold text-xs pt-2"> NOTE: Your best results will come with choosing to actively refinance properties to buy more throughout the growth period</p>
                </AlertDescription>
              </Alert>
              
              <ComparisonChart 
                projectionYears={projectionYears}
                equityData={results.graphingData.map(data => data.equity)}
                initialHomes={homes}
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