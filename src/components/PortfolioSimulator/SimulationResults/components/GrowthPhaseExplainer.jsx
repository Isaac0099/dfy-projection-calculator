import React from 'react';
import { Alert } from '@/components/ui/alert';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

const GrowthPhaseExplainer = ({ growthStrategy }) => {
  const isReinvestment = growthStrategy === "reinvestment";
  
  return (
    <Alert className="mb-6 bg-blue-50 border-blue-200">
      {isReinvestment ? (
        <div className="space-y-2">
          <p className="font-semibold mr-6">Notice the pattern in the chart below:</p>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-orange-500 flex-shrink-0" />
            <span>
              periodic dips in equity <span className="italic">(when you have enough equity to do a refinance and purchase a new home(s))</span>
            </span>
          </div>
          <p className="italic pl-6">followed by:</p>
          <div className="flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-[#338c1f] flex-shrink-0" />
            <span>
              jumps in portfolio value <span className="italic">(as you use that money to purchase additional properties)</span>. 
            </span>
          </div>
          <p>This strategy maximizes your portfolio&apos;s growth potential by leveraging your equity to acquire more properties over time.</p>

        </div>
      ) : (
        <div className="flex items-start gap-2">
          <ArrowUpRight className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
          <span>
            In the chart below, watch how your <span className="font-medium">equity line gradually climbs to match your portfolio value</span> as you pay down your mortgages. 
            This debt-reduction strategy provides you with fully paid-off properties eventually, maximizing your rental income at the cost the of missing out on the benifits (and risks) of leverage and tax-free refinance based income.
          </span>
        </div>
      )}
    </Alert>
  );
};

export default GrowthPhaseExplainer;