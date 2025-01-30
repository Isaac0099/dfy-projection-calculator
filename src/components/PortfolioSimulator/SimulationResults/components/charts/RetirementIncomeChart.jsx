
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
                    <YAxis 
                      tickFormatter={(value) => formatYAxisTick(value)}
                      width={65} />
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
                      name = {growthStrategy ==="reinvestment" ? "Net Tax-free Income" : "Net Monthly Income"}
                    />
                    {/* payoff principle specific line*/}
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

                    {/* buy borrow beyond specific lines */}
                    {growthStrategy === "reinvestment" &&
                      <Line 
                        type="monotone" 
                        dataKey="equityIncome" 
                        stroke="#008412" 
                        strokeWidth={1}
                        dot={false}
                        name = "Gross Income From Refinancing"
                      /> 
                    }
                     {growthStrategy === "reinvestment" &&
                      <Line 
                        type="monotone" 
                        dataKey="mortgageNotCoveredByRent" 
                        stroke="#b91800" 
                        strokeWidth={1}
                        dot={false}
                        name = "Mortgage Not Covered by Rent"
                      /> 
                    }
                    <Legend verticalAlign="top" align="right" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
    );
}

export default RetirementIncomeChart;