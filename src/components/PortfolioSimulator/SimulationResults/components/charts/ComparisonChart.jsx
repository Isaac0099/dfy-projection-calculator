import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatTooltipValue, formatYAxisTick } from '@/lib/utils/utils';

const ComparisonChart = ({ projectionYears, equityData, initialHomes, results}) => {
  const reinvesting = initialHomes[0].willReinvest;
  let totalRentAddition = 0; // for adjusting our real estate returns if they don't use reinvesting.
  // Generate comparison data
  const generateData = () => {
    const data = [];
    const stockMarketReturn = 1.10; // 10% annual return
    const mixedReturn = 1.07; // 7% annual return
    const bondsReturn = 1.05; // 5% annual return
    const savingsReturn = 1.02; // 2% annual return 

    for (let month = 0; month <= projectionYears*12; month++) {
      let realEstateValue = equityData[month]
      let stockValue = 0;
      let mixedValue = 0;
      let bondsValue = 0;
      let savingsValue = 0;
      for (let home of initialHomes) {
        if (month >= home.monthOfPurchase) {
          const yearsSinceInvestment = (month - home.monthOfPurchase)/12;
          const topValue = home.getTOPValue();
          stockValue += topValue * Math.pow(stockMarketReturn, (yearsSinceInvestment));
          mixedValue += topValue * Math.pow(mixedReturn, (yearsSinceInvestment));
          bondsValue += topValue * Math.pow(bondsReturn, (yearsSinceInvestment));
          savingsValue += topValue * Math.pow(savingsReturn, (yearsSinceInvestment));
        }
      }
      if (!reinvesting) {
        totalRentAddition += results.graphingData[month].rentIncome
        realEstateValue += totalRentAddition;
      }
      console.log(`totalRentAddition: ${totalRentAddition}`)
      data.push({
        month,
        'Real Estate': realEstateValue,
        'Stock Market': stockValue,
        'Mixed': mixedValue,
        'Bonds': bondsValue,
        'Savings Account': savingsValue
      });
    }
    console.log(results.graphingData)
    return data;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={generateData()}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="month"
            label={{ value: "Years", position: "bottom" }} 
            tickFormatter={(month) => `${Math.floor(month / 12)}`}
            interval={11}
         />
          <YAxis tickFormatter={(value) => formatYAxisTick(value)} />
          <Tooltip 
            formatter={(value) => formatTooltipValue(value)}
            labelFormatter={(month) => `Year ${Math.floor(month / 12)} - Month ${month % 12}`}
          />
          <Legend verticalAlign='top' height={30}/>
          {reinvesting && 
            <Line 
              type="monotone" 
              dataKey="Real Estate" 
              stroke="#f97316" 
              strokeWidth={2} 
              dot={false}
              name="Real Estate (Equity)"
            />
          }
          {!reinvesting &&
            <Line 
            type="monotone" 
            dataKey="Real Estate" 
            stroke="#f97316" 
            strokeWidth={2} 
            dot={false}
            name="Real Estate (Equity + Total Net Rent Income)"
            />
          }
          <Line 
            type="monotone" 
            dataKey="Stock Market" 
            stroke="#84cc16" 
            strokeWidth={1} 
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="Mixed" 
            stroke="#0d9488" 
            strokeWidth={1} 
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="Bonds" 
            stroke="#1d4ed8" 
            strokeWidth={1} 
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="Savings Account" 
            stroke="#64748b" 
            strokeWidth={1} 
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonChart;