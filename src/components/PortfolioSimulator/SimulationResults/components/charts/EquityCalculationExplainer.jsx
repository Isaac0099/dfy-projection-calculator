import { AlertCircle, Calculator, TrendingUp, Landmark } from "lucide-react";
import { Card } from "@/components/ui/card";

const EquityCalculationExplainer = () => {
  return (
    <div className="w-full">
      <Card className="p-3">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="text-gray-900 w-4 h-4" />
          <h2 className="text-sm font-semibold text-gray-900">How is this calculated?</h2>
        </div>

        <div className="space-y-3">
          {/* Main Explanation */}
          <div className="space-y-1.5">
            <p className="text-sm text-gray-900">
              This chart illustrates your retirement{" "}
              <span className="text-orange-500 font-medium">tax-free income</span> through strategic equity access.
            </p>
            <p className="text-sm text-gray-900">
              The simulation shows annual refinancing of your highest-equity property, with proceeds distributed as
              monthly income.
            </p>
          </div>

          {/* Refinance Amount Formula */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-2.5">
            <div className="flex items-center gap-2 mb-2">
              <Landmark className="text-gray-900 w-3.5 h-3.5" />
              <span className="text-xs font-medium text-gray-900">Target Refinance Amount</span>
            </div>
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-2 border border-gray-200">
                <code className="text-orange-500 text-xs font-mono">
                  Portfolio Value × Appreciation Rate × Percent Used × Years Between Refinances
                </code>
              </div>
              <p className="text-xs text-gray-600 italic py-0 my-0">
                We are trying to pull out only the equity built up behind the scenes due to appreciation. That way it
                shoud be sustainable indefinetly. (We use 75% of this appreciation as the default in the advanced
                settings to be conservative)
              </p>
            </div>
          </div>

          {/* Calculation Formula */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-2.5">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="text-gray-900 w-3.5 h-3.5" />
              <span className="text-xs font-medium text-gray-900">Monthly Income</span>
            </div>
            <div className="space-y-2">
              <div className="bg-white rounded-lg p-2 border border-gray-200">
                <code className="text-orange-500 text-xs font-mono">
                  (Refinance Payout - Refinance Cost) ÷ Months Between Refinances - any future higher mortgages payments
                  not fully covered by rent
                </code>
              </div>
              <p className="text-xs text-gray-600 italic py-0 my-0">
                Rent calculation details can be seen on the pay off principal simulation
              </p>
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 p-2.5">
            <div className="flex items-center gap-2 mb-1.5">
              <TrendingUp className="text-gray-900 w-3.5 h-3.5" />
              <span className="text-xs font-medium text-gray-900">Additional Details</span>
            </div>
            <p className="text-xs text-gray-600">
              If withdrawal income appears lower than what are target income equation suggests then, your
              portfolio&apos;s target equity access exceeds single-property refinancing. Multiple refinances could be
              executed if needed.
            </p>
            <p className="text-xs text-gray-600 py-0 my-0">
              (Refinance Cost is assumed to be $7,000 with 2.5% inflation adjustment)
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EquityCalculationExplainer;
