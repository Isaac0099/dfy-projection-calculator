import { AlertCircle, Calculator } from 'lucide-react';

const RentIncomeExplainer = () => {
  return (
    <div className="w-">
      <div className="bg-white rounded-lg p-3 shadow-md border border-gray-200">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 border-b border-gray-200 pb-2">
          <AlertCircle className="text-gray-400 w-5 h-5" />
          <h2 className="text-base font-bold text-gray-900">How is this calculated?</h2>
        </div>

        <div className="space-y-2">
          {/* Main Formula */}
          <div className="flex items-center gap-2 font-semibold italic px-2">
            <span className="text-gray-900">Monthly Income</span>
            <span className="text-gray-500">=</span>
            <span className="text-orange-500">Appreciated Rent</span>
            <span className="text-gray-500">−</span>
            <span className="text-orange-500">Total Expenses</span>
          </div>

          <div className="space-y-3">
            {/* Rent Section */}
            <div>
              <div className="flex items-center gap-2 px-2 mb-2">
                <span className="text-gray-900 font-medium">Appreciated Rent</span>
                <span className="text-gray-500">=</span>
                <span className="text-orange-500 font-medium">Initial Rent × Growth Rate</span>
              </div>
              
              <div className="bg-gray-50 rounded border border-gray-200 p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="text-gray-600 font-medium min-w-24">Initial Rent</div>
                    <div className="text-orange-500 bg-white px-2 py-0.5 rounded text-sm border border-orange-100">
                      Initial Home Price × 0.67%
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-gray-600 font-medium min-w-24">Growth Rate</div>
                    <div className="text-orange-500 bg-white px-2 py-0.5 rounded text-sm border border-orange-100">
                      (1.03)^years
                    </div>
                    <div className="text-sm text-gray-400">3% annual</div>
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
                <span className="text-gray-600">Operating Costs + Mortgage</span>
              </div>

              <div className="bg-gray-50 rounded border border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 text-sm divide-x divide-y md:divide-y-0 divide-gray-200">
                  <div className="p-2">
                    <div className="text-gray-600">Insurance</div>
                    <div className="text-orange-500 font-medium mt-0.5">5%</div>
                  </div>
                  <div className="p-2">
                    <div className="text-gray-600">Management</div>
                    <div className="text-orange-500 font-medium mt-0.5">$99 per month with 2.5% inflation</div>
                  </div>
                  <div className="p-2">
                    <div className="text-gray-600">Property Tax</div>
                    <div className="text-orange-500 font-medium mt-0.5">14%</div>
                  </div>
                  <div className="p-2">
                    <div className="text-gray-600">Misc.</div>
                    <div className="text-orange-500 font-medium mt-0.5">6%</div>
                  </div>
                </div>

                <div className="border-t border-gray-200 p-2 bg-gray-100/50">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">+ Mortgage Payment</span>
                    <span className="text-gray-400 text-sm">(6.5% interest rate)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentIncomeExplainer;