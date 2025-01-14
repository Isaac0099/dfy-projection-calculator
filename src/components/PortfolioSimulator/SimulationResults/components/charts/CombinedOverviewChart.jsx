import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatTooltipValue, formatYAxisTick } from '@/lib/utils/utils';
import { Alert, AlertDescription } from "@/components/ui/alert";

const CombinedOverviewChart = ({ results, projectionYears, legacyYears }) => {
  // Combine growth and withdrawal period data
  const combinedData = [
    ...results.graphingData,
    ...results.withdrawalGraphingData
  ];

  const retirementMonth = projectionYears * 12;

  return (
    <div className="space-y-4">   
      <div className="w-full h-96">
        <ResponsiveContainer>
          <LineChart
            data={combinedData}
            margin={{ top: 20, right: 10, left: 5, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
            <XAxis 
                dataKey="month"
                tickFormatter={(month) => `${Math.floor(month / 12)}`}
                ticks={(() => {
                    const totalYears = Math.ceil(combinedData.length / 12);
                    let yearInterval;
                    
                    // Determine interval based on total years
                    if (totalYears > 100) {
                    yearInterval = 10;
                    } else if (totalYears > 50) {
                    yearInterval = 5;
                    } else if (totalYears > 25) {
                    yearInterval = 2;
                    } else {
                    yearInterval = 1;
                    }
                    
                    // Generate array of month values at whole year marks
                    const ticks = [];
                    for (let year = 0; year <= totalYears; year += yearInterval) {
                    ticks.push(year * 12);
                    }
                    return ticks;
                })()}
                label={{ 
                value: "Years",
                position: "bottom",
                offset: 0
                }}
            />
            <YAxis 
              tickFormatter={formatYAxisTick}
              width={80}
            />
             <Tooltip 
                formatter={(value) => formatTooltipValue(value)}
                labelFormatter={(month) => `Year ${Math.floor(month / 12)} - Month ${month % 12}`}
            />
            <Legend 
              verticalAlign="top" 
              align="right"
              height={28}
            />            
            {/* Vertical line marking retirement */}
            <ReferenceLine 
              x={retirementMonth} 
              stroke="#666"
              strokeWidth={2}
            //   strokeDasharray="3 3"
              label={{ 
                value: "Retirement or Other Goal",
                position: "insideTopRight",
                fill: "#666",
                width: "6",

              }}
            />

            <Line 
              type="monotone" 
              dataKey="portfolioValue" 
              name="Portfolio Value"
              stroke="#338c1f"
              strokeWidth={2}
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="equity" 
              name="Equity"
              stroke="#EF771D"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CombinedOverviewChart;