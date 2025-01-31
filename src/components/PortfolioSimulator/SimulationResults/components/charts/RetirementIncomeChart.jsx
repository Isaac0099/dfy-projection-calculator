import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatTooltipValue, formatYAxisTick } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from 'lucide-react';

const RetirementIncomeChart = ({ growthStrategy, results }) => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <div className="space-y-4">
            {growthStrategy === "reinvestment" && (
                <div className="flex justify-end">
                    <Button
                        variant="ghost"
                        className="text-sm text-gray-500 hover:text-orange-500"
                        onClick={() => {
                                        setShowDetails(!showDetails)
                                        console.log(showDetails)}}
                    >
                        {showDetails ? (
                            <ChevronUp className="h-4 w-4 mr-2" />
                        ) : (
                            <ChevronDown className="h-4 w-4 mr-2" />
                        )}
                        {showDetails ? 'Hide Details' : 'Show Details'}
                    </Button>
                </div>
            )}
            
            <div className="w-full h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                        data={results.withdrawalGraphingData}
                        margin={{ top: 20, right: 10, left: 0, bottom: 15 }} 
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="month"
                            tickFormatter={(month) => `${Math.floor(month / 12)}`}
                            interval={11}
                            label={{
                                value: "Years",
                                position: "bottom",
                                offset: 0
                            }}
                        />
                        <YAxis 
                            tickFormatter={(value) => formatYAxisTick(value)}
                            width={65}
                        />
                        <Tooltip 
                            formatter={(value) => formatTooltipValue(value)}
                            labelFormatter={(month) => `Year ${Math.floor(month / 12)} - Month ${month % 12}`}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="monthlyIncome" 
                            stroke="#f97316" 
                            strokeWidth={4}
                            dot={false}
                            name={growthStrategy === "reinvestment" ? "Net Tax-free Income" : "Net Monthly Income"}
                        />
                        {/* Pay off principal specific line */}
                        {growthStrategy === "payOffPrincipal" && (
                            <Line 
                                type="monotone"
                                name="Gross Rent" 
                                dataKey="grossRentIncome" 
                                stroke="#8daffe"
                                strokeWidth={2}
                                dot={false}
                            />
                        )}
                        {/* Buy borrow beyond specific lines - only show when details are enabled */}
                        {growthStrategy === "reinvestment" && showDetails && (
                              <Line 
                                  type="monotone" 
                                  dataKey="equityIncome" 
                                  stroke="#008412" 
                                  strokeWidth={1}
                                  dot={false}
                                  name="Gross Income From Refinancing"
                              />
                        )}
                        {growthStrategy === "reinvestment" && showDetails && (
                              <Line 
                                  type="monotone" 
                                  dataKey="mortgageNotCoveredByRent" 
                                  stroke="#b91800" 
                                  strokeWidth={1}
                                  dot={false}
                                  name="Mortgage Not Covered by Rent"
                              />
                            
                        )}
                        <Legend verticalAlign="top" align="right" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RetirementIncomeChart;