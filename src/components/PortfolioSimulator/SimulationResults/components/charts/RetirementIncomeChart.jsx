
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatTooltipValue, formatYAxisTick } from "@/lib/utils/utils";

const RetirementIncomeChart = ({growthStrategy, results}) => {
    return(
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
    );
}

export default RetirementIncomeChart;