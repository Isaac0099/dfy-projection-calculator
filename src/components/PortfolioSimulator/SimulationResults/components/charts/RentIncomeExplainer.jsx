// RentIncomeExplainer.jsx

import { AlertCircle, Calculator, CalendarDays, Home } from "lucide-react";

const RentIncomeExplainer = () => {
  return (
    <div className="w-full">
      <div className="bg-white rounded-lg p-3 shadow-md border border-gray-200">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
          <AlertCircle className="text-gray-400 w-5 h-5" />
          <h2 className="text-sm font-bold text-gray-900">How is rental income calculated?</h2>
        </div>

        <div className="space-y-4 text-sm">
          {/* Main Formula */}
          <div className="flex items-center gap-2 font-semibold italic px-2">
            <span className="text-gray-900">Monthly Income</span>
            <span className="text-gray-500">=</span>
            <span className="text-orange-500">Appreciated Rent</span>
            <span className="text-gray-500">−</span>
            <span className="text-orange-500">Total Expenses</span>
          </div>

          {/* Property Types */}
          <div className="bg-orange-50 rounded border border-orange-200 p-2">
            <div className="flex items-center gap-2 mb-2">
              <Home className="text-orange-500 w-4 h-4" />
              <span className="text-gray-900 font-medium">Property Types</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white rounded p-2 border border-orange-100">
                <div className="font-medium text-gray-800">Long-Term Rentals</div>
                <div className="text-gray-600 text-sm mt-1">
                  Traditional year-long leases with lower management costs and stable income.
                </div>
              </div>
              <div className="bg-white rounded p-2 border border-orange-100">
                <div className="font-medium text-gray-800">Mid-Term Rentals</div>
                <div className="text-gray-600 text-sm mt-1">
                  1-6 month furnished rentals with higher income potential but increased costs.
                </div>
              </div>
            </div>
          </div>

          {/* Rent Section */}
          <div>
            <div className="flex items-center gap-2 px-2 mb-2">
              <CalendarDays className="text-gray-400 w-4 h-4" />
              <span className="text-gray-900 font-medium">Appreciated Rent</span>
              <span className="text-gray-500">=</span>
              <span className="text-orange-500 font-medium">Initial Rent</span>
              <span className="text-gray-500">x</span>
              <span className="text-orange-500">Growth Rate</span>
            </div>

            <div className="bg-gray-50 rounded border border-gray-200 p-2">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-2">
                  <div className="text-gray-600 font-medium min-w-24">Initial Rent</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-700">Long-Term:</div>
                      <div className="text-orange-500 bg-white px-2 py-0.5 rounded text-sm border border-orange-100">
                        Initial Home Price × 0.67%
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-700">Medium-Term:</div>
                      <div className="text-orange-500 bg-white px-2 py-0.5 rounded text-sm border border-orange-100">
                        Initial Home Price × 1.35%
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-gray-600 font-medium min-w-24">Growth Rate</div>
                  <div className="text-orange-500 bg-white px-2 py-0.5 rounded text-sm border border-orange-100">
                    (1.03)^years
                  </div>
                  <div className="text-sm text-gray-400">3% annually, adjusted at the start of each year</div>
                </div>
              </div>
            </div>
          </div>

          {/* Expenses Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="text-gray-400 w-4 h-4" />
              <span className="text-gray-900 font-medium">Total Expenses</span>
              <span className="text-gray-500">=</span>
              <span className="text-gray-600">Operating Costs + Mortgage + Furnishing (Mid-Term)</span>
            </div>

            <div className="bg-gray-50 rounded border border-gray-200">
              <div className="grid grid-cols-1 gap-4 p-2">
                {/* Long-Term Expenses */}
                <div>
                  <div className="text-gray-700 font-medium mb-2">Long-Term Rental Expenses:</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 text-sm divide-x divide-y md:divide-y-0 divide-gray-200 border border-gray-200 rounded">
                    <div className="p-2 bg-white">
                      <div className="text-gray-600">Insurance</div>
                      <div className="text-orange-500 font-medium mt-0.5">5%</div>
                    </div>
                    <div className="p-2 bg-white">
                      <div className="text-gray-600">Management</div>
                      <div className="text-orange-500 font-medium mt-0.5">$99/mo with 2.5% inflation</div>
                    </div>
                    <div className="p-2 bg-white">
                      <div className="text-gray-600">Property Tax</div>
                      <div className="text-orange-500 font-medium mt-0.5">14%</div>
                    </div>
                    <div className="p-2 bg-white">
                      <div className="text-gray-600">Misc.</div>
                      <div className="text-orange-500 font-medium mt-0.5">14%</div>
                    </div>
                  </div>
                </div>

                {/* Mid-Term Expenses */}
                <div>
                  <div className="text-gray-700 font-medium mb-2">Mid-Term Rental Expenses:</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 text-sm divide-x divide-y md:divide-y-0 divide-gray-200 border border-gray-200 rounded">
                    <div className="p-2 bg-white">
                      <div className="text-gray-600">Insurance</div>
                      <div className="text-orange-500 font-medium mt-0.5">5%</div>
                    </div>
                    <div className="p-2 bg-white">
                      <div className="text-gray-600">Management</div>
                      <div className="text-orange-500 font-medium mt-0.5">22% of rent</div>
                    </div>
                    <div className="p-2 bg-white">
                      <div className="text-gray-600">Property Tax</div>
                      <div className="text-orange-500 font-medium mt-0.5">14%</div>
                    </div>
                    <div className="p-2 bg-white">
                      <div className="text-gray-600">Utilities and Misc.</div>
                      <div className="text-orange-500 font-medium mt-0.5">12%</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 p-2 bg-gray-100/50">
                <div className="flex items-center gap-2">
                  <span className="text-orange-500">+ Mortgage Payment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary section */}
          <div className="bg-blue-50 p-2 rounded border border-blue-200">
            <div className="text-blue-800 font-medium">Key Differences:</div>
            <ul className="mt-1 text-gray-700 space-y-1 pl-5 list-disc">
              <li>Mid-term rentals generate approximately 2x the gross income</li>
              <li>Mid-term rentals have higher management fees (20% vs. flat $99/mo w/ inflation)</li>
              <li>Mid-term rentals require initial furnishing investment (5% of purchase price)</li>
              <li>
                Mid-term rentals also have utilities for us to cover, but the cleaning fees are included in the
                management fee so misc. expenses ends up being lower
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentIncomeExplainer;
