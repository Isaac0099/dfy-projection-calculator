import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

const GrowthPhaseExplainer = ({ growthStrategy }) => {
  const isReinvestment = growthStrategy === "reinvestment";
  
  return (
    <Alert className="mb-6 bg-blue-50 border-blue-200">
      {isReinvestment ? (
        <div className="space-y-2">
          <p className="font-semibold">Notice the pattern in the chart below:</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <span>
              periodic dips in equity <span className="italic">(as you take money out through refinancing)</span>
            </span>
          </div>
          <p className="italic pl-6">followed by:</p>
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-[#338c1f] flex-shrink-0" />
            <span>
              jumps in portfolio value <span className="italic">(as you use that money to purchase additional properties)</span>. 
              This strategy maximizes your portfolio's growth potential by leveraging your equity to acquire more properties over time.
            </span>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-2">
          <ArrowUpRight className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
          <span>
            In the chart below, watch how your <span className="font-medium">equity line gradually climbs to match your portfolio value</span> as you pay down your mortgages. 
            This debt-reduction strategy provides you with fully paid-off properties by retirement, maximizing your rental income potential.
          </span>
        </div>
      )}
    </Alert>
  );
};

export default GrowthPhaseExplainer;