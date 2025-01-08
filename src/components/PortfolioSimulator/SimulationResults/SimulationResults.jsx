// SimulationResults.jsx

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Home, TrendingUp, Wallet, ChevronDown, ChevronUp, Calendar, Percent, ScrollText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import SettingsSummary from './components/SettingsSummary';
import { formatYAxisTick, formatTooltipValue, formatCurrency } from '@/lib/utils/utils';
import ComparisonChart from './components/ComparisonChart';
import MetricCard from './components/MetricCard';
import MetricsGrid from './components/MetricsGrid';
import RentIncomeExplainer from './components/RentIncomeExplainer';
import EquityCalculationPanel from './components/EquityCalculationPanel';
import ComparisonExplainer from './components/ComparisonExplainer';
import IncomePotentialExplainer from './components/IncomePotentialExplainer';
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
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <TabsTrigger value="retirement income">Retirement Income</TabsTrigger>
          {/* <TabsTrigger value="rent v mortgage">Rent v Mortgage</TabsTrigger> */}
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
              <IncomePotentialExplainer /> 
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
                    <YAxis 
                      tickFormatter={(value) => formatYAxisTick(value)} 
                      width={projectionYears > 10 ? 66 : 60}
                    />
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
                      name="Equity Income Potential"
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


        <TabsContent value="retirement income">
          <ChartSection 
            title="Withdrawal Period Income Simulation"
            description="This chart shows your potential monthly income during retirement. Calculated from annual refinancing of your highest-equity property or by showing your income from rent, depending on your chosen growth strategy."
          >
            <div className="space-y-5">
              { growthStrategy === "reinvestment" &&
                <EquityCalculationPanel />
              }
              { growthStrategy === "payOffPrincipal" &&
                <RentIncomeExplainer />
              }
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
                    <YAxis 
                      tickFormatter={(value) => formatYAxisTick(value)}
                      width={65} />
                    <Tooltip 
                      formatter={(value) => formatTooltipValue(value)}
                      labelFormatter={(month) => `Year ${Math.floor(month / 12)} - Month ${month % 12}`}
                    />
                    {growthStrategy === "payOffPrincipal" &&
                      <Line 
                      type="monotone"
                      name="Gross Rent" 
                      dataKey="grossRentIncome" 
                      stroke="#8daffe"
                      strokeWidth={2}
                      dot={false}
                      />
                    }
                    <Line 
                      type="monotone" 
                      dataKey="monthlyIncome" 
                      stroke="#f97316" 
                      strokeWidth={2}
                      dot={false}
                      name = {growthStrategy ==="reinvestment" ? "Tax-free Monthly Income" : "Monthly Income"}
                    />
                    {/* <Line 
                      type="monotone" 
                      dataKey="equity" 
                      stroke="#f97316" 
                      strokeWidth={2}
                      dot={false}
                      name = "equity"
                    /> */}
                    {growthStrategy === "payOffPrincipal" &&
                    <Legend verticalAlign="top" align="right" />
                    }
                  </LineChart>
                </ResponsiveContainer>
              </div>
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
                    name="Rent income"
                    dataKey="rentIncome" 
                    stroke="#338c1f" 
                    strokeWidth={2}
                    dot={false}
                  />
                  {/* <Line 
                    type="monotone"
                    name="Total of all mortgage payments" 
                    dataKey="mortgagePaymentSum" 
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={false}
                  /> */}
                  <Legend verticalAlign="top" align="right"/>
                </LineChart>
              </ResponsiveContainer>
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