
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatTooltipValue, formatYAxisTick } from "@/lib/utils/utils";

const RetirementIncomeChart = ({growthStrategy, results}) => {
    return(
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
                        value:"Years",
                        position: "bottom",
                        offset: 0
                      }}
                    />
                    <ReferenceLine
                      y={0}
                      strokeDasharray="4 4"
                      stroke="#000000"
                      strokeWidth={2}
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
                    {growthStrategy === "payOffPrincipal" &&
                    <Line 
                      type="monotone" 
                      dataKey="rentIncome" 
                      stroke="#f97316" 
                      strokeWidth={2}
                      dot={false}
                      name="Monthly Net Rent Income"
                    />
                    }
                    {growthStrategy === "reinvestment" &&
                    <Line 
                      type="monotone" 
                      dataKey="equityIncome" 
                      stroke="#005909" 
                      strokeWidth={2}
                      dot={false}
                      name="Gross Tax-free Equity Income"
                    />
                    }
                    {growthStrategy === "reinvestment" &&
                    <Line 
                      type="monotone" 
                      dataKey="rentIncome" 
                      stroke="#c10000" 
                      strokeWidth={2}
                      dot={false}
                      name="Rents Minus Expenses and Mortgages"
                    />
                    }
                     <Line 
                      type="monotone" 
                      dataKey="monthlyIncome" 
                      stroke="#f97316" 
                      strokeWidth={2}
                      dot={false}
                      name="Net Income"
                    />
                    
                    {/* <Line 
                      type="monotone" 
                      dataKey="equity" 
                      stroke="#f97316" 
                      strokeWidth={2}
                      dot={false}
                      name = "equity"
                    /> */} 
                    <Legend verticalAlign="top" align="right" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
    );
}

export default RetirementIncomeChart;