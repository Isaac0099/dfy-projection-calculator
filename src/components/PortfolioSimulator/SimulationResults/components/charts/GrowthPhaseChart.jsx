import { formatTooltipValue, formatYAxisTick } from "@/lib/utils/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const GrowthPhaseChart = ({results}) => {

    return(
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
                  <Legend 
                    verticalAlign="top" 
                    align="right"
                    height={28}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
    );
}

export default GrowthPhaseChart;