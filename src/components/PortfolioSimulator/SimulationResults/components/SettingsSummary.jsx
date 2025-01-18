import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Settings, Clock, Percent, Home as HomeIcon } from 'lucide-react';
import { formatCurrency, getWeightedAverageAppreciation } from '@/lib/utils/utils';

const SettingsSummary = ({ projectionYears, legacyYears, results }) => {
  const [expanded, setExpanded] = useState(false);
  const homes = results.inputHomes
  const strategy = homes[0].willReinvest ? "Equity Reinvestment" : "Paying Off Principal";
  
  return (
    <Card className="mb-4 bg-gray-100 rounded-md rounded-t-lg">
      <CardHeader className="py-2 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-orange-600" />
            <CardTitle className="text-base">Plan Summary</CardTitle>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
          >
            {expanded ? (
              <>Show Less <ChevronUp className="h-4 w-4 ml-1" /></>
            ) : (
              <>Show Details <ChevronDown className="h-4 w-4 ml-1" /></>
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent className="py-0 px-4 pb-3">
        <div className="space-y-2">
          {/* Metrics row */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-sm">{projectionYears} year growth period</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-sm">{legacyYears} year withdraw period</span>
            </div>
            <div className="flex items-center space-x-2">
              <HomeIcon className="h-4 w-4 text-orange-600" />
              <span className="text-sm">{homes.length} {homes.length > 1 ? "Properties" : "Property"}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="h-4 w-4 text-orange-600" />
              <span className="text-sm">{strategy}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Percent className="h-4 w-4 text-orange-600" />
              <span className="text-sm">{(getWeightedAverageAppreciation(homes)*100).toFixed(1)}% Avg. Appreciation</span>
            </div>
          </div>

          {/* Expandable property details */}
          {expanded && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-2 border-t border-gray-200">
              {homes.map((home, index) => (
                <div 
                  key={index} 
                  className="p-2 bg-white rounded-lg border border-gray-200 text-sm"
                >
                  <div className="font-medium">
                    Property {index + 1}: ${home.initialHomePrice.toLocaleString()}
                  </div>
                  <div className="text-gray-600">
                    {home.isExistingProperty ? `${home.monthsPaidSoFar} months ago • Original Loan Amount ${formatCurrency(home.originalLoanAmount)} • ${home.percentAnnualHomeAppreciation}% apr` : `Month ${home.monthOfPurchase} • ${home.percentDownPayment}% down • ${home.percentAnnualHomeAppreciation}% apr`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsSummary;