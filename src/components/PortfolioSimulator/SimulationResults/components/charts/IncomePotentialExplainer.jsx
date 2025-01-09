import React from 'react';
import { AlertCircle, Calculator, Divide, Sigma, Minus } from 'lucide-react';

const IncomePotentialExplainer = () => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2 border-b border-gray-200 pt-3 pb-1">
        <AlertCircle className="text-gray-400 w-4 h-4" />
        <h2 className="text-base font-bold text-gray-900">How is this Calculated?</h2>
      </div>

      <div className="space-y-2">
        {/* Main Description - More compact spacing */}
        <div className="space-y-1 text-sm text-gray-600">
          <p>This chart displays <span className="italic font-bold">potential tax-free monthly income</span> from strategic equity access.</p>
          <p>The model calculates a hypothetical amount you could withdraw each month by refinancing your property, based on its expected appreciation.</p>
          <p>Our simulation assumes you don&apos;t take this money out, but here we show what is possible to emphasize its growth.</p>
          <p>Since home values typically increase over time, this approach can provide sustainable income as long as withdraws stay within the appreciation limits.</p>
        </div>

        {/* Calculation Formula */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="text-gray-400 w-4 h-4" />
            <h3 className="text-sm font-medium text-gray-900">Monthly Income Calculation</h3>
          </div>
          
          {/* Formula Box - More compact */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 text-sm">
            {/* Step 1 */}
            <div className="p-2 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-orange-700 px-1.5 py-0.5 rounded text-xs font-medium">1</span>
                <div className="flex items-center gap-1">
                  <p className="text-orange-500">Portfolio growth over the next year =</p>
                  <Sigma className="text-orange-500 w-4 h-4" />
                  <span className="text-orange-500">(Current Home Value × Percent Appreciation) x 75%</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-2 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-orange-700 px-1.5 py-0.5 rounded text-xs font-medium">2</span>
                <div className="flex items-center gap-1">
                  <span className="text-orange-500">Annual Growth After Costs = Portfolio Growth </span>
                  <Minus className="text-orange-500 w-4 h-4" />
                  <span className="text-orange-500">Refi Costs</span>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-2 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-orange-700 px-1.5 py-0.5 rounded text-xs font-medium">3</span>
                <div className="flex items-center gap-1">
                  <span className="text-orange-500">Monthly Income = Annual Growth After Refi Cost</span>
                  <Divide className="text-orange-500 w-4 h-4" />
                  <span className="text-orange-500">12 monhths</span>
                </div>
              </div>
            </div>
            
            {/* Note */}
            <div className="p-2 bg-gray-100/50 flex items-center gap-2">
              <div className="w-1 h-1 bg-orange-500 rounded-full"></div>
              <p className="text-xs text-gray-600">
                75% safety factor ensures sustainable withdrawals
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomePotentialExplainer;