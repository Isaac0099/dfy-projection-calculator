import { Card, CardContent } from "@/components/ui/card";

const WithdrawalIncomeExplanation = () => {
  return (
    <Card className="bg-white border-0 shadow-none pt-0">
      <CardContent className="p-1 pt-0 space-y-1">
        {/* Formula section */}
        <div className="rounded-lg p-2">
          <div className="space-y-1">
            <p className="text-m font-bold text-gray-700">Monthly Income Calculation:</p>
            <p className="font-sans text-orange-600 ">
              (Portfolio Value × Appreciation Rate × 0.75 - Refinance Cost) ÷ 12
            </p>
            <p className="text-xs italic text-gray-600 pl-2">
                We use 75% of the appreciation rate to ensure sustainable withdrawals. <span>Refincance cost is assumed to be $7,000 w/ 2.5% inflation</span>
            </p>
          </div>
        </div>

        {/* Note */}
        <p className="text-sm text-gray-600">
          Lower values may indicate that your portfolio&apos;s potential exceeds what&apos;s possible 
          through a single refinance — multiple refinances could be used if needed.
        </p>
      </CardContent>
    </Card>
  );
};

export default WithdrawalIncomeExplanation;



