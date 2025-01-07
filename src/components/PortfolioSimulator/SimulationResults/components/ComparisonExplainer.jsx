import React from 'react';
import { AlertCircle, TrendingUp } from 'lucide-react';

const ComparisonExplainer = ({ results }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg p-3 shadow-md border border-gray-200">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
          <AlertCircle className="text-gray-400 w-5 h-5" />
          <h2 className="text-base font-bold text-gray-900">Why Compare Investments?</h2>
        </div>

        <div className="space-y-3">
          {/* Main Content */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-gray-400 w-4 h-4" />
              <h3 className="text-sm font-medium text-gray-900">Investment Strategy Comparison</h3>
            </div>
            
            <p className="text-gray-600 text-sm">
              This comparison shows how real estate investment through DFY can potentially outperform traditional investment vehicles, 
              factoring in benefits like leverage and appreciation. This graph assumes the same time of input and amount for investment(s) into
              each strategy.
            </p>

            {/* Investment Amount Box */}
            <div className="bg-gray-50 rounded border border-gray-200 p-2">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-sm">Investment Amount:</span>
                <span className="text-orange-500 bg-gray-100 px-2 py-0.5 rounded-sm text-sm">
                  {formatCurrency(results?.totalOutOfPocket)}
                </span>
                <span className="text-sm text-gray-400">per strategy</span>
              </div>
            </div>

            {/* Additional Benefits */}
            <p className="text-gray-600 text-sm">
              Real estate has further tax benefits over these options not reflected here
            </p>

            {/* Note Box */}
            <div className="bg-gray-900 text-white rounded p-2">
              <p className="text-sm italic">
                NOTE: Your best results will come with choosing to actively refinance properties to buy more throughout the growth period
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonExplainer;