import React from 'react';
import { AlertCircle, Calculator } from 'lucide-react';

const RentCalculationPanel = () => {
  return (
    <div className="w-full">
      <div className="bg-white rounded-lg p-3 shadow-md border border-gray-200">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
          <AlertCircle className="text-gray-400 w-5 h-5" />
          <h2 className="text-base font-bold text-gray-900">How is this calculated?</h2>
        </div>

        <div className="space-y-3">
          {/* Initial Calculations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium min-w-28">Initial Rent</span>
              <span className="text-orange-500 bg-gray-100 px-2 py-0.5 rounded-sm text-sm">
                Initial Home Price × 0.7%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium min-w-28">Growth Rate</span>
              <div className="flex items-center gap-2">
                <span className="text-orange-500 bg-gray-100 px-2 py-0.5 rounded-sm text-sm">
                  (1.03)^year
                </span>
                <span className="text-sm text-gray-400">3% annual</span>
              </div>
            </div>
          </div>

          {/* Monthly Costs */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="text-gray-400 w-4 h-4" />
              <h3 className="text-sm font-medium text-gray-900">Monthly Expenses</h3>
            </div>
            
            {/* Expenses Grid */}
            <div className="bg-gray-50 rounded border border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-3 text-sm">
                {/* Column 1 */}
                <div>
                  <div className="flex items-center justify-between p-2 border-b border-r border-gray-200">
                    <span className="text-gray-600">Maintenance</span>
                    <span className="text-orange-500 font-mono tabular-nums">8%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 border-r border-gray-200">
                    <span className="text-gray-600">Insurance</span>
                    <span className="text-orange-500 tabular-nums">5%</span>
                  </div>
                </div>
                
                {/* Column 2 */}
                <div>
                  <div className="flex items-center justify-between p-2 border-b border-r border-gray-200">
                    <span className="text-gray-600">Management</span>
                    <span className="text-orange-500 tabular-nums">8%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 border-r border-gray-200">
                    <span className="text-gray-600">Cap. Expenses</span>
                    <span className="text-orange-500 tabular-nums">7%</span>
                  </div>
                </div>
                
                {/* Column 3 */}
                <div className="md:border-l-0 border-l col-span-2 md:col-span-1">
                  <div className="flex items-center justify-between p-2 border-b border-gray-200">
                    <span className="text-gray-600">Property Tax</span>
                    <span className="text-orange-500 tabular-nums">15%</span>
                  </div>
                  <div className="flex items-center justify-between p-2">
                    <span className="text-gray-600">Misc.</span>
                    <span className="text-orange-500 tabular-nums">5%</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 p-2 bg-gray-100/50">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500 text-sm">+ Mortgage</span>
                  <span className="text-gray-400 text-sm">(6.5% interest rate)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Net Income - Single Line */}
          <div className="bg-gray-900 text-white rounded p-2 flex items-center justify-between">
            <span className="font-medium">Net Monthly Income</span>
            <span className="text-orange-400">
              Appreciated Rent − Total Expenses
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentCalculationPanel;